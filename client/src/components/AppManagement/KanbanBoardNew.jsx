import React from "react";
import Board, { moveCard } from "@asseinfo/react-kanban";
import Button from "@mui/material/Button";
import "@asseinfo/react-kanban/dist/styles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./kanbanStyles.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const moment = require("moment");
const checkPermissions = require("../checkPermissions");

function KanbanBoardNew({ taskData, appData, handleModelFunc, sessionData }) {
  let OPEN = [];
  let TODO = [];
  let DOING = [];
  let DONE = [];


  for (let i = 0; i < taskData.length; i++) {
    if (taskData[i].Task_state === "TODO") {
      TODO.push(taskData[i]);
    } else if (taskData[i].Task_state === "DOING") {
      DOING.push(taskData[i]);
    } else if (taskData[i].Task_state === "DONE") {
      DONE.push(taskData[i]);
    } else if (taskData[i].Task_state === "OPEN") {
      OPEN.push(taskData[i]);
    }
  }

  const cardReturn = (arr) => {
    let finalData = [];
    arr.forEach((e, i) => {
      const data = {
        id: e.Task_id,
        title: (
          <div className="KanbanCardTitle">
            <h3>
              [{e.Task_id}] {e.Task_name}
            </h3>
          </div>
        ),
        description: { e },
      };
      finalData = [...finalData, data];
    });
    return finalData;
  };

  const board = {
    columns: [
      //?   ==============================          Open      =================================================
      {
        id: 1,
        title: "Open Task",
        cards: cardReturn(OPEN),
      },
      //?   ==============================          To Do      =================================================
      {
        id: 2,
        title: "Backlog To Do",
        cards: cardReturn(TODO),
      },
      //?   ===============================          Doing      =================================================
      {
        id: 3,
        title: "Doing",
        cards: cardReturn(DOING),
      },
      //?   ============================          Done      =================================================
      {
        id: 4,
        title: "Done",
        cards: cardReturn(DONE),
      },
    ],
  };

  const [controlledBoard, setBoard] = useState(board);

  const handleQuery2 = async (data) => {
    await axios
      .post(`/api/app/kanban`, data)
      .then((res) => {
        // console.log("res", res.data)
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleEmail = async (data) => {
    await axios
      .post(`/api/app/appgroups/email`, data)
      .then((res) => {})
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleCardMove = (_card, source, destination) => {
    const currentAppData = cardMove(_card.description.e.Task_App_Acronym);
    const difference = Math.abs(destination.toColumnId - source.fromColumnId);
    const updatedBoard = moveCard(controlledBoard, source, destination);
    if (destination.toColumnId === 1) {
      const permission = checkPermissions(
        ["Admin", "Project Manager"],
        sessionData.role_groups
      );
      if (!permission || difference > 1) {
        toast.error("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "OPEN",
        });
      }
    } else if (destination.toColumnId === 2) {
      const permission = checkPermissions(
        currentAppData.App_permit_toDoList,
        sessionData.role_groups
      );

      if (!permission || difference > 1) {
        toast.error("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "TODO",
        });
      }
    } else if (destination.toColumnId === 3) {
      const permission = checkPermissions(
        currentAppData.App_permit_Doing,
        sessionData.role_groups
      );

      if (!permission || difference > 1) {
        toast.error("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "DOING",
        });
      }
    } else if (destination.toColumnId === 4) {
      const permission = checkPermissions(
        currentAppData.App_permit_Done,
        sessionData.role_groups
      );

      if (!permission || difference > 1) {
        toast.error("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "DONE",
        });
        handleEmail({
          userID: sessionData.user_id,
          groupName: sessionData.group_name,
        });
      }
    } else {
      return;
    }
  };

  const cardMove = (App_Acronym) => {
    let value = null;
    appData.forEach((e, i) => {
      if (e.App_Acronym === App_Acronym) {
        value = appData[i];
      }
    });
    return value;
  };

  return (
    <>
      <Board
        onCardDragEnd={handleCardMove}
        disableColumnDrag
        renderCard={(args) => {
          return (
            <Accordion sx={{ width: "100%", my: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: "white",
                  color: `${
                    cardMove(args.description.e.Task_App_Acronym).App_Color
                  }`,
                }}
              >
                <FiberManualRecordIcon />
                <Typography
                  sx={{ fontSize: 14, fontWeight: "bold", color: "black" }}
                >
                  {args.description.e.Task_id} - {args.description.e.Task_name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {args.description.e.Task_notes.length > 0 ? (
                    <Button
                      size="small"
                      onClick={() => handleModelFunc(args.id)}
                      sx={{
                        float: "right",
                        fontSize: 8,
                        bgcolor: "#ead8f2",
                        color: "black",
                        ":hover": {
                          backgroundColor: "#e1b8f2",
                        },
                      }}
                    >
                      notes
                    </Button>
                  ) : null}

                  <Typography sx={{ fontSize: 13 }}>
                    {args.description.e.Task_description}
                  </Typography>
                  <div style={{ paddingTop: 18 }}>
                    <Typography
                      sx={{
                        fontSize: 11,
                        float: "left",
                        color: "#1a7d13",
                        position: "absolute",
                        bottom: 5,
                      }}
                    >
                      Current owner: {args.description.e.Task_owner} <br />
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, float: "right", color: "#7d7d7d" }}
                    >
                      Created by: {args.description.e.Task_creator} <br />
                      Date:
                      {moment(args.description.e.Task_createDate).format(
                        "DD-MMM-YYYY"
                      )}
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        }}
      >
        {controlledBoard}
      </Board>
    </>
  );
}

export default KanbanBoardNew;
