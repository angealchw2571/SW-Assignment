import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../assets/purpleM.png";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E1D6EE",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
});

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [sessionData, setSessionData] = useAtom(userSessionAtom);
  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleLogout = async () => {
    await axios
      .delete(`/api/session/logout`)
      .then((res) => {
        console.log("res", res);
        setSessionData([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMouseOver = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Link to="/app/home" style={{ textDecoration: "none" }}>
                  <img
                    src={Logo}
                    alt=""
                    style={{
                      maxHeight: "100%",
                      width: "45%",
                      textAlign: "center",
                    }}
                  />
                </Link>
              </Box>

              {sessionData.user_id === undefined ? null : (
                <Box
                  sx={{
                    flexGrow: 0,
                    position: "absolute",
                    right: 0,
                    display: "flex",
                  }}
                >
                  <Typography
                    sx={{ position: "relative", marginRight: 2, marginTop: 1 }}
                  >
                    Welcome, {sessionData.username}
                  </Typography>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={sessionData.username}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    MenuListProps={{
                      onMouseLeave: () => {
                        handleCloseUserMenu();
                        handleClose();
                      },
                    }}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link
                        to={`/user/${sessionData.user_id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Typography textAlign="center">Profile</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link
                        to={`/app/home`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Typography textAlign="center">Apps</Typography>
                      </Link>
                    </MenuItem>
                    {sessionData.role_groups.includes("Admin") ? (
                      <MenuItem
                        onClick={handleCloseUserMenu}
                        onMouseLeave={handleClose}
                      >
                        <Typography
                          textAlign="center"
                          onMouseOver={handleMouseOver}
                        >
                          User Management
                        </Typography>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          MenuListProps={{ onMouseLeave: handleClose }}
                          onMouseLeave={handleClose}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                            marginRight: 5,
                          }}
                        >
                          <Link
                            to="/users"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <MenuItem onClick={handleClose}>
                              <Typography>View Users</Typography>
                            </MenuItem>
                          </Link>
                          <Link
                            to="/new"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <MenuItem onClick={handleClose}>
                              <Typography>Create New User</Typography>
                            </MenuItem>
                          </Link>
                          <Link
                            to="/newrole"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <MenuItem onClick={handleClose}>
                              <Typography>Create New Role</Typography>
                            </MenuItem>
                          </Link>
                          <Link
                            to="/newgroup"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <MenuItem onClick={handleClose}>
                              <Typography>Create New Group</Typography>
                            </MenuItem>
                          </Link>
                        </Menu>
                      </MenuItem>
                    ) : null}
                    <MenuItem
                      onMouseOver={handleClose}
                      onClick={() => {
                        handleCloseUserMenu();
                        handleLogout();
                      }}
                    >
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </>
  );
}

export default Navbar;
