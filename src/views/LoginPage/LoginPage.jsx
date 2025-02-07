import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [virtualID, setVirtualID] = useState("");
  const [token, setToken] = useState("");

  const handleAutoLogin = () => {
    localStorage.clear();
    localStorage.setItem("profileName", username);
    localStorage.setItem("virtualId", virtualID);
    localStorage.setItem("apiToken", token);
    navigate("/discover-start");
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // console.log("Received message from origin:", event.origin);

      // List all the trusted origins you expect messages from
      const trustedOrigins = ["https://bhashabyasa.navadhiti.com"];

      // Log each condition being checked
      if (!trustedOrigins.includes(event.origin)) {
        // console.log("Blocked message from an untrusted origin:", event.origin);
        return;
      }

      const {
        username: receivedUsername,
        virtualID: receivedVirtualID,
        token: receivedToken,
      } = event.data;

      if (receivedUsername && receivedVirtualID && receivedToken) {
        setUsername(receivedUsername);
        setVirtualID(receivedVirtualID);
        setToken(receivedToken);
        // console.log(
        //   "All values received and set:",
        //   receivedUsername,
        //   receivedVirtualID,
        //   receivedToken
        // );
      } else {
        console.log("Incomplete data received, skipping state update.");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (username && virtualID && token) {
      handleAutoLogin();
    }
  }, [username, virtualID, token]);

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

      const tokenDetails = jwtDecode(token);
      if (tokenDetails?.virtual_id) {
        localStorage.setItem("profileName", username);
        localStorage.setItem(
          "virtualId",
          usernameDetails?.data?.result?.virtualID
        );
        navigate("/discover-start");
      } else {
        alert("Enter correct username and password");
      }
    } catch (error) {
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
