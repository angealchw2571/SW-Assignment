import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useAtom } from "jotai";
import { userSessionAtom } from "../LoginPage";
import Button from "@mui/material/Button";
import axios from "axios";

function NewTask() {
  const { appAcronym } = useParams();
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [sessionData, setSessionData] = useAtom(userSessionAtom);
  console.log("sessionData", sessionData);
  let navigate = useNavigate();

  const handleQuery = async (data) => {
    await axios
      .post(`/api/app/createtask`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          // console.log("hello")
          navigate(`/app/${appAcronym}`);
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const taskName = event.target.taskName.value;
    const taskDescription = event.target.taskDescription.value;
    const taskNote = event.target.taskNote.value;
    const data = {
      appAcronym: appAcronym,
      taskName: taskName,
      taskDescription: taskDescription,
      taskNote: taskNote,
      taskState: "OPEN",
      taskCreator: sessionData.username,
      taskOwner: sessionData.username,
      taskCreateDate: new Date(),
    };
    console.log("data", data);
    handleQuery(data);
  };
  return (
    <>
      <Box sx={{display: "flex",
                  flexDirection: "column",
                  alignItems: "center",}}>
                    <h1>Create new task</h1>
        <Box
          component="form"
          noValidate
          sx={{ mt: 3, width: 300 }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="taskName"
                required
                fullWidth
                id="taskName"
                label="Task Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="taskDescription"
                required
                fullWidth
                id="taskDescription"
                label="Task Description"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="taskNote"
                fullWidth
                id="taskNotes"
                label="Task Note"
                autoFocus
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add note
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default NewTask;
