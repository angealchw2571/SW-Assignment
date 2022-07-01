
// depreciated file, for reference only


import { React, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../../LoadingBar";

function AppHome() {
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [appData, setAppData] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/app/appgroups`);
        setnetworkStatus("loading");
        setAppData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const handleClick = (App_Acronym) => {
    navigate(`/app/${App_Acronym}`);
  };

  const handleCreate = () => {
    navigate(`/appcreate`);
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <main>
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 8,
                pb: 1,
              }}
            >
              <Container sx={{ bgcolor: "pink" }} maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  App List
                </Typography>
              </Container>
            </Box>
            <Box>
              <Button
                sx={{
                  bgcolor: "pink",
                  color: "black",
                  ":hover": {
                    backgroundColor: "#ff8aae",
                    color: "#f9f1f1",
                  },
                }}
                onClick={handleCreate}
              >
                <Typography>Create new App</Typography>
              </Button>
            </Box>
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
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 100,
                          paddingTop: 6,
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        image="https://img.icons8.com/ios/344/project.png"
                        alt="random"
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h4"
                          sx={{ marginBottom: 3, fontWeight: "bold" }}
                        >
                          {e.App_Acronym}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>
                          <span>
                            Start Date:
                            {moment(e.App_startDate).format("Do MMM  YYYY")}
                          </span>
                          <br />
                          <span>
                            End Date:
                            {moment(e.App_endDate).format("Do MMM YYYY")}
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>
                          <div>
                            Assigned Teams{" "}
                            {e.group_team_assignment.map((e) => {
                              return <li key={e}>{e}</li>;
                            })}
                          </div>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          sx={{
                            bgcolor: "pink",
                            color: "black",
                            ":hover": {
                              backgroundColor: "#ff8aae",
                              color: "#f9f1f1",
                            },
                          }}
                          size="small"
                          onClick={() => handleClick(e.App_Acronym)}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
            <Box>
              <Button
                sx={{
                  bgcolor: "pink",
                  color: "black",
                  marginLeft: 2,
                  margin: 10,
                  ":hover": {
                    backgroundColor: "#ff8aae",
                    color: "#f9f1f1",
                  },
                }}
                onClick={() => navigate(`/home`)}
              >
                <Typography>Back</Typography>
              </Button>
            </Box>
          </main>
        </>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default AppHome;
