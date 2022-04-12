import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import KanbanBoard from "../../TaskManagement/KanbanBoard";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { userSessionAtom } from "../../LoginPage";
import Grid from "@mui/material/Grid";
import LoadingBar from "../../LoadingBar";

const checkPermissions = require("../../checkPermissions");
const moment = require("moment");

function IndividualApp() {
  const { appAcronym } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [appData, setAppData] = useState();
  const [taskData, setTaskData] = useState();
  let navigate = useNavigate();
  const sessionData = useAtom(userSessionAtom)[0];

  // console.log("taskData", taskData);

  const getData = async () => {
    try {
      const res = await axios.get(`/api/app/apps/${appAcronym}`);
      const res2 = await axios.get(`/api/app/tasks/${appAcronym}`);
      setnetworkStatus("loading");
      setAppData(res.data);
      setTaskData(res2.data);
      setnetworkStatus("resolved");
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleClick = (ACTION) => {
    if (ACTION === "EDIT") {
      navigate(`/app/edit/${appAcronym}`);
    } else if (ACTION === "TASK") navigate(`/app/newtask/${appAcronym}`);
  };

  const permission = checkPermissions(
    ["Admin", "Project Manager"],
    sessionData.role_groups
  );

  return (
    <>
      {networkStatus === "resolved" ? (
        <div>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{ marginBottom: 8 }}
          >
            <Grid item xs={8} spacing={3}>
              <h1>App {appAcronym}</h1>
              {permission ? (
                <Button
                  sx={{
                    float: "right",
                    bgcolor: "#ff8aae",
                    color: "#f9f1f1",
                    ":hover": {
                      backgroundColor: "pink",
                      color: "black",
                    },
                  }}
                  onClick={() => handleClick("TASK")}
                >
                  <Typography>New Task</Typography>
                </Button>
              ) : null}
              <Button
                sx={{
                  float: "right",
                  marginRight: 3,
                  bgcolor: "#ff8aae",
                  color: "#f9f1f1",
                  ":hover": {
                    backgroundColor: "pink",
                    color: "black",
                  },
                }}
                onClick={() => handleClick("EDIT")}
              >
                <Typography>Edit App</Typography>
              </Button>

              <span>App Description: {appData[0].App_Description}</span>
              <br />
              <span>Release Number: {appData[0].App_Rnumber}</span>
              <br />
              <span>
                Start Date:{" "}
                {moment(appData[0].App_startDate).format("DD-MMM-YYYY")}
              </span>
              <br />
              <span>
                End Date: {moment(appData[0].App_endDate).format("DD-MMM-YYYY")}
              </span>
              <p />
              <span>
                Groups Assigned: <p />
                {appData[0].group_team_assignment.map((e) => {
                  return <li key={e}>{e}</li>;
                })}
              </span>
              <p />
              <Grid sx={{ display: "flex", gap: 10 }}>
                <span className="div1">
                  Permission(To Do):
                  {appData[0].App_permit_toDoList.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </span>
                <span className="div2">
                  Permission(Doing):
                  {appData[0].App_permit_Doing.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </span>
                <span className="div3">
                  Permission(Done):
                  {appData[0].App_permit_Done.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </span>
              </Grid>
            </Grid>
          </Grid>
          {taskData.length > 0 ? (
            <KanbanBoard
              taskData={taskData}
              appAcronym={appAcronym}
              sessionData={sessionData}
              appData={appData[0]}
              getData={getData}
            />
          ) : (
            <h3>No tasks information available</h3>
          )}

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
              onClick={() => navigate(`/app/home`)}
            >
              <Typography>Back</Typography>
            </Button>
          </Box>
        </div>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default IndividualApp;
