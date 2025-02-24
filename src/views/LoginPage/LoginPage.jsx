import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import "./LoginPage.css"; // Import the CSS file
import StorageService from "../../utils/secureStorage";
import { setLocalData } from "../../utils/constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Received message from origin:", event.origin);
      const trustedOrigins = ["http://localhost:5173", "http://localhost:3000"];
      if (!trustedOrigins.includes(event.origin)) {
        console.warn("Blocked message from an untrusted origin:", event.origin);
        return;
      }
      const {
        username: receivedUsername,
        token: receivedToken,
        decriptKey: recivedSecretKey,
      } = event.data;

      console.log("receivedUsername :", receivedUsername);
      console.log("receivedToken : ", receivedToken);
      console.log("decriptedSecretKey :", recivedSecretKey);

      if (receivedUsername && receivedToken && recivedSecretKey) {
        setSecretKey(recivedSecretKey);
        localStorage.setItem("secretKey", recivedSecretKey);
        // setLocalData("apiToken", receivedToken);
        setLocalData("apiToken", receivedToken, recivedSecretKey);
        // setLocalData("profileName", receivedUsername);
        setLocalData("profileName", receivedUsername, recivedSecretKey);
        navigate("/discover-start");
      } else {
        console.log("Incomplete data received, skipping state update.");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    localStorage.clear();
    StorageService.clear();

    try {
      const usernameDetails = await fetchVirtualId(username);
      let token = usernameDetails?.result?.token;
      // setLocalData("apiToken", token);
      setLocalData("apiToken", token, secretKey);
      if (token) {
        // setLocalData("profileName", username);
        setLocalData("profileName", username, secretKey);
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
