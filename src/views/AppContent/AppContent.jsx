import React, { useEffect, Fragment } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = (props) => {
  let virtualId;
  const TOKEN = localStorage.getItem("apiToken");
  // if (TOKEN) {
  //   const tokenDetails = jwtDecode(TOKEN);
  //   virtualId = JSON.stringify(tokenDetails?.virtual_id);
  // }

  const navigate = useNavigate();
  useEffect(() => {
    if (!TOKEN && props.requiresAuth) {
      navigate("/login");
    }
  }, [TOKEN]);

  return <>{props.children}</>;
};
const AppContent = ({ routes }) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <Fragment>
      <CustomizedSnackbars />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <PrivateRoute requiresAuth={route.requiresAuth}>
                <route.component />
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Fragment>
  );
};

export default AppContent;
