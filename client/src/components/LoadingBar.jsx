import React from 'react'
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";


function LoadingBar() {
  return (
    <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={8}>
            <LinearProgress color="secondary" sx={{ width: "100%", mt: 20 }} />
          </Grid>
        </Grid>
  )
}

export default LoadingBar