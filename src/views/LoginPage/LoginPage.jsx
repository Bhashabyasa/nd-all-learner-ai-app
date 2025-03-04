import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import "./LoginPage.css"; // Import the CSS file
import { StorageServiceSet } from "../../utils/secureStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Received message from origin:", event.origin);
      console.log(
        "🚀 Trusted Origins (from .env):",
        process.env.REACT_APP_TRUSTED_ORIGIN
      );

      const trustedOrigins = process.env.REACT_APP_TRUSTED_ORIGIN?.split(
        ","
      ).map((origin) => origin.trim());
      console.log(trustedOrigins);

      // Debug: Check if the received origin is being compared correctly
      console.log(
        "✅ Checking if origin is trusted:",
        trustedOrigins.includes(event.origin)
      );

      if (!trustedOrigins.includes(event.origin)) {
        console.warn("Blocked message from an untrusted origin:", event.origin);
        return;
      }

      const {
        username: receivedUsername,
        token: receivedToken,
        decriptKey: decriptedSecretKey,
      } = event.data;

      console.log("🔹 Extracted Data:", {
        receivedUsername,
        receivedToken,
        decriptedSecretKey,
      });

      if (receivedUsername && receivedToken && decriptedSecretKey) {
        setUsername(receivedUsername);
        localStorage.setItem("apiToken", receivedToken);
        localStorage.setItem("discovery_id", decriptedSecretKey);
        StorageServiceSet("profileName", receivedUsername);
        navigate("/discover-start");
      } else {
        return "Incomplete data received, skipping state update.";
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("apiToken") !== null) {
      navigate("/discover-start");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    localStorage.clear();

    try {
      const usernameDetails = await fetchVirtualId(username);
      let token = usernameDetails?.result?.token;
      localStorage.setItem("apiToken", token);
      if (token) {
        localStorage.setItem(
          "discovery_id",
          process.env.REACT_APP_SECRET_KEY_STORAGE
        );
        StorageServiceSet("profileName", username);
        navigate("/discover-start");
      } else {
        alert("Enter correct username and password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Container className="container">
      <div className="loginBox">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
