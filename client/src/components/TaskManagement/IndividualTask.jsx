
// depreciated file, for reference only

import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TaskNotes from "./TaskNotes";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const moment = require("moment");

function IndividualTask() {
  const { taskID } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [taskData, setTaskData] = useState();
  let navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`/api/app/task/${taskID}`);
      setnetworkStatus("loading");
      setTaskData(res.data[0]);
      setnetworkStatus("resolved");
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <div>
            <h1 style={{ justifyContent: "center", display: "flex" }}>
              App {taskData.Task_App_Acronym}
            </h1>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={10}
              sx={{ marginBottom: 8 }}
            >
              <Grid item xs={4} spacing={3}>
                <div>Task Plan: {taskData.Task_plan}</div>
                <br />
                <div>Task ID: {taskData.Task_id}</div>
                <br />
                <div>Task Name: {taskData.Task_name}</div>
                <br />
                <div>Task Description: {taskData.Task_description}</div>
                <br />
              </Grid>
              <Grid item xs={4} spacing={3}>
                <div>Task State: {taskData.Task_state}</div>
                <br />
                <div>Task Creator: {taskData.Task_creator}</div>
                <br />
                <div>Task Owner: {taskData.Task_owner}</div>
                <br />
                <div>
                  Task create date:{" "}
                  {moment(taskData.Task_createDate).format("DD-MMM-YYYY")}
                </div>
                <br />
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{ marginBottom: 8 }}
            >
              <Grid item xs={8}>
                <TaskNotes taskData={taskData} getData={getData} />
              </Grid>
            </Grid>
          </div>
          <Box>
            <Button
              sx={{
                bgcolor: "pink",
                marginLeft: 5,
                margin: 10,
                color: "black",
                ":hover": {
                  backgroundColor: "#ff8aae",
                  color: "#f9f1f1",
                },
              }}
              onClick={() => navigate(`/app/${taskData.Task_App_Acronym}`)}
            >
              <Typography>Back</Typography>
            </Button>
          </Box>
        </>
      ) : (
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={8}>
            <LinearProgress color="secondary" sx={{ width: "100%", mt: 20 }} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default IndividualTask;
