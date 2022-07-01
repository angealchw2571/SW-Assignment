
// depreciated file, for reference only

import Board, { moveCard } from "@asseinfo/react-kanban";
import Button from "@mui/material/Button";
import "@asseinfo/react-kanban/dist/styles.css";
import { React, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";

const moment = require("moment");
const checkPermissions = require("../checkPermissions");

function KanbanBoard({ taskData, appAcronym, sessionData, appData, getData }) {
  let OPEN = [];
  let TODO = [];
  let DOING = [];
  let DONE = [];
  // console.log()

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
    arr.forEach((e) => {
      const data = {
        id: e.Task_id,
        title: (
          <div className="KanbanCardTitle">
            <h3>
              [{e.Task_id}] {e.Task_name}
            </h3>
          </div>
        ),
        description: (
          <div>
            <div>
              Description: <br /> <h4>{e.Task_description}</h4>
            </div>
            <p>
              Task Creator: {e.Task_creator}
              <br />
              Task Current Owner: {e.Task_owner}
              <br />
              Date Created: {moment(e.Task_createDate).format("DD-MMM-YYYY")}
            </p>
            <Link to={`/apptask/${appAcronym}/${e.Task_id}`} style={{textDecoration: 'none',}}>
            <Button
          size="small"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: "pink",
            color: "black",
            ":hover": {
              backgroundColor: "#ff8aae",
              color: "#f9f1f1",
            },
          }}
        >
          <Typography>View more</Typography>
        </Button></Link>
          </div>
        ),
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
    const updatedBoard = moveCard(controlledBoard, source, destination);
    if (destination.toColumnId === 1) {
      const permission = checkPermissions(
        ["Admin", "Project Manager"],
        sessionData.role_groups
      );
      if (!permission) {
        alert("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "OPEN",
        });
        getData();
      }
    } else if (destination.toColumnId === 2) {
      const permission = checkPermissions(
        appData.App_permit_toDoList,
        sessionData.role_groups
      );
      if (!permission) {
        alert("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "TODO",
        });
        getData();
      }
    } else if (destination.toColumnId === 3) {
      const permission = checkPermissions(
        appData.App_permit_Doing,
        sessionData.role_groups
      );
      if (!permission) {
        alert("You do not have enough permission to do that");
        return;
      } else {
        setBoard(updatedBoard);
        handleQuery2({
          taskID: _card.id,
          taskOwner: sessionData.username,
          taskState: "DOING",
        });
        getData();
      }
    } else if (destination.toColumnId === 4) {
      const permission = checkPermissions(
        appData.App_permit_Done,
        sessionData.role_groups
      );
      if (!permission) {
        alert("You do not have enough permission to do that");
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
        getData();
      }
    } else {
      return;
    }
  };

  return (
    <>
      <Board
        onCardDragEnd={handleCardMove}
        disableColumnDrag
        style={{ maxWidth: "100%" }}
      >
        {controlledBoard}
      </Board>
    </>
  );
}

export default KanbanBoard;
