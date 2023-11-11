import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Post from "../main/post"; // Replace with your actual component import
import "@testing-library/jest-dom";

describe("Post", () => {
  it("should render with initial props", () => {
    render(
      <Post
        title="Initial Title"
        body="Initial Body"
        image="Initial Image"
        testId="test-post"
      />
    );

    expect(screen.getByText(/Initial Title/)).toBeInTheDocument();
    expect(screen.getByText(/Initial Body/)).toBeInTheDocument();
    expect(screen.getByTestId("test-post-image")).toHaveAttribute(
      "src",
      "Initial Image"
    );
  });

  it("should enter edit mode when Edit button is clicked", () => {
    render(
      <Post
        title="Initial Title"
        body="Initial Body"
        image="Initial Image"
        testId="test-post"
      />
    );

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByDisplayValue("Initial Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial Body")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial Image")).toBeInTheDocument();
  });

  it("should save changes when Save button is clicked", () => {
    render(
      <Post
        title="Initial Title"
        body="Initial Body"
        image="Initial Image"
        testId="test-post"
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("Initial Title"), {
      target: { value: "New Title" },
    });
    fireEvent.change(screen.getByDisplayValue("Initial Body"), {
      target: { value: "New Body" },
    });
    fireEvent.change(screen.getByDisplayValue("Initial Image"), {
      target: { value: "New Image" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText(/New Title/)).toBeInTheDocument();
    expect(screen.getByText(/New Body/)).toBeInTheDocument();
    expect(screen.getByTestId("test-post-image")).toHaveAttribute(
      "src",
      "New Image"
    );
  });

  it("should cancel changes when Cancel button is clicked", () => {
    render(
      <Post
        title="Initial Title"
        body="Initial Body"
        image="Initial Image"
        testId="test-post"
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("Initial Title"), {
      target: { value: "New Title" },
    });
    fireEvent.change(screen.getByDisplayValue("Initial Body"), {
      target: { value: "New Body" },
    });
    fireEvent.change(screen.getByDisplayValue("Initial Image"), {
      target: { value: "New Image" },
    });
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText(/Initial Title/)).toBeInTheDocument();
    expect(screen.getByText(/Initial Body/)).toBeInTheDocument();
    expect(screen.getByTestId("test-post-image")).toHaveAttribute(
      "src",
      "Initial Image"
    );
  });
});
