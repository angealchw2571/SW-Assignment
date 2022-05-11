const express = require("express");
const router = express.Router();
const TASKC = require("../libs/appControllerLibs.js");
const USERC = require("../libs/userControllerLibs.js");
const JWTFunction = require("../libs/jwtLib");
const EMAILC = require("../email.js");

const isAdmin = async (req, res, next) => {
  try {
    const authResult = await authorisationFunc(
      req.cookies.JWT,
      req.headers.authorization
    );
    if (authResult) {
      const roleGroup = await USERC.RoleGroupFetch(authResult.username);
      const checkRoleResult = await USERC.CheckRole(
        roleGroup[0].role_groups,
        "Admin"
      );
      if (checkRoleResult) {
        next();
      } else {
        res.status(400).json({
          message: "Sorry you are not authorised to perform this action ",
        });
      }
    } else {
      res.status(400).json({
        message: "Sorry you are not authorised to perform this action",
      });
    }
  } catch (err) {
    console.log("isAdmin err", err);
    res
      .status(400)
      .json({ message: "Sorry you are not authorised to perform this action" });
  }
};

const authorisationFunc = async (JWT, authheader) => {
  if (JWT) {
    const result = JWTFunction.validateJWT(JWT);
    return result;
  } else if (authheader) {
    const auth = new Buffer.from(authheader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];
    const result = await USERC.FindUserData(username);
    if (result) {
      const passwordCheck = await USERC.CheckPassword(username, password);
      if (passwordCheck) {
        return result[0];
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//? ========  Assignment 3         ==========    @     GET tasks  In certain state       ==============================
router.get("/taskstate", isAdmin, async function (req, res) {
  const { state } = req.query;
  const stateOptions = ["OPEN", "TODO", "DOING", "DONE"];

  try {
    if (state.length === 0) {
      res.status(400).json({ message: "INVALID PARAM (ERR 23232S)" });
    } else if (state.length > 0) {
      const capitalizedState = state.toUpperCase();
      const result = stateOptions.filter((e) => e === capitalizedState);
      if (result[0]) {
        const data = await TASKC.FetchTasksInState(result[0]);
        res.status(200).json(data);
      } else {
        res.status(400).json({ message: "BAD REQUEST (ERR 336D32)" });
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ message: "BAD REQUEST (ERR 372R23)" });
  }
});

//?  =======    Assignment 3    ===========    @     Create new task      ==============================
router.post("/createtask", async function (req, res) {
  const data = req.body;
  const authResult = await authorisationFunc(
    req.cookies.JWT,
    req.headers.authorization
  );

  try {
    if (
      data.appAcronym.length < 3 ||
      data.taskName === undefined ||
      data.taskDescription === undefined
    ) {
      res.status(400).json({ message: "Invalid parameters (ERR 99HF4)" });
    } else {
      const capitalizedAcro = data.appAcronym.toUpperCase();
      const result = await TASKC.FetchApp(capitalizedAcro);
      if (result[0] === undefined) {
        res.status(400).json({ message: "Invalid Parameters (ERR 32858J)" });
      } else {
        let permissionCondition = false;
        const appPermitCreate = result[0].App_permit_createTask;
        for (i = 0; i < appPermitCreate.length; i++) {
          const result = await USERC.CheckGroupV2(
            authResult.username,
            appPermitCreate[i]
          );
          if (result) {
            permissionCondition = true;
          }
        }

        if (!permissionCondition) {
          res
            .status(400)
            .json({
              message:
                "Sorry you are not authorised to perform this action (ERR 1114F)",
            });
        } else {
          if (data.taskNote === undefined || data.taskNote.length === 0) {
            data.taskNote = [];
          } else {
            data.taskNote = [
              {
                note: data.taskNote,
                userID: authResult.username,
                dateTime: new Date(),
                currentState: "OPEN",
              },
            ];
          }
          const rNumber = await TASKC.FetchRnumber(data.appAcronym);
          const newRnumber = rNumber.App_Rnumber + 1;
          const newTaskID = `${data.appAcronym}_${rNumber.App_Rnumber}`;
          data.taskID = newTaskID;
          const newTaskResult = await TASKC.CreateNewTask(
            data.appAcronym,
            "NULL",
            data.taskID,
            data.taskName,
            data.taskDescription,
            data.taskNote,
            "OPEN",
            authResult.username,
            authResult.username,
            new Date()
          );
          if (newTaskResult) {
            const rNumResult = await TASKC.UpdateRnumber(
              data.appAcronym,
              newRnumber
            );
            if (rNumResult)
              res.status(200).json({ message: "Create Task Success" });
          }
        }
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ message: "BAD REQUEST (ERR 343PG4)" });
  }
});

//?  =======    Assignment 3    ===========    @     Promote task from doing to done      ==============================
router.post("/promote/todo_to_done", async function (req, res) {
  const data = req.body;
  const roleName = "Project Lead";
  const authResult = await authorisationFunc(
    req.cookies.JWT,
    req.headers.authorization
  );
  const taskDetails = await TASKC.FetchSingleTask(data.taskID);
  const appDetails = await TASKC.FetchApp(taskDetails[0].Task_App_Acronym);
  const fetchGroupName = await TASKC.FetchGroupName(authResult.username);

  try {
    if (appDetails[0] === undefined || taskDetails[0] === undefined) {
      res.status(400).json({ message: "Invalid Request (ERR 8TFD3)" });
    } else if (taskDetails[0].Task_state != "TODO") {
      res.status(400).json({ message: "Invalid Request (ERR 444D3)" });
    } else {
      const appDonePermit = appDetails[0].App_permit_Done;
      let condition = false;
      for (i = 0; i < appDonePermit.length; i++) {
        const result = await USERC.CheckGroupV2(
          authResult.username,
          appDonePermit[i]
        );
        if (result) {
          condition = true;
        }
      }

      if (!condition) {
        res
          .status(400)
          .json({ message: "You are not authorised to perform this action " });
      } else {
        const newNote = {
          note: `${authResult.username} changed task state from DOING to DONE `,
          userID: `${authResult.username} `,
          dateTime: new Date(),
          currentState: "DONE",
        };
        const updateResult = await TASKC.UpdateTask(
          data.taskID,
          "DONE",
          authResult.username
        );
        if (!updateResult) {
          res.status(400).json({ message: "Invalid Request (ERR 49894F)" });
        } else {
          const currentTask = await TASKC.FetchTaskNotes(data.taskID);
          const newData = [...currentTask.Task_notes, newNote];
          const AddTaskNotesResult = await TASKC.AddTaskNotes(
            newData,
            data.taskID
          );
          if (!AddTaskNotesResult) {
            res.status(400).json({ message: "Invalid Request(ERR 444DC1)" });
          } else {
            // ! =============================           Email          ==============================================================
            const allUsers = await USERC.FindAllUser();
            for (let i = 0; i < allUsers.length; i++) {
              const username = await USERC.FetchUsername(allUsers[i].user_id);
              const roleGroup = await USERC.RoleGroupFetch(username);
              const result = await USERC.CheckRole(
                roleGroup[0].role_groups,
                roleName
              );
              if (result === true) {
                if (allUsers[i].group_name == fetchGroupName[0].group_name) {
                  const leadData = await USERC.FetchProfileData(
                    allUsers[i].user_id
                  );
                  const devData = await USERC.FetchProfileData(
                    authResult.user_id
                  );
                  EMAILC.SendDoneEmail(devData.email, leadData.email);
                }
              }
            }
            res.status(200).json({ message: "Update success & Email sent " });
          }
        }
      }
    }
  } catch (err) {
    console.log("err from catch block", err);
    res.status(400).json({ message: "Invalid Request (ERR 985D1)" });
  }
});

module.exports = router;
