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
import { Paper } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const checkPermissions = require("../../checkPermissions");
const moment = require("moment");

function IndividualApp() {
  const { appAcronym } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [appData, setAppData] = useState();
  const [planData, setPlanData] = useState();
  let navigate = useNavigate();
  const sessionData = useAtom(userSessionAtom)[0];

  console.log("planData", planData);
  const getData = async () => {
    try {
      const res = await axios.get(`/api/app/apps/${appAcronym}`);
      const res2 = await axios.get(`/api/app/plan/${appAcronym}`);
      setnetworkStatus("loading");
      setAppData(res.data);
      setPlanData(res2.data);
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
        <div>
          <Grid container alignItems="center" justifyContent="center" xs={12}>
            <Paper
              elevation={16}
              sx={{ mt: 10, width: 1000, borderRadius: 10 }}
            >
              <Box>
                <Button
                  sx={{
                    mt: 5,
                    ml: 5,
                    bgcolor: "#E1D6EE",
                    color: "black",
                    ":hover": {
                      backgroundColor: "#C2ADDD",
                    },
                  }}
                  onClick={() => navigate(`/app/home`)}
                >
                  <Typography>Back</Typography>
                </Button>
              </Box>
              <Grid
                container
                inherit
                sx={{
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12} spacing={3} sm={12} sx={{ width: "80%" }}>
                  <h1>App {appAcronym}</h1>
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
                    End Date:{" "}
                    {moment(appData[0].App_endDate).format("DD-MMM-YYYY")}
                  </span>
                  <p />
                  <span>
                    Groups Assigned: <p />
                    {appData[0].group_team_assignment.map((e) => {
                      return <li key={e}>{e}</li>;
                    })}
                  </span>
                </Grid>

                <Grid
                  container
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    px: 10,
                    mt: 5,
                  }}
                >
                  <Grid item xs={3} sm={2}>
                    <div className="div0">
                      Permission(Create Task):
                      {appData[0].App_permit_createTask.map((e, i) => {
                        return <li key={i}>{e} </li>;
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={3} sm={2} sx={{ background: "" }}>
                    <div className="div1">
                      Permission(To Do):
                      {appData[0].App_permit_toDoList.map((e, i) => {
                        return <li key={i}>{e} </li>;
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={3} sm={2} sx={{ background: "" }}>
                    <div className="div2">
                      Permission(Doing):
                      {appData[0].App_permit_Doing.map((e, i) => {
                        return <li key={i}>{e} </li>;
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={3} sm={2} sx={{ background: "" }}>
                    <div className="div3">
                      Permission(Done):
                      {appData[0].App_permit_Done.map((e, i) => {
                        return <li key={i}>{e} </li>;
                      })}
                    </div>
                  </Grid>
                </Grid>
                <Box sx={{ width: 700, mt: 10 }}>
                  <Typography variant="h6">Plans</Typography>
                  {planData
                    .map((e, i) => {
                      return (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography>{e.Plan_MVP_name}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              Description: {e.Plan_description}
                            </Typography>
                            <div
                              style={{
                                position: "absolute",
                                right: 25,
                                bottom: 10,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 12, textAlign: "right" }}
                              >
                                Start Date:
                                {moment(e.Plan_startDate).format(
                                  "DD-MMM-YYYY"
                                )}{" "}
                                <br />
                                End Date:
                                {moment(e.Plan_endDate).format("DD-MMM-YYYY")}
                              </Typography>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                    .reverse()}
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </div>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default IndividualApp;
