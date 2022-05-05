import React from "react";
import { Paper, Typography } from "@mui/material";
import { Button } from "@mui/material";
const moment = require("moment");

function TaskModal({ modalTaskData, handleCloseModalForm }) {
  const stateComponent = (state) => {
    if (state === "TODO") {
      return <Typography sx={{ color: "red" }}>{state}</Typography>;
    } else if (state === "DOING") {
      return <Typography sx={{ color: "#eba628" }}>{state}</Typography>;
    } else if (state === "DONE") {
      return <Typography sx={{ color: "green" }}>{state}</Typography>;
    } else if (state === "OPEN") {
      return <Typography sx={{ color: "blue" }}>{state}</Typography>;
    }
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "auto",
          height: "50vh",
        }}
      >
        <Button
          size="small"
          onClick={handleCloseModalForm}
          sx={{
            float: "right",
            marginRight: 3,
            marginBottom: 2,
            bgcolor: "pink",
            color: "black",
            ":hover": {
              backgroundColor: "#ff8aae",
              color: "#f9f1f1",
            },
          }}
        >
          <Typography sx={{ fontSize: 12 }}>Add Notes</Typography>
        </Button>
        <Typography sx={{ fontSize: 28, ml: 4, mb: 1 }}>Notes</Typography>
        {modalTaskData.Task_notes.map((e, i) => {
          return (
            <div>
              <Paper sx={{ py: 2, px:2 }}>
                <div style={{ float: "right", paddingRight: 15,}}>
                  {stateComponent(e.currentState)}
                </div>
                <Typography
                  sx={{ display: "inline", whiteSpace: "pre" }}
                >
                  {e.note}
                </Typography>

                <div>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#7d7d7d",
                      float: "right",
                      paddingRight: 2,
                    }}
                  >
                    Posted by: {e.userID} @ Date:
                    {moment(e.DateTime).format("DD-MMM-YYYY")}
                  </Typography>
                </div>
              </Paper>
            </div>
          );
        }).reverse()}
      </div>
    </>
  );
}

export default TaskModal;
