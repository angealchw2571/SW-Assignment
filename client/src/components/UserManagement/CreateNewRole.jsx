import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

function CreateNewRole() {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");

  const handleQuery = async (data) => {
    await axios
      .post(`/api/user/newrole`, data)
      .then((res) => {
        if (res) {
          toast.info(
            <div>
              Role name: {roleName} <br /> Role Description: {roleDescription}
            </div>
          , { autoClose: 4000 });
          toast.success(res.data.message);
          setRoleName("");
          setRoleDescription("");
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const onChangeRoleName = (event) => {
    event.preventDefault();
    setRoleName(event.target.value);
  };

  const onChangeRoleDescription = (event) => {
    event.preventDefault();
    setRoleDescription(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleQuery({ role_name: roleName, role_description: roleDescription });
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
              Create New Role
            </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="role_name"
                    required
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                    color="secondary"
                    label="Role name"
                    value={roleName}
                    defaultValue={roleName}
                    onChange={onChangeRoleName}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="role_description"
                    required
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                    color="secondary"
                    label="Role Description"
                    value={roleDescription}
                    defaultValue={roleDescription}
                    onChange={onChangeRoleDescription}
                  />
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

export default CreateNewRole;
