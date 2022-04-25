import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  OutlinedInput,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Loadingbar from "../LoadingBar";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import { HexColorPicker } from "react-colorful";
import CreateAppColorBox from "./CreateAppColorBox";

function CreateNewApp({ handleRefresh, setModalCreateApp, modalCreateApp }) {
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [roleData, setRoleData] = useState();
  const [groupData, setGroupData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [appColor, setAppColor] = useState()

  const [groupRoleArr, setGroupRoleArr] = useState([]);
  const [permissionForm, setPermissionForm] = useState({
    toDo: [],
    doing: [],
    done: [],
    taskCreate: [],
  });

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
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
  }, []);

  const handleGroupRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGroupRoleArr(typeof value === "string" ? value.split(",") : value);
  };
  const handleTODO = (event) => {
    const {
      target: { value },
    } = event;

    const data = {
      ...permissionForm,
      toDo: typeof value === "string" ? value.split(",") : value,
    };
    setPermissionForm(data);
  };
  const handleDOING = (event) => {
    const {
      target: { value },
    } = event;

    const data = {
      ...permissionForm,
      doing: typeof value === "string" ? value.split(",") : value,
    };
    setPermissionForm(data);
  };
  const handleDONE = (event) => {
    const {
      target: { value },
    } = event;

    const data = {
      ...permissionForm,
      done: typeof value === "string" ? value.split(",") : value,
    };
    setPermissionForm(data);
  };
  const handleTASKCREATE = (event) => {
    const {
      target: { value },
    } = event;

    const data = {
      ...permissionForm,
      taskCreate: typeof value === "string" ? value.split(",") : value,
    };
    setPermissionForm(data);
  };

  const handleQuery = async (data) => {
    await axios
      .post(`/api/app/createapp`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            setModalCreateApp(!modalCreateApp);
            handleRefresh("ALL");
          }, 2000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { appAcronym, appReleaseNumber, appDescription } = event.target;
    handleQuery({
      appAcronym: appAcronym.value,
      appReleaseNumber: appReleaseNumber.value || 1,
      appDescription: appDescription.value,
      startDate: startDate,
      endDate: endDate,
      permissionForm: permissionForm,
      groupRoleArr: groupRoleArr,
      appColor: appColor
    });
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Create New App
          </Typography>
          <Grid container sx={{ width: 800 }} spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                name="appAcronym"
                helperText="App Acronym"
                variant="standard"
                required
                fullWidth
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                name="appReleaseNumber"
                helperText="App Release Number"
                variant="standard"
                defaultValue="1"
                type="number"
                required
                fullWidth
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="appDescription"
                multiline
                rows={4}
                helperText="App Description"
                fullWidth
                required
                inputProps={{ maxLength: 250 }}
                sx={{ mt: 3 }}
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
            <Grid item xs={12} sm={12}>
              <InputLabel sx={{ fontSize: 14, my: 1 }}>
                Assign Group To App
              </InputLabel>
              <Select
                color="secondary"
                multiple
                fullWidth
                required
                value={groupRoleArr}
                onChange={handleGroupRoleChange}
                input={<OutlinedInput margin="dense" label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {groupData.map((e) => (
                  <MenuItem
                    key={e.group_name}
                    value={e.group_name}
                    sx={{ height: 40 }}
                  >
                    <Checkbox
                      color="secondary"
                      checked={groupRoleArr.indexOf(e.group_name) > -1}
                    />
                    <span
                      style={{
                        color: `${e.group_color}`,
                        marginRight: 10,
                      }}
                    >
                      ●
                    </span>
                    <ListItemText primary={e.group_name} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={4} sm={4}>
              <InputLabel sx={{ fontSize: 14, my: 1 }}>To do</InputLabel>
              <Select
                color="secondary"
                multiple
                fullWidth
                required
                value={permissionForm.toDo}
                onChange={handleTODO}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleData.map((e) => (
                  <MenuItem
                    key={e.role_name}
                    value={e.role_name}
                    sx={{ height: 40 }}
                  >
                    <Checkbox
                      color="secondary"
                      checked={permissionForm.toDo.indexOf(e.role_name) > -1}
                    />
                    <ListItemText primary={e.role_name} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={4} sm={4}>
              <InputLabel sx={{ fontSize: 14, my: 1 }}>Doing</InputLabel>
              <Select
                color="secondary"
                multiple
                fullWidth
                required
                value={permissionForm.doing}
                onChange={handleDOING}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleData.map((e) => (
                  <MenuItem
                    key={e.role_name}
                    value={e.role_name}
                    sx={{ height: 40 }}
                  >
                    <Checkbox
                      color="secondary"
                      checked={permissionForm.doing.indexOf(e.role_name) > -1}
                    />
                    <ListItemText primary={e.role_name} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={4} sm={4}>
              <InputLabel sx={{ fontSize: 14, my: 1 }}>Done</InputLabel>
              <Select
                color="secondary"
                multiple
                fullWidth
                required
                value={permissionForm.done}
                onChange={handleDONE}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleData.map((e) => (
                  <MenuItem
                    key={e.role_name}
                    value={e.role_name}
                    sx={{ height: 40 }}
                  >
                    <Checkbox
                      color="secondary"
                      checked={permissionForm.done.indexOf(e.role_name) > -1}
                    />
                    <ListItemText primary={e.role_name} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel sx={{ fontSize: 14, my: 1 }}>
                Task Create Permissions
              </InputLabel>
              <Select
                color="secondary"
                multiple
                fullWidth
                required
                value={permissionForm.taskCreate}
                onChange={handleTASKCREATE}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleData.map((e) => (
                  <MenuItem
                    key={e.role_name}
                    value={e.role_name}
                    sx={{ height: 40 }}
                  >
                    <Checkbox
                      color="secondary"
                      checked={
                        permissionForm.taskCreate.indexOf(e.role_name) > -1
                      }
                    />
                    <ListItemText primary={e.role_name} />
                  </MenuItem>
                ))}
              </Select>
              <CreateAppColorBox setAppColor={setAppColor} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 10,
              mb: 2,
              bgcolor: "#E1D6EE",
              color: "black",
              ":hover": {
                backgroundColor: "#C2ADDD",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      ) : (
        <Loadingbar />
      )}
    </>
  );
}

export default CreateNewApp;
