import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { toast } from "react-toastify";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";

function CreateNewPlan({ appData }) {
  console.log("appData, create new plan", appData);
  const [appSelect, setAppSelect] = useState(appData[0].App_Acronym);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleOnChange = (event) => {
    setAppSelect(event.target.value);
  };

  const handleQuery = async (data) => {
    await axios
      .post(`/api/app/createplan`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            // setModalCreateTask(!modalCreateTask);
            // handleRefresh("ALL");
          }, 2000);
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { planName, planDescription } = event.target;
    const data = {
      plan_app_acronym: appSelect,
      plan_mvp_name: planName.value,
      plan_description: planDescription.value,
      plan_startDate: startDate,
      plan_endDate: endDate,
    };

    console.log("data", data);
    handleQuery(data);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
        }}
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create New Plan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="select-form">Select App</InputLabel>
            <Select
              size="small"
              id="select-form"
              fullWidth
              value={appSelect}
              input={<OutlinedInput />}
              onChange={handleOnChange}
            >
              {appData.map((e, i) => {
                return (
                  <MenuItem key={i} value={e.App_Acronym}>
                    <span style={{ color: `${e.App_Color}`, paddingRight: 10 }}>
                      ●
                    </span>
                    {e.App_Acronym}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="planName"
              required
              size="small"
              fullWidth
              id="planName"
              label="Plan MVP Name"
              color="secondary"
              inputProps={{ maxLength: 100 }}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="planDescription"
              required
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: 250 }}
              id="planDescription"
              label="Plan Description"
              color="secondary"
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
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 8,
            mb: 2,
            bgcolor: "#E1D6EE",
            color: "black",
            ":hover": {
              backgroundColor: "#C2ADDD",
            },
          }}
        >
          Add Plan
        </Button>
      </Box>
    </>
  );
}

export default CreateNewPlan;
