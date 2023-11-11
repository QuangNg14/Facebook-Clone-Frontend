import React, { useContext } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import RegistrationForm from "../auth/registration/RegistrationForm";
import { UserContext } from "../context/userContext";
import NavigateComponent from "../main/navigate";

// Mock navigate function from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

const setup = () => {
  const userContextValue = [
    null,
    jest.fn(),
    [],
    jest.fn(),
    "loggedOut",
    jest.fn(),
  ];
  return {
    ...render(
      <UserContext.Provider value={userContextValue}>
        <Router>
          <RegistrationForm />
          <NavigateComponent />
        </Router>
      </UserContext.Provider>
    ),
  };
};

describe("Registration and Login", () => {
  beforeEach(() => {
    setup();
    localStorage.setItem("loginState", "loggedOut");
    localStorage.setItem("loginUser", {});
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("should log in a previously registered user", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              username: "Bret",
              address: { street: "Kulas Light" },
            },
          ]),
      })
    );

    fireEvent.change(screen.getByTestId("username-login"), {
      target: { value: "Bret" },
    });

    fireEvent.change(screen.getByTestId("password-login"), {
      target: { value: "Kulas Light" },
    });
    // login
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users?username=Bret"
      )
    );

    await waitFor(() =>
      expect(localStorage.getItem("loginState")).toBe("loggedIn")
    );

    const storedUser = localStorage.getItem("loginUser");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    await waitFor(() => expect(parsedUser?.username).toBe("Bret"));
  });

  it("should not log in an invalid user", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              username: "Bret",
              address: { street: "Kulas Light" },
            },
          ]),
      })
    );
    fireEvent.change(screen.getByTestId("username-login"), {
      target: { value: "Bret" },
    });
    fireEvent.change(screen.getByTestId("password-login"), {
      target: { value: "wrongPass" },
    });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users?username=Bret"
      )
    );
    await waitFor(() =>
      expect(localStorage.getItem("loginState")).toBe("error")
    );
  });

  it("should logout a user", async () => {
    fireEvent.click(screen.getByTestId("logout-button"));

    await waitFor(() =>
      expect(localStorage.getItem("loginState")).toBe("loggedOut")
    );
  });
});
