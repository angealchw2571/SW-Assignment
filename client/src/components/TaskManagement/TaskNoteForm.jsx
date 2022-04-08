import {React, useState} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "../LoginPage";
import { useNavigate } from "react-router-dom";


function TaskNoteForm({taskData, setModalOpen, getData}) {
    // const [networkStatus, setNetworkStatus] = useState("pending");
    const [sessionData, setSessionData] = useAtom(userSessionAtom);
    // console.log("sessionData", sessionData)
    // console.log("task data", taskData);
    // let navigate = useNavigate();


    const handleQuery = async (data) => {
    await axios
      .post(`/api/app/tasknote/${taskData.Task_id}`, data)
      .then((res) => {
        if (res) {
          // setNetworkStatus("resolved");
          setModalOpen(false)
          getData()  
        console.log("hello")
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const noteMessage  = event.target.noteMessage.value
    const data = {
        userID: sessionData.username,
        currentState:taskData.Task_state,
        dateTime: new Date(),
        note: noteMessage
    }
    handleQuery(data)
  };

  return (
    <>
      <h1>Add new note</h1>
      <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              name="noteMessage"
              required
              fullWidth
              id="note"
              label="message"
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
    </>
  );
}

export default TaskNoteForm;
