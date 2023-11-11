import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../profile/profile"; // Adjust the import to your file structure
import { BrowserRouter as Router } from "react-router-dom";

describe("Profile Component", () => {
  it("should render initial user information", () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    expect(screen.getByText(/Current Info/)).toBeInTheDocument();
    expect(screen.getByText(/Username: Quang Nguyen/)).toBeInTheDocument();
    expect(screen.getByText(/Email: abc@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Phone: 1231231234/)).toBeInTheDocument();
    expect(screen.getByText(/Zip Code: 77005/)).toBeInTheDocument();
  });

  it("should update user information", () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Find input fields and button
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const zipInput = screen.getByPlaceholderText("Zip Code");

    // Use a more specific query to select the button
    const updateButton = screen.getByRole("button", { name: /Update Info/i });

    // Fire events to update values
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    fireEvent.change(zipInput, { target: { value: "12345" } });

    // Click the update button
    fireEvent.click(updateButton);

    // Check if the information got updated
    expect(screen.getByText(/Username: New Name/)).toBeInTheDocument();
    expect(screen.getByText(/Email: new@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Phone: 9876543210/)).toBeInTheDocument();
    expect(screen.getByText(/Zip Code: 12345/)).toBeInTheDocument();
  });
});
