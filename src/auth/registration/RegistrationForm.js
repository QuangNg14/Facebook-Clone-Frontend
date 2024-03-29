import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    zipcode: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [successRegister, setSuccessRegister] = useState(false);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [
    user,
    setUser,
    registeredUsers,
    setRegisteredUsers,
    loginState,
    setLoginState,
  ] = useContext(UserContext);

  const [loginErrors, setLoginErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Validate all fields are filled
    Object.keys(formData).forEach((key) => {
      if (!formData[key])
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Email is not valid";

    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!/^\d{5}$/.test(formData.zipcode))
      newErrors.zipcode = "Zipcode must be 5 digits";

    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.passwordConfirmation)
      newErrors.passwordConfirmation = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessRegister("");

    if (validate()) {
      try {
        const response = await fetch(
          "https://ricecomp431app-5b7591b01f3b.herokuapp.com/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
              email: formData.email,
              phone: formData.phone,
              zipcode: formData.zipcode,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          // Handle success - possibly update state, store user data, redirect, etc.
          localStorage.setItem("loginState", "loggedIn");
          localStorage.setItem("loginUser", formData.username);
          // navigate("/main");
          setSuccessRegister("Successfully Resgistered");
        } else {
          throw new Error("Registration failed");
        }
      } catch (error) {
        setLoginErrors({ general: error.message });
      }
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // const res = await fetch(
    //   "https://jsonplaceholder.typicode.com/users?username=" +
    //     loginData.username
    // );
    // const users = await res?.json();

    // if (users.length > 0 && users[0].address.street === loginData.password) {
    //   let loggedInUser = users[0];
    //   console.log(loggedInUser);
    //   localStorage.setItem("loginState", "loggedIn");
    //   localStorage.setItem("loginUser", JSON.stringify(loggedInUser));
    //   navigate("/main");
    // } else {
    // setLoginState("error");
    try {
      const response = await fetch(
        "https://ricecomp431app-5b7591b01f3b.herokuapp.com/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginData.username,
            password: loginData.password,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("loginState", "loggedIn");
        localStorage.setItem("loginUser", loginData.username);
        // localStorage.setItem("loginUser", JSON.stringify(result));
        navigate("/main");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      localStorage.setItem("loginState", "error");
      setLoginErrors({ general: error.message });
    }
    // setLoginErrors({
    //   general:
    //     "Invalid username or password. Password should be the address street name",
    // });
    // }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6}>
          <h2>Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                data-testid="username-register"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                data-testid="email-register"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                data-testid="phone-register"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="zipcode">
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zipcode"
                name="zipcode"
                data-testid="zipcode-register"
                value={formData.zipcode}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                data-testid="password-register"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordConfirmation">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirmation"
                data-testid="passwordConfirm-register"
                value={formData.passwordConfirmation}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              data-testid="register-button"
            >
              Submit
            </Button>
            {Object.keys(errors).map((key) => (
              <div key={key} className="text-danger">
                {errors[key]}
              </div>
            ))}
            {successRegister && (
              <div style={{ color: "green" }}>{successRegister}</div>
            )}
          </Form>
        </Col>
        <Col md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmitLogin}>
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                data-testid="username-login"
                value={loginData.username}
                onChange={handleLoginChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                data-testid="password-login"
                value={loginData.password}
                onChange={handleLoginChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" data-testid="login-button">
              Submit
            </Button>
            {Object.keys(loginErrors).map((key) => (
              <div key={key} className="text-danger">
                {loginErrors[key]}
              </div>
            ))}
          </Form>
          <div style={{ marginTop: 20 }}>
            <a href="https://ricecomp431app-5b7591b01f3b.herokuapp.com/auth/google">
              <Button>Login with Google</Button>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
