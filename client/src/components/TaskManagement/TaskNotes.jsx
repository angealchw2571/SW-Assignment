import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TaskNoteForm from "./TaskNoteForm";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const moment = require("moment");

export default function TaskNotes({ taskData, tNotes, getData }) {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <Grid sx={{ flexGrow: 1, paddingBottom: 10 }} container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Paper
                sx={{
                  height: "100%",
                  width: 800,
                  backgroundColor: "cyan",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                      <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Task Notes" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {taskData.Task_notes.map((e, i) => {
                        return (
                          <ListItemButton
                            key={i}
                            sx={{
                              pl: 4,
                              mb: 2,
                              bgcolor: "#FFC0CB",
                              ":hover": {
                                backgroundColor: "#FFE4E1",
                                color: "black",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <ArrowRightIcon />
                            </ListItemIcon>
                            <Box>
                              <Typography variant="body2">
                                Current state: {e.currentState}
                              </Typography>
                              <Typography variant="body2">
                                Posted by: {e.userID} @{" "}
                                {moment(e.dateTime).format(
                                  "DD-MMM-YYYY HH:mm a"
                                )}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Message: {e.note}
                              </Typography>
                            </Box>
                          </ListItemButton>
                        );
                      })}
                      <Button
                        sx={{
                          float: "right",
                          marginRight: 6,
                          marginBottom: 2,
                          bgcolor: "pink",
                          color: "black",
                          ":hover": {
                            backgroundColor: "#ff8aae",
                            color: "#f9f1f1",
                          },
                        }}
                        onClick={handleOpen}
                      >
                        <Typography>Add Notes</Typography>
                      </Button>

                      <Modal
                        open={modalOpen}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <TaskNoteForm
                            taskData={taskData}
                            setModalOpen={setModalOpen}
                            getData={getData}
                          />
                        </Box>
                      </Modal>
                    </List>
                  </Collapse>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
