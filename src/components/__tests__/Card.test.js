import { render, screen, fireEvent } from "@testing-library/react";
import Card from "../Card";
import "@testing-library/jest-dom";

describe("Card", () => {
  const mockCard = {
    id: 1,
    imageUrl: "test-image.jpg",
    name: "Test Card",
  };

  test("renders card with correct data", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        onClick={() => {}}
        index={0}
        cardName={mockCard.name}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("shows image when card is flipped", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={false}
        onClick={() => {}}
        index={0}
        cardName={mockCard.name}
      />
    );

    const image = screen.getByRole("img", { name: mockCard.name });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockCard.imageUrl);
  });

  test("calls onClick when card is clicked", () => {
    const mockOnClick = jest.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        onClick={mockOnClick}
        index={0}
        cardName={mockCard.name}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("applies matched style when card is matched", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={true}
        onClick={() => {}}
        index={0}
        cardName={mockCard.name}
      />
    );

    const card = screen.getByRole("button");
    expect(card).toHaveClass("matched");
  });

  test("does not call onClick when card is already matched", () => {
    const mockOnClick = jest.fn();
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={true}
        onClick={mockOnClick}
        index={0}
        cardName={mockCard.name}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
