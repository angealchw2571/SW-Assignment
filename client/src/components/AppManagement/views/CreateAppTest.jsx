import { React, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import { styled } from "@mui/material/styles";



function CreateAppTest() {
  const theme = createTheme();
  console.log("page is refreshing");
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [roleData, setRoleData] = useState();
  const [groupData, setGroupData] = useState();
//   const groupData = [
//     {
//       group_id: 1,
//       group_name: "Alpha",
//     },
//     {
//       group_id: 2,
//       group_name: "chicken",
//     },
//     {
//       group_id: 3,
//       group_name: "Duck",
//     },
//     {
//       group_id: 4,
//       group_name: "Potato",
//     },
//     {
//       group_id: 5,
//       group_name: "Coconut",
//     },
//   ];
//   const roleData = [
//       {
//         role_id:1,
//         role_name:"Admin",
//         role_description:"hi",
//     },
//       {
//         role_id:2,
//         role_name:"Superuser",
//         role_description:"hi",
//     },
//       {
//         role_id:3,
//         role_name:"User",
//         role_description:"hi",
//     },
//       {
//         role_id:4,
//         role_name:"Project Lead",
//         role_description:"hi",
//     },
//       {
//         role_id:5,
//         role_name:"Project Manager",
//         role_description:"hi",
//     },
//       {
//         role_id:6,
//         role_name:"Developer",
//         role_description:"hi",
//     },
//   ]
const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#ff8aae",
      border: "5px",
      borderRadius: `4px 0 0 4px`,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "pink",
        borderWidth: "2px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff8aae",
      },
    },
  });
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    console.log("start", startDate, "end", endDate)
    console.log("checkboxForm", checkBoxForm)
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

  return (
      <>
      {networkStatus === "resolved" ? (<>
      <div>CreateAppTest</div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                      <TextField
                        name="App_Acronym"
                        required
                        fullWidth
                        label="App Acronym"
                        id="custom-css-outlined-input"
                      />
                    </Grid>
                <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="App_Description"
                        required
                        fullWidth
                        color="secondary"
                        id="App_Description"
                        label="App Description"
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
                          renderInput={(params) => (
                            <CustomTextField {...params} />
                          )}
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
                          renderInput={(params) => (
                            <CustomTextField {...params} />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item sm={12}>
                  <Box >
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
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>) : null}
      </>
    
  );
}

export default CreateAppTest;
