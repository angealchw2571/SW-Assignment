import { React, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { Card, CardContent, CardMedia } from "@mui/material/";
import LoadingBar from "../LoadingBar";

function IndividualUser() {
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  const [appData, setAppData] = useState();
  let navigate = useNavigate();
  const { id } = useParams();

  console.log("userData", userData);
  console.log("appData", appData);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${id}`);
        const res2 = await axios.get(`/api/app/appgroups`);
        setnetworkStatus("loading");
        setUserData(res.data);
        setAppData(res2.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [id]);
  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <Container
            component="main"
            maxWidth="xl"
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
              height: "70vh",
              // backgroundColor: "black",
            }}
          >
            <Grid
              container
              maxWidth
              maxHeight
              spacing={2}
              sx={{ display: "absolute", left: "50%", right: "50%" }}
            >
              <Grid
                item
                xs={3}
                // sx={{ backgroundColor: "green",}}
              >
                <Paper
                  elevation={10}
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    lineHeight: "60px",
                    height: 600,
                    borderRadius: 10,
                    // backgroundColor:"yellow"
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 200,
                      paddingBottom: 30,
                      // backgroundColor:"yellow"
                    }}
                  >
                    <Avatar
                      alt={userData.name}
                      src=""
                      sx={{ width: 56, height: 56 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 30 }}>{userData.name}</Typography>
                  <Typography>{userData.username}</Typography>
                  <Typography>Age: {userData.age}</Typography>
                  <Typography sx={{ color: "mediumpurple" }}>
                    {userData.email}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <Paper
                  elevation={10}
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    lineHeight: "60px",
                    minHeight: 600,
                    flexGrow: 1,
                    borderRadius:10
                    
                    // backgroundColor:"yellow"
                  }}
                >
                  <Grid sx={{ flexGrow: 1 }}>
                  <Typography
                          variant="h6"
                          sx={{ pb:1, pt:2, fontWeight: "bold" }}
                        >
                          Details
                        </Typography>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ paddingLeft: 5, fontWeight: "bold" }}
                        >
                          Assigned Roles
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ display: "flex" }}>
                        {userData.role_groups.map((e, i) => {
                          return (
                            <Typography
                              key={i}
                              sx={{
                                px: 2,
                                py: 1,
                                mx: 2,
                                backgroundColor: "#E2B2FF",
                              }}
                            >
                              {e}
                            </Typography>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ paddingLeft: 5, fontWeight: "bold" }}
                        >
                          Groups
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ display: "flex" }}>
                        <Typography sx={{ px: 3 }}>
                          <span style={{ color: `${userData.group_color}` }}>
                            ●
                          </span>{" "}
                          {userData.group_name}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Container sx={{ py: 6 }} maxWidth="md">
                      <Grid container spacing={4}>
                        {appData.map((e, i) => (
                          <Grid item key={i} xs={12} sm={6} md={4}>
                            <Card
                              elevation={6}
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "#FCECFF",
                              }}
                            >
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ marginBottom: 3, fontWeight: "bold" }}
                                >
                                  {e.App_Acronym}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                  <Box>
                                    Assigned Team:
                                    {e.group_team_assignment.map((e) => {
                                      return <li key={e}>{e}</li>;
                                    })}
                                  </Box>
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Container>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default IndividualUser;
