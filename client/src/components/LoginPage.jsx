import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { Grid, Box, TextField, Typography } from "@mui/material/";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Logo from "../assets/managementlogo.png";
import { toast } from "react-toastify";

export const userSessionAtom = atom([]);

function Login() {
  const [session, setSession] = useAtom(userSessionAtom);
  let navigate = useNavigate();

  const handleLogin = async (loginDetails) => {
    await axios
      .post(`/api/session/login`, loginDetails, { withCredentials: true })
      .then((res) => {
        if (res) {
          console.log("res", res);
          setSession(res.data);
          toast.success("Success!");
          setTimeout(() => {
            navigate("/app/home");
          }, 1500);
        }
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = event.target;
    // console.log("submit working ");
    handleLogin({ username: username.value, password: password.value });
  };
  return (
    <>
      <div>
        <Container
          component="main"
          maxWidth
          sx={{
            backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKGa3kuqGMelsk9hudCC-ADTDzF9akZ1cKm8AmgYzmwevMg9u2xCtIRM1DMa3hFfJ9NYw&usqp=CAU")`,
            objectFit: "stretch",
            backgroundSize: "100% 100%",
            justifyContent: "center",
            maxHeight: "100vh",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              height: "100vh",
              width: "50%",
            }}
            onSubmit={handleSubmit}
          >
            <Box
              sx={{
                marginTop: "30%",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ maxHeight: 60, width: "100%", objectFit: "none" }}
              />
              {/* <Typography component="h1" variant="h4" className="loginTitle">
            Management App
          </Typography> */}
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="Username"
                      required
                      fullWidth
                      color="secondary"
                      id="username"
                      label="Username"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="password"
                      required
                      fullWidth
                      type="password"
                      color="secondary"
                      id="password"
                      label="Password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#E1D6EE",
                    color: "black",
                    ":hover": {
                      backgroundColor: "#C2ADDD",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Login;
