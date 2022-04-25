import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Grid, Box, Typography, InputLabel } from "@mui/material";

function CreateAppColorBox({ setAppColor, defaultColor }) {
  const [groupColor, setGroupColor] = useState(defaultColor || "#aabbcc");

  const handleOnChange = (event) => {
    // console.log("event", Event)
    setGroupColor(event);
    setAppColor(event);
  };

  return (
    <>
      <InputLabel sx={{ fontSize: 14, my: 1 }}>
        Task Create Permissions
      </InputLabel>
      <Grid container>
        <Grid item xs={2} sm={2}>
          <HexColorPicker
            color={groupColor}
            onChange={handleOnChange}
            style={{ height: 170 }}
          />
        </Grid>
        <Grid item xs={6} sm={6} sx={{ position: "relative" }}>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              position: "absolute",
              left: "35%",
            }}
          >
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
              // borderRadius: 30,
              display: "flex",
              textAlign: "center",
              background: `${groupColor}`,
            }}
          ></Box>
        </Grid>
      </Grid>
    </>
  );
}

export default CreateAppColorBox;
