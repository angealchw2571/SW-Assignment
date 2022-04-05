import { React, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

function CreateApp() {
  const theme = createTheme();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [roleData, setRoleData] = useState();
  const [groupData, setGroupData] = useState();
  const [checkBoxForm, setCheckBoxForm] = useState({
    form1: {},
    form2: {},
    form3: {},
    groupForm: {},
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/checkroles`);
        const res2 = await axios.get(`/api/user/groups`);
        setNetworkStatus("loading");
        setRoleData(res.data);
        setGroupData(res2.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);


  const handleQuery = async (data) => {
      console.log("query working")
    await axios
      .post(`/api/app/createapp`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
        //   alert("Success!");
        //   navigate("/users");
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
    const App_Acronym = event.target.App_Acronym.value;
    const App_Description = event.target.App_Acronym.value;
    const App_Rnumber = event.target.App_Rnumber.value || 1;
    const finalData = {
      App_Acronym: App_Acronym,
      App_Description: App_Description,
      App_Rnumber: App_Rnumber,
      startDate: startDate,
      endDate: endDate,
      permissionForm:checkBoxForm
    };
    handleQuery(finalData)
  };
  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <h1>CreateApp</h1>
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
              <CssBaseline />
              <Box 
              sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onSubmit={handleSubmit}
              >
                <Typography component="h1" variant="h5">
                  Create New App
                </Typography>
                <Box component="form" noValidate sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="App_Acronym"
                        required
                        fullWidth
                        id="App_Acronym"
                        label="App Acronym"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="App_Description"
                        required
                        fullWidth
                        id="App_Description"
                        label="App Description"
                        autoFocus
                      />
                    </Grid>

                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                    <Grid item sm={12}>
                      <TextField
                        name="App_Rnumber"
                        required
                        fullWidth
                        id="App_Rnumber"
                        label="App Release Number"
                        autoFocus
                      />
                    </Grid>
                    <Grid>
                      <Box item sm={12}>
                        <FormControl
                          sx={{ m: 2 }}
                          component="fieldset"
                          variant="standard"
                        >
                          <FormLabel >
                            Assign Group
                          </FormLabel>
                          <FormGroup sx={{ display: "flex", flexDirection:"row"}}>
                            {groupData.map((e, i) => {
                              return (
                                <FormControlLabel
                                  key={i}
                                  control={
                                    <Checkbox sx={{m:2 }}
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
                          <FormLabel component="legend">
                            Done Permissions
                          </FormLabel>
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
                    Create App
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </>
      ) : null}
    </>
  );
}

export default CreateApp;
