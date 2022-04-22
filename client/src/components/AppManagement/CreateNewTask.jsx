import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useAtom } from "jotai";
import { userSessionAtom } from "../LoginPage";
import axios from "axios";
import { toast } from "react-toastify";
import checkPermissions from "../checkPermissions";

function CreateNewTask({
  appData,
  handleRefresh,
  setModalCreateTask,
  modalCreateTask,
}) {
  const [appSelect, setAppSelect] = useState(appData[0].App_Acronym);
  const [sessionData, setSessionData] = useAtom(userSessionAtom);

  console.log("appData", appData);

  let newAppData = [];
  appData.forEach((e, i) => {
    if (checkPermissions(e.App_permit_createTask, sessionData.role_groups)) {
      newAppData.push(e);
    }
  });
  console.log("newAppData", newAppData)

  const handleOnChange = (event) => {
    setAppSelect(event.target.value);
  };

  const handleQuery = async (data) => {
    console.log("data query", data);
    await axios
      .post(`/api/app/createtask`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            setModalCreateTask(!modalCreateTask);
            handleRefresh("ALL");
          }, 2000);
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
      appAcronym: appSelect,
      taskName: taskName,
      taskDescription: taskDescription,
      taskNote: taskNote,
      taskState: "OPEN",
      taskCreator: sessionData.username,
      taskOwner: sessionData.username,
      taskCreateDate: new Date(),
    };
    handleQuery(data);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
        }}
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create New Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="select-form">Select App</InputLabel>
            <Select
              size="small"
              id="select-form"
              fullWidth
              value={appSelect}
              input={<OutlinedInput />}
              onChange={handleOnChange}
            >
              {newAppData.map((e, i) => {
                return (
                  <MenuItem key={i} value={e.App_Acronym}>
                    <span style={{ color: `${e.App_Color}`, paddingRight: 10 }}>
                      ●
                    </span>
                    {e.App_Acronym}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="taskName"
              required
              size="small"
              fullWidth
              id="taskName"
              label="Task Name"
              color="secondary"
              inputProps={{ maxLength: 100 }}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="taskDescription"
              required
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: 250 }}
              id="taskDescription"
              label="Task Description"
              color="secondary"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="taskNote"
              fullWidth
              multiline
              inputProps={{ maxLength: 100 }}
              rows={2}
              id="taskNotes"
              label="Task Notes"
              color="secondary"
              autoFocus
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 8,
            mb: 2,
            bgcolor: "#E1D6EE",
            color: "black",
            ":hover": {
              backgroundColor: "#C2ADDD",
            },
          }}
        >
          Add Task
        </Button>
      </Box>
    </>
  );
}

export default CreateNewTask;
