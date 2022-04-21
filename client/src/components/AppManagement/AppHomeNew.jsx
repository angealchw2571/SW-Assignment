import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AppSwiper from "./AppSwiper";
import axios from "axios";
import Loadingbar from "../LoadingBar";
import KanbanBoardNew from "./KanbanBoardNew";
import Modal from "@mui/material/Modal";
import TaskModal from "./TaskModal";
import TaskNoteForm from "../TaskManagement/TaskNoteForm";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import PersonIcon from "@mui/icons-material/Person";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import { userSessionAtom } from "../LoginPage";
import { useAtom } from "jotai";
import { Button } from "@mui/material";

function AppHomeNew() {
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [networkStatus2, setNetworkStatus2] = useState("pending");
  const [appData, setAppData] = useState();
  const [taskData, setTaskData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenForm, setModalOpenForm] = useState(false);
  const [modalTaskDataIndex, setModalTaskDataIndex] = useState();
  const sessionData = useAtom(userSessionAtom)[0];

  const drawerWidth = 240;
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "50vh",
    borderRadius: 10,
  };
  const handleModelFunc = (task_id) => {
    setModalOpen(!modalOpen);
    taskData.forEach((e, i) => {
      if (e.Task_id === task_id) {
        setModalTaskDataIndex(i);
      }
    });
  };
  const handleModalClose = () => {
    setModalOpen(!modalOpen);
  };
  const handleCloseModalForm = () => setModalOpenForm(!modalOpenForm);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/app/appgroups`);
        const res2 = await axios.get(`/api/app/apptasks`);

        setNetworkStatus("loading");
        setAppData(res.data);
        setTaskData(res2.data);
        setNetworkStatus2("resolved");
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const handleQuery = async (app_acronym) => {
    const url = (app_acronym) => {
      if (app_acronym === "ALL" && sessionData.role_groups.includes("Admin")) {
        const url = "/api/app/alltasks";
        return url;
      } else if (app_acronym === "ALL") {
        const url = `/api/app/apptasks`;
        return url;
      } else {
        const url = `/api/app/tasks/${app_acronym}`;
        return url;
      }
    };
    setNetworkStatus2("pending");
    await axios
      .get(url(app_acronym))
      .then((res) => {
        if (res) {
          setTaskData(res.data);
          setNetworkStatus2("resolved");
          setNetworkStatus("resolved");
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };
  const onClick = () => {
    console.log("hello");
  };
  return (
    <>
      {networkStatus === "resolved" ? (
        <Container component="main" maxWidth="xl" sx={{ mt: 3 }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            Task Management System
          </Typography>
          <Paper elevation={24} sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={2.5}>
                <Drawer
                  variant="permanent"
                  open
                  sx={{ display: `${appData.length === 0 ? "none" : "block"}` }}
                >
                  <Toolbar
                    onClick={onClick}
                    sx={{
                      display: "flex",
                      alignItems: "left",
                      justifyContent: "flex-left",
                      px: [2],
                      ":hover": {
                        backgroundColor: "#C2ADDD",
                        pointer: "cursor",
                      },
                    }}
                  >
                    Create new app
                  </Toolbar>
                  <Divider />

                  <List
                    component="nav"
                    onClick={() => {
                      handleQuery("ALL");
                    }}
                    sx={{
                      overflow: "scroll",
                      maxHeight: 500,
                      overflowX: "hidden",
                    }}
                    subheader={
                      <ListSubheader
                        component="div"
                        inset
                        disableGutters
                        sx={{
                          backgroundColor: "#E1D6EE",
                          fontSize: 19,
                          //   display:"none",
                          ":hover": {
                            backgroundColor: "#e1b8f2",
                            cursor: "pointer",
                          },
                        }}
                      >
                        All Apps
                      </ListSubheader>
                    }
                  >
                    {/* <ListItemButton>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary="All Apps" />
                    </ListItemButton> */}
                    {appData.map((e, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => {
                          handleQuery(e.App_Acronym);
                        }}
                      >
                        <ListItemIcon sx={{ color: `${e.App_Color}` }}>
                          <AssignmentReturnedIcon />
                        </ListItemIcon>
                        <ListItemText primary={e.App_Acronym} />
                      </ListItemButton>
                    ))}
                  </List>
                  {/* <Divider sx={{ my: 1 }} /> */}
                </Drawer>
              </Grid>
              <Grid item xs={9}>
                <Typography sx={{ fontSize: 48, my: 2 }}>Apps</Typography>
                {appData.length === 0 ? (
                  <div style={{ height: "50vh" }}>
                    Sorry there are no apps assigned to you
                  </div>
                ) : (
                  <>
                    {networkStatus2 === "resolved" ? (
                      <>
                        <div style={{ justifyContent: "center" }}>
                          <KanbanBoardNew
                            appData={appData}
                            A
                            taskData={taskData}
                            handleModelFunc={handleModelFunc}
                            sessionData={sessionData}
                          />
                        </div>
                      </>
                    ) : (
                      <Loadingbar />
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "white",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                height: "50vh",
                borderRadius: 10,
              }}
            >
              <TaskModal
                modalTaskData={taskData[modalTaskDataIndex]}
                handleCloseModalForm={handleCloseModalForm}
              />
            </Box>
          </Modal>
          <Modal
            open={modalOpenForm}
            onClose={handleCloseModalForm}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TaskNoteForm
                taskData={taskData[modalTaskDataIndex]}
                setModalOpen={handleCloseModalForm}
              />
            </Box>
          </Modal>
        </Container>
      ) : (
        <Loadingbar />
      )}
    </>
  );
}

export default AppHomeNew;
