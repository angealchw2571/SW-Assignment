import React, { useState } from "react";
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useRadioGroup,
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

function EditModalForm({ roleData, groupData, userData, handleReFetch }) {
  console.log("...", handleReFetch);
  const [roleArr, setRoleArr] = useState(userData.role_groups);
  const [groupForm, setGroupForm] = useState(userData.group_name);
  const [status, setStatus] = useState(userData.user_status);
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
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
  const handleRadioChange = (event) => {
    setStatus(event.target.value);
  };

  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/${userData.user_id}`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            handleReFetch("ALL");
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email } = event.target;
    console.log(name.value, email.value, roleArr, groupForm, status);
    handleQuery({
      name: name.value,
      email: email.value,
      role_groups: roleArr,
      groupName: groupForm,
      status: status,
    });
  };

  const handleReset = async () => {
    await axios
      .post(`/api/user/edit/reset/${userData.user_id}`)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            handleReFetch("ALL");
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 6 }}>
          Edit User
        </Typography>
        <Button
          onClick={handleReset}
          sx={{
            bgcolor: "#E1D6EE",
            position: "absolute",
            right: "10%",
            color: "black",
            ":hover": {
              backgroundColor: "#ff8aae",
              color: "#f9f1f1",
            },
          }}
        >
          <Typography>reset password</Typography>
        </Button>
        <Grid container sx={{ width: 500 }} spacing={2}>
          <Grid item xs={6} sm={6}>
            <TextField
              name="name"
              defaultValue={userData.name}
              helperText="Name"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              name="email"
              defaultValue={userData.email}
              helperText="Email"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <InputLabel sx={{ fontSize: 14, my: 1 }}>Assign Role</InputLabel>
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
          <Grid item xs={6} sm={6}>
            <InputLabel sx={{ fontSize: 14, my: 1 }}>Group</InputLabel>
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
          <Grid
            item
            xs={12}
            sm={12}
            sx={{ display: "flex", justifyContent: "center", mt: 4 }}
          >
            <FormControl>
              <FormLabel sx={{ textAlight: "center" }}>Status</FormLabel>
              <RadioGroup
                row
                onChange={handleRadioChange}
                defaultValue={userData.user_status === 1 ? "1" : "0"}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio color="secondary" />}
                  label="Active"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio color="secondary" />}
                  label="Inactive"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          type="submit"
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
          Submit
        </Button>
      </Box>
    </>
  );
}

export default EditModalForm;
