const express = require("express");
const router = express.Router();
const TASKC = require("../libs/appControllerLibs.js");
const USERC = require("../libs/userControllerLibs.js");
const EMAILC = require("../email.js");
const JWTFunction = require("../libs/jwtLib");

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
      res
        .status(400)
        .json({
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

const validateAppPermission = async (appAcronym, userData, ACTION) => {
  const roleGroup = await USERC.RoleGroupFetch(userData.username);
  const appDetails = await TASKC.FetchApp(appAcronym);
  if (roleGroup[0].role_groups.includes("Admin")) return true;
  let data = {};
  if (ACTION === "CREATETASK") {
    data.arr = appDetails[0].App_permit_createTask;
  } else if (ACTION === "OPEN") {
    data.arr = appDetails[0].App_permit_Open;
  } else if (ACTION === "TODO") {
    data.arr = appDetails[0].App_permit_toDoList;
  } else if (ACTION === "DOING") {
    data.arr = appDetails[0].App_permit_Doing;
  } else if (ACTION === "DONE") {
    data.arr = appDetails[0].App_permit_Done;
  }

  const roleGroupArr = roleGroup[0].role_groups;
  const matchArr = data.arr.filter((element) => roleGroupArr.includes(element));
  if (matchArr.length === 0) {
    return false;
  } else {
    return true;
  }
};

//* ======================    @     GET single APPLICATION w/ appAcronym       ==============================
router.get("/apps/:appAcronym", async function (req, res) {
  const { appAcronym } = req.params;

  try {
    const data = await TASKC.FetchApp(appAcronym);
    if (data[0] === undefined) {
      res.status(400).json({ message: "No app found" });
    } else {
      const result = await TASKC.FetchGroupTeamOnApp(appAcronym);
      data[0].group_team_assignment = result.group_team_assignment;
      let colorArr = [];
      for (i = 0; i < result.group_team_assignment.length; i++) {
        const colorResult = await TASKC.FetchGroupColor(
          result.group_team_assignment[i]
        );
        colorArr.push(colorResult.group_color);
      }
      res.status(200).json(data);
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json(err);
  }
});
//! ======================    @     GET ALL APPLICATIONS       ==============================

router.get("/apps", async function (req, res) {
  try {
    const data = await TASKC.FetchAllApp();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET ALL PLANS WITH AppAcronym       ==============================
router.get("/plan/:appAcronym", async function (req, res) {
  const appAcronym = req.params.appAcronym;
  try {
    const data = await TASKC.FetchPlanApp(appAcronym);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET ALL PLAN       ==============================
router.get("/plans", async function (req, res) {
  try {
    const data = await TASKC.FetchAllPlan();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});
//* ======================    @     GET ALL TASKS       ==============================
router.get("/alltasks", async function (req, res) {
  try {
    const data = await TASKC.FetchAllTask();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//? ========  Assignment 3         ==========    @     GET tasks  In certain state       ==============================
router.get("/task/:state", isAdmin, async function (req, res) {
  const { state } = req.params;

  try {
    const data = await TASKC.FetchTasksInState(state);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET ALL TASKS with AppAcronym       ==============================
router.get("/tasks/:appAcronym", async function (req, res) {
  const { appAcronym } = req.params;
  console.log("143 hit here!");

  try {
    const data = await TASKC.FetchTask(appAcronym);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET single TASK with task_id       ==============================
router.get("/task/:task_id", async function (req, res) {
  const { task_id } = req.params;
  try {
    const data = await TASKC.FetchSingleTask(task_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Add new tasknote with task_id       ==============================
router.post("/tasknote/:task_id", async function (req, res) {
  const { task_id } = req.params;
  const newNote = req.body;

  try {
    const data = await TASKC.FetchTaskNotes(task_id);
    const newData = [...data.Task_notes, newNote];
    const finalResult = await TASKC.AddTaskNotes(newData, task_id);
    res.status(200).json({ message: "Add New Task Note Successful" });
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Handle kanban        ==============================
router.post("/kanban", async function (req, res) {
  const data = req.body;
  const authResult = await authorisationFunc(req.cookies.JWT, req.headers.authorization);
  const validationResult = await validateAppPermission(data.appAcronym, authResult, data.taskState );

  if (validationResult) {
    try {
      const newNote = {
        note: `${authResult.username} changed task state from ${data.previousTaskState} to ${data.taskState} `,
        userID: `${authResult.username} `,
        dateTime: data.dateTime,
        currentState: data.taskState,
      };
      const result = await TASKC.UpdateTask(
        data.taskID,
        data.taskState,
        data.taskOwner
      );
      const currentTask = await TASKC.FetchTaskNotes(data.taskID);
      const newData = [...currentTask.Task_notes, newNote];
      const finalResult = await TASKC.AddTaskNotes(newData, data.taskID);
      res.status(200).json({ message: "Update success" });
    } catch (err) {
      console.log("err", err);
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({
      message: "Sorry you do not have permission to perform this task",
    });
  }
});

//* ======================    @     Create new application      ==============================
router.post("/createapp", async function (req, res) {
  const App_Acronym = req.body.appAcronym;
  const App_Rnumber = req.body.appReleaseNumber;
  const App_Description = req.body.appDescription;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const app_permit_toDoList = req.body.permissionForm.toDo;
  const app_permit_doing = req.body.permissionForm.doing;
  const app_permit_done = req.body.permissionForm.done;
  const app_permit_createTask = req.body.permissionForm.taskCreate;
  const group_team_assignment = req.body.groupRoleArr;
  const appColor = req.body.appColor;
  try {
    const data = await TASKC.CreateNewApp(
      App_Acronym,
      App_Description,
      startDate,
      endDate,
      app_permit_toDoList,
      app_permit_doing,
      app_permit_done,
      app_permit_createTask,
      App_Rnumber,
      appColor
    );
    if (data) {
      TASKC.AddAppTeamAssignment(App_Acronym, group_team_assignment);
      res.status(200).json({ message: "successfully created new app" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json(err);
  }
});

//* ======================    @@     update  application      ==============================
router.post("/updateapp", async function (req, res) {
  const App_Acronym = req.body.appAcronym;
  const App_Rnumber = req.body.appReleaseNumber;
  const App_Description = req.body.appDescription;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const app_permit_toDoList = req.body.permissionForm.toDo;
  const app_permit_doing = req.body.permissionForm.doing;
  const app_permit_done = req.body.permissionForm.done;
  const app_permit_createTask = req.body.permissionForm.taskCreate;
  const group_team_assignment = req.body.groupRoleArr;
  const appColor = req.body.appColor;

  try {
    const data = await TASKC.UpdateApp(
      App_Acronym,
      App_Description,
      startDate,
      endDate,
      app_permit_toDoList,
      app_permit_doing,
      app_permit_done,
      app_permit_createTask,
      App_Rnumber,
      appColor
    );
    if (data) {
      TASKC.UpdateAppTeamAssignment(App_Acronym, group_team_assignment);
      res.status(200).json({ message: "Update App Success" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json(err);
  }
});

//* =======================    @     Create new plan      ==============================
router.post("/createplan", async function (req, res) {
  const {
    plan_app_acronym,
    plan_mvp_name,
    plan_startDate,
    plan_endDate,
    plan_description,
  } = req.body;

  try {
    const data = await TASKC.CreateNewPlan(
      plan_app_acronym,
      plan_mvp_name,
      plan_startDate,
      plan_endDate,
      plan_description
    );
    if (data) {
      res.status(200).json({ message: "Create plan success" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(400).json(err);
  }
});

//* =======================    @     Create new group      ==============================
router.post("/creategroup", async function (req, res) {
  const { group_name, group_color } = req.body;

  try {
    const data = await TASKC.CreateNewGroup(group_name, group_color);
    if (data) {
      res.status(200).json({ message: "Create New Group Successful" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//?  =======    Assignment 3    ===========    @     Create new task      ==============================
router.post("/createtask", async function (req, res) {
  const data = req.body;
  const authResult = await authorisationFunc(req.cookies.JWT, req.headers.authorization);
  if (authResult) {
    const validationResult = await validateAppPermission(data.appAcronym, authResult, "CREATETASK");
    if (validationResult) {
      try {
        if (data.taskNote.length === 0) {
          data.taskNote = [];
        } else {
          data.taskNote = [
            {
              note: data.taskNote,
              userID: data.taskCreator,
              dateTime: data.taskCreateDate,
              currentState: data.taskState,
            },
          ];
        }
        const rNumber = await TASKC.FetchRnumber(data.appAcronym);
        const newRnumber = rNumber.App_Rnumber + 1;
        const newTaskID = `${data.appAcronym}_${rNumber.App_Rnumber}`;
        data.taskID = newTaskID;
        const result = await TASKC.CreateNewTask(
          data.appAcronym,
          "NULL",
          data.taskID,
          data.taskName,
          data.taskDescription,
          data.taskNote,
          data.taskState,
          data.taskCreator,
          data.taskOwner,
          data.taskCreateDate
        );
        TASKC.UpdateRnumber(data.appAcronym, newRnumber);
        res.status(200).json({ message: "Create new task successful" });
      } catch (err) {
        console.log("err", err);
        res.status(400).json(err);
      }
    } else {
      res
        .status(400)
        .json({ message: "Sorry you do not enough permission to create task" });
    }
  } else {
    res
      .status(400)
      .json({
        message: "Sorry you do not have enough permission to perform this task",
      });
  }
});

//* ================    @     Fetches app according to team assigned      ==============================
router.get("/appgroups", async function (req, res) {
  let appArr = [];
  let package = [];
  const team = req.session.teams;
  const { role_groups } = req.session.loginUser;
  // const role_groups = ["Admin"];
  // console.log(">>>>>", role_groups)

  try {
    if (role_groups.includes("Admin")) {
      const data = await TASKC.FetchAllApp();
      res.status(200).json(data);
    } else {
      const result = await TASKC.FetchGroupTeamAssignment(team);
      for (let i = 0; i < result.length; i++) {
        result[i].group_team_assignment.forEach((e) => {
          if (e === team) {
            appArr.push(result[i].App_Acronym);
          }
        });
      }
      for (let i = 0; i < appArr.length; i++) {
        const result2 = await TASKC.FetchAppDetails(appArr[i]);
        package.push(result2[0]);
      }
      // const finalPackage = JSON.parse(package)
      res.status(200).json(package);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
//! ================    @     Fetches tasks according to app assigned     ==============================
router.get("/apptasks", async function (req, res) {
  let appArr = [];
  // let package = [];
  const team = req.session.teams;
  const { role_groups } = req.session.loginUser;

  try {
    if (role_groups.includes("Admin")) {
      const data = await TASKC.FetchAllTask();
      return res.status(200).json(data);
    } else {
      const result = await TASKC.FetchGroupTeamAssignment(team);
      // console.log("result", result)
      // if ((result.length = 0)) {
      //   res.status(400).json([]);
      // } else {
      for (let i = 0; i < result.length; i++) {
        result[i].group_team_assignment.forEach((e) => {
          if (e === team) {
            appArr.push(result[i].App_Acronym);
          }
        });
      }

      if (appArr.length === 0) {
        return res.status(200).json(appArr);
      } else {
        for (let i = 0; i < appArr.length; i++) {
          const result2 = await TASKC.FetchTask(appArr[i]);
          return res.status(200).json(result2);
        }
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Fetches Group Assigned to App     ==============================
router.get("/appgroups/:appAcronym", async function (req, res) {
  const { appAcronym } = req.params;

  try {
    const data = await TASKC.FetchGroupTeamOnApp(appAcronym);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//! ======================    @     Email route   ==============================
router.post("/appgroups/email", async function (req, res) {
  const { userID, groupName } = req.body;
  const roleName = "Project Lead";
  let package = [];
  try {
    const allUsers = await USERC.FindAllUser();
    for (let i = 0; i < allUsers.length; i++) {
      const username = await USERC.FetchUsername(allUsers[i].user_id);
      const roleGroup = await USERC.RoleGroupFetch(username);
      const result = await USERC.CheckRole(roleGroup[0].role_groups, roleName);
      if (result === true) {
        if (allUsers[i].group_name == groupName) {
          package.push(allUsers[i]);
          const leadData = await USERC.FetchProfileData(allUsers[i].user_id);
          const devData = await USERC.FetchProfileData(userID);
          EMAILC.SendDoneEmail(devData.email, leadData.email);
        }
      }
    }
    res.status(200).json(package);
  } catch (error) {
    console.log("error from catch block", error);
  }
});

module.exports = router;
