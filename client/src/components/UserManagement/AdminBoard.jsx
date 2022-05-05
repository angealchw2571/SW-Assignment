import React from "react";
import { useState, useEffect } from "react";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import UserTable from "./UserTable";
import { Typography } from "@mui/material";
import LoadingBar from "../LoadingBar";
import { Link } from "react-router-dom";

function AdminBoard() {
  const [open, setOpen] = useState(true);
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [networkStatus2, setNetworkStatus2] = useState("pending");
  const [roleData, setRoleData] = useState();
  const [userData, setUserData] = useState();
  const [groupData, setGroupData] = useState();
  const [message, setMessage] = useState("All Users");

  const drawerWidth = 240;
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  const handleQuery = async (role_name) => {
    const url = () => {
      if (role_name === "ALL") {
        const url = "/api/user/";
        return url;
      } else {
        const url = `/api/user/checkgroup/${role_name}`;
        return url;
      }
    };
    setNetworkStatus2("pending");

    await axios
      .get(url(), { auth: { username: "hello1", password: "hello2" } })
      .then((res) => {
        if (res) {
          setUserData(res.data);
          setNetworkStatus2("resolved");
        }
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.log(error);
      });
  };

  const handleQuery2 = async (groupName) => {
    const url = `/api/user/checkgroup2/${groupName}`;
    setNetworkStatus2("pending");
    await axios
      .get(url)
      .then((res) => {
        if (res) {
          setUserData(res.data);
          setNetworkStatus2("resolved");
        }
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.log(error);
      });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/checkroles`);
        const res2 = await axios.get(`/api/user/groups`);
        const res3 = await axios.get(`/api/user/`, { auth: { username: "hello1", password: "hello2" } });
        setNetworkStatus("loading");
        setRoleData(res.data);
        setGroupData(res2.data);
        setUserData(res3.data);
        setNetworkStatus("resolved");
        setNetworkStatus2("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <Container component="main" maxWidth="xl" sx={{ mt: 10 }}>
            <Paper elevation={24}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Drawer variant="permanent" open>
                    <Toolbar
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: [1],
                      }}
                    >
                      {/* <IconButton onClick={toggleDrawer}>
                      <ChevronLeftIcon />
                    </IconButton> */}
                    </Toolbar>
                    <Divider />
                    <List
                      component="nav"
                      sx={{
                        overflow: "scroll",
                        maxHeight: 300,
                        overflowX: "hidden",
                      }}
                      subheader={
                        <ListSubheader
                          component="div"
                          inset
                          disableGutters
                          sx={{ backgroundColor: "#E1D6EE" }}
                        >
                          Roles
                        </ListSubheader>
                      }
                    >
                      <ListItemButton
                        onClick={() => {
                          handleQuery("ALL");
                          setMessage("All Users");
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="All users" />
                      </ListItemButton>
                      {roleData.map((e, index) => (
                        <ListItemButton
                          key={index}
                          onClick={() => {
                            handleQuery(e.role_name);
                            setMessage(`${e.role_name}`);
                          }}
                        >
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText primary={e.role_name} />
                        </ListItemButton>
                      ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                    <List
                      component="nav"
                      sx={{
                        overflow: "scroll",
                        maxHeight: 400,
                        overflowX: "hidden",
                      }}
                      subheader={
                        <ListSubheader
                          component="div"
                          inset
                          disableGutters
                          sx={{ backgroundColor: "#E1D6EE" }}
                        >
                          Groups
                        </ListSubheader>
                      }
                    >
                      {groupData.map((e, index) => (
                        <ListItemButton
                          key={index}
                          onClick={() => {
                            handleQuery2(e.group_name);
                            setMessage(`${e.group_name}`);
                          }}
                        >
                          <ListItemIcon>
                            <FiberManualRecordIcon
                              sx={{ color: `${e.group_color}` }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={e.group_name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Drawer>
                </Grid>
                <Grid item xs={8}>
                  <Link to="/app/home" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      sx={{
                        m: 3,
                        float: "right",
                        bgcolor: "#E1D6EE",
                        color: "black",
                        ":hover": {
                          backgroundColor: "#C2ADDD",
                        },
                      }}
                    >
                      App Management
                    </Button>
                  </Link>
                  <Typography sx={{ fontSize: 48, mt: 5 }}>
                    {message}
                  </Typography>
                  {networkStatus2 === "resolved" ? (
                    <UserTable
                      userData={userData}
                      roleData={roleData}
                      groupData={groupData}
                      handleQuery={handleQuery}
                    />
                  ) : (
                    <LoadingBar />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default AdminBoard;
