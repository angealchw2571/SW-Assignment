import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  MenuItem,
  OutlinedInput,
  Checkbox,
  Select,
  InputLabel,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import LoadingBar from "../LoadingBar";
import axios from "axios";
import { toast } from "react-toastify";
const PasswordValidation = require("./PasswordValidation");

function CreateNewUser() {
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [reload, setReload] = useState(false);
  const [roleData, setRoleData] = useState();
  const [groupData, setGroupData] = useState();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [roleArr, setRoleArr] = useState([]);
  const [groupForm, setGroupForm] = useState("");
  const rank = PasswordValidation(password1);
  const labels = ["Too Short", "Weak", "Medium", "Strong", "Very Strong"];
  const passwordMessage = labels[rank];
  const [progress, setProgress] = useState(rank);

  const colorBar = () => {
    if (rank === 0) {
      return "red";
    } else if (rank === 1) {
      return "#ff511c";
    } else if (rank === 2) {
      return "#ff8a1c ";
    } else if (rank === 3) {
      return "#3498eb";
    } else {
      return "green";
    }
  };

  let navigate = useNavigate();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
  }, [reload]);

  const handleQuery = async (data) => {
    await axios
      .post(`/api/user/new`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message,  { autoClose: 4000 });
          setReload(!reload)
          setRoleArr([])
          setGroupForm("")
          setPassword1("")
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    if (
      username.length === 0 ||
      password1.length === 0 ||
      password2.length === 0
    ) {
      //   alert("Please do not leave empty fields.");
      toast.error("Please do not leave empty fields");
    } else if (groupForm.length === 0) {
      //   alert("Please select a role for the user");
      toast.error("Please select a role for the user");
    } else if (rank < 3) {
      //   alert("Password do not meet the requirements");
      toast.error("Password do not meet the requirements");
    } else if (password1 === password2 && rank >= 3) {
      handleQuery({
        username: username,
        password: password1,
        role_groups: roleArr,
        groupName: groupForm,
      });
    } else {
      //   alert("Please check your password again");
      toast.error("Password do not match! Please check your password again");
    }
  };
  const handlePassword1 = (event) => {
    setPassword1(event.target.value);
    setProgress(rank * 25);
  };
  const handlePassword2 = (event) => {
    // console.log("password2", event.target.value);
    setPassword2(event.target.value);
  };
  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoleArr(typeof value === "string" ? value.split(",") : value);
  };
  const handleGroupChange = (event) => {
    setGroupForm(event.target.value);
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <Container component="main" maxWidth="sm">
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onSubmit={handleSubmit}
            >
              <Paper elevation={10} sx={{ px: 10, py: 5, borderRadius: 10 }}>
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ textAlign: "center" }}
                >
                  Create New User
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="username"
                        required
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                        color="secondary"
                        label="username"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="password1"
                        required
                        fullWidth
                        inputProps={{ maxLength: 10 }}
                        onChange={handlePassword1}
                        color="secondary"
                        label="password"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="password2"
                        required
                        fullWidth
                        inputProps={{ maxLength: 10 }}
                        onChange={handlePassword2}
                        color="secondary"
                        label="reconfirm password"
                      />
                    </Grid>
                    {password1.length > 1 ? (
                      <Box
                        sx={{
                          width: "100%",
                          mt: 4,
                          mx: 4,
                          color: colorBar(),
                          fontWeight: "bold",
                        }}
                      >
                        {passwordMessage}
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          color="inherit"
                        />
                      </Box>
                    ) : null}

                    <Grid item xs={12} sm={12}>
                      <InputLabel sx={{ fontSize: 14, my: 1 }}>
                        Assign Role
                      </InputLabel>
                      <Select
                        color="secondary"
                        multiple
                        fullWidth
                        required
                        value={roleArr}
                        onChange={handleRoleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {roleData.map((e) => (
                          <MenuItem key={e.role_name} value={e.role_name}>
                            <Checkbox
                              color="secondary"
                              checked={roleArr.indexOf(e.role_name) > -1}
                            />
                            <ListItemText primary={e.role_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ fontSize: 14, my: 1 }}>
                        Group
                      </InputLabel>
                      <Select
                        value={groupForm}
                        onChange={handleGroupChange}
                        fullWidth
                        required
                        label="Group"
                      >
                        {groupData.map((e, i) => {
                          return (
                            <MenuItem key={e.group_id} value={e.group_name}>
                              <span
                                style={{
                                  color: `${e.group_color}`,
                                  marginRight: 10,
                                }}
                              >
                                ●
                              </span>
                              {e.group_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: "#E1D6EE",
                      color: "black",
                      ":hover": {
                        backgroundColor: "#C2ADDD",
                      },
                    }}
                  >
                    Create User
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Container>
        </>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

export default CreateNewUser;
