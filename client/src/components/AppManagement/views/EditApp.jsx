import { React, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const moment = require("moment");

function EditApp() {
  let navigate = useNavigate();
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [appData, setAppData] = useState();
  const [roleData, setRoleData] = useState();
  const [startDate, setStartDate] = useState();
  const [groupData, setGroupData] = useState();
  const [endDate, setEndDate] = useState();
  const { appAcronym } = useParams();
  const [checkBoxForm, setCheckBoxForm] = useState({
    form1: {},
    form2: {},
    form3: {},
    groupForm: {},
  });

  console.log("appdata", appData);

  useEffect(() => {
    const getData = async () => {
      try {
        setNetworkStatus("loading");
        const res = await axios.get(`/api/app/apps/${appAcronym}`);
        const res2 = await axios.get(`/api/user/checkroles`);
        const res3 = await axios.get(`/api/user/groups`);
        setRoleData(res2.data);
        setGroupData(res3.data);
        setAppData(res.data[0]);
        setStartDate(res.data[0].App_startDate);
        setEndDate(res.data[0].App_endDate);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [appAcronym]);

  const handleQuery = async (data) => {
    console.log("update query working");
    await axios
      .post(`/api/app/updateapp`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          alert(res.data.message);
          navigate(`/app/${appAcronym}`);
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handlePermissionChange1 = (event) => {
    event.preventDefault();
    const form1 = {
      ...checkBoxForm.form1,
      [event.target.name]: event.target.checked,
    };
    const newData = {
      ...checkBoxForm,
      form1: form1,
    };
    setCheckBoxForm(newData);
  };
  const handlePermissionChange2 = (event) => {
    event.preventDefault();
    const form2 = {
      ...checkBoxForm.form2,
      [event.target.name]: event.target.checked,
    };
    const newData = {
      ...checkBoxForm,
      form2: form2,
    };
    setCheckBoxForm(newData);
  };
  const handlePermissionChange3 = (event) => {
    event.preventDefault();
    const form3 = {
      ...checkBoxForm.form3,
      [event.target.name]: event.target.checked,
    };
    const newData = {
      ...checkBoxForm,
      form3: form3,
    };
    setCheckBoxForm(newData);
  };
  const handlePermissionChange4 = (event) => {
    event.preventDefault();
    const groupForm = {
      ...checkBoxForm.groupForm,
      [event.target.name]: event.target.checked,
    };
    const newData = {
      ...checkBoxForm,
      groupForm: groupForm,
    };
    setCheckBoxForm(newData);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const App_Description = event.target.App_Acronym.value;
    const App_Rnumber = event.target.App_Rnumber.value || 1;
    const finalData = {
      App_Acronym: appData.App_Acronym,
      App_Description: App_Description,
      App_Rnumber: App_Rnumber,
      startDate: startDate,
      endDate: endDate,
      permissionForm: checkBoxForm,
    };

    if (
      App_Description.length === 0 ||
      App_Rnumber.length === 0 ||
      Object.keys(checkBoxForm.groupForm).length === 0 ||
      Object.keys(checkBoxForm.form1).length === 0 ||
      Object.keys(checkBoxForm.form2).length === 0 ||
      Object.keys(checkBoxForm.form3).length === 0
    ) {
      alert("Please do not leave empty fields");
    } else {
      handleQuery(finalData);
    }
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <Container component="main" maxWidth="md">
            <Box
              component="form"
              noValidate
              sx={{ mt: 3 }}
              onSubmit={handleSubmit}
            >
              <h1>{appData.App_Acronym}</h1>
              <h3>App Description: {appData.App_Description}</h3>
              <h3>Release Number: {appData.App_Rnumber}</h3>
              <h3>
                Start Date:{" "}
                {moment(appData.App_startDate).format("DD-MMM-YYYY")}
              </h3>
              <h3>
                End Date: {moment(appData.App_endDate).format("DD-MMM-YYYY")}
              </h3>
              <h3>
                Groups Assigned: <p />
                {appData.group_team_assignment.map((e) => {
                  return <li key={e}>{e}</li>;
                })}
              </h3>

              <Grid sx={{ display: "flex", gap: 10 }}>
                <h3 className="div1">
                  Permission(To Do):
                  {appData.App_permit_toDoList.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </h3>
                <h3 className="div2">
                  Permission(Doing):
                  {appData.App_permit_Doing.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </h3>
                <h3 className="div3">
                  Permission(Done):
                  {appData.App_permit_Done.map((e, i) => {
                    return <li key={i}>{e} </li>;
                  })}
                </h3>
              </Grid>
              <Typography component="h1" variant="h5" sx={{ mt: 5, mb: 2 }}>
                Edit App Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="App_Description"
                    fullWidth
                    id="App_Acronym"
                    label="App Description"
                    autoFocus
                    defaultValue={appData.App_Description}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="App_Rnumber"
                    fullWidth
                    id="App_Rnumber"
                    label="Release Number"
                    autoFocus
                    defaultValue={appData.App_Rnumber}
                  />
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid>
                  <Box item sm={12}>
                    <FormControl
                      sx={{ m: 2 }}
                      component="fieldset"
                      variant="standard"
                    >
                      <FormLabel>Assign Group</FormLabel>
                      <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                        {groupData.map((e, i) => {
                          return (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  sx={{ m: 2 }}
                                  onChange={handlePermissionChange4}
                                  name={e.group_name}
                                />
                              }
                              label={e.group_name}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid sx={{ display: "flex" }}>
                  {/* to do */}
                  <Box item sm={2}>
                    <FormControl
                      sx={{ m: 2 }}
                      component="fieldset"
                      variant="standard"
                    >
                      <FormLabel component="legend">
                        To Do Permissions
                      </FormLabel>
                      <FormGroup>
                        {roleData.map((e, i) => {
                          return (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  onChange={handlePermissionChange1}
                                  name={e.role_name}
                                />
                              }
                              label={e.role_name}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Box>
                  {/* doing */}
                  <Box item sm={2}>
                    <FormControl
                      sx={{ m: 2 }}
                      component="fieldset"
                      variant="standard"
                    >
                      <FormLabel component="legend">
                        Doing Permissions
                      </FormLabel>
                      <FormGroup>
                        {roleData.map((e, i) => {
                          return (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  onChange={handlePermissionChange2}
                                  name={e.role_name}
                                />
                              }
                              label={e.role_name}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Box>
                  {/* done */}
                  <Box item sm={2}>
                    <FormControl
                      sx={{ m: 2 }}
                      component="fieldset"
                      variant="standard"
                    >
                      <FormLabel component="legend">Done Permissions</FormLabel>
                      <FormGroup>
                        {roleData.map((e, i) => {
                          return (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  onChange={handlePermissionChange3}
                                  name={e.role_name}
                                />
                              }
                              label={e.role_name}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update App
              </Button>
            </Box>
          </Container>
        </>
      ) : null}
    </>
  );
}

export default EditApp;
