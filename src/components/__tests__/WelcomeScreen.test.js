import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import WelcomeScreen from "../WelcomeScreen";
import "@testing-library/jest-dom";

describe("WelcomeScreen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("renders welcome form correctly", () => {
    renderWithRouter(<WelcomeScreen />);

    expect(screen.getByText(/welcome to memory game/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start game/i })
    ).toBeInTheDocument();
  });

  test("stores name in localStorage when form is submitted", () => {
    renderWithRouter(<WelcomeScreen />);

    const input = screen.getByLabelText(/enter your name/i);
    fireEvent.change(input, { target: { value: "Test Player" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(localStorage.getItem("playerName")).toBe("Test Player");
  });

  test("shows error message when submitting empty name", () => {
    renderWithRouter(<WelcomeScreen />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(localStorage.getItem("playerName")).toBeNull();
  });
});
