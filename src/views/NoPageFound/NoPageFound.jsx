import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { APP_CONSTANTS } from "../../config/config";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";

const { PAGE_NOT_FOUND } = APP_CONSTANTS;

const NoPageFound = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/");
  // }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className="no-page-found"
    >
      <Grid item>
        <Link to="/?username=sasas">
          <Typography
            variant="h1"
            sx={{ color: "#ef534f", fontSize: "198px", fontWeight: "bold" }}
          >
            404
          </Typography>
        </Link>

        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert
            severity="error"
            sx={{
              fontSize: "21px",
              display: "flex",
              alignItems: "center",
              color: "#ef534f",
            }}
          >
            {PAGE_NOT_FOUND}
          </Alert>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default NoPageFound;
