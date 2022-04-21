import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HexColorPicker } from "react-colorful";

import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

function CreateNewGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#aabbcc");

  const handleQuery = async (data) => {
    await axios
      .post(`/api/app/creategroup`, data)
      .then((res) => {
        if (res) {
          toast.info(
            <div>
              Group name: {groupName} <br /> Group Color: {groupColor}
            </div>,  { autoClose: 4000 }
          );
          toast.success(res.data.message);
          setGroupName("")
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  useEffect(() => {
    cColor(groupColor);
  }, [groupColor]);

  function cColor(color) {
    document.getElementById("theBox").style.backgroundColor = color;
  }

  const onChangeGroupName = (event) => {
    event.preventDefault();
    setGroupName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleQuery({ group_name: groupName, group_color: groupColor });
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          // onSubmit={handleSubmit}
        >
          <Paper elevation={10} sx={{ px: 10, py: 5, borderRadius: 10 }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Create New Group
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="group_name"
                    required
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                    color="secondary"
                    label="Group name"
                    value={groupName}
                    onChange={onChangeGroupName}
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <HexColorPicker
                    color={groupColor}
                    onChange={setGroupColor}
                    style={{ height: 170 }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
                  <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
                    {groupColor}
                  </Typography>
                  <Box
                    id="theBox"
                    sx={{
                      height: 100,
                      width: 100,
                      position: "absolute",
                      top: "30%",
                      left: "30%",
                      borderRadius: 30,
                      display: "flex",
                      textAlign: "center",
                    }}
                  ></Box>
                </Grid>
              </Grid>
              <Button
                type="button"
                fullWidth
                onClick={handleSubmit}
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
                Create Role
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default CreateNewGroup;
