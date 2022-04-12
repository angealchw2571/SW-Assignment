const express = require("express");
const router = express.Router();
const TASKC = require("../libs/appControllerLibs.js");
const USERC = require("../libs/userControllerLibs.js")
const EMAILC = require("../email.js")

//* ======================    @     GET single APPLICATION w/ appAcronym       ==============================
router.get("/apps/:appAcronym", async function (req, res) {
  const {appAcronym} = req.params

  try {
    const data = await TASKC.FetchApp(appAcronym);
    if (data[0]===undefined){
      res.status(400).json({message:"No app found"});
    }
    else {
      const result = await TASKC.FetchGroupTeamOnApp(appAcronym)
      data[0].group_team_assignment = result.group_team_assignment
      res.status(200).json(data);
    }
  } catch (err) {
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

//* ======================    @     GET ALL PLAN       ==============================
router.get("/plans", async function (req, res) {
  try {
    const data = await TASKC.FetchAllPlan();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET ALL TASKS with AppAcronym       ==============================
router.get("/tasks/:appAcronym", async function (req, res) {
  const {appAcronym} = req.params

  try {
    const data = await TASKC.FetchTask(appAcronym);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET single TASK with task_id       ==============================
router.get("/task/:task_id", async function (req, res) {
  const {task_id} = req.params
  try {
    const data = await TASKC.FetchSingleTask(task_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Add new tasknote with task_id       ==============================
router.post("/tasknote/:task_id", async function (req, res) {
  const {task_id} = req.params
  const newNote = req.body

  try {
    const data = await TASKC.FetchTaskNotes(task_id);
    const newData  = [...data.Task_notes, newNote ]
    console.log("before", data.Task_notes)
    console.log("after", newData)
    const finalResult = await TASKC.AddTaskNotes(newData, task_id )
    res.status(200).json(finalResult);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Handle kanban        ==============================
router.post("/kanban", async function (req, res) {
    const data = req.body
  try {
    const result = await TASKC.UpdateTask(data.taskID, data.taskState, data.taskOwner)
    res.status(200).json(result);
  } catch (err) {
    console.log("err", err)
    res.status(400).json(err);
  }
});

//* ======================    @     Create new application      ==============================
router.post("/createapp", async function (req, res) {
  const {
    App_Acronym,
    App_Description,
    startDate,
    endDate,
    App_Rnumber,
    permissionForm,
  } = req.body;


  const app_permit_toDoList = []
  const app_permit_doing = []
  const app_permit_done = []
  const group_team_assignment = []

  for (const [key, value] of Object.entries(permissionForm.form1)) {
    if (value){
      app_permit_toDoList.push(`${key}`)
    }
  }
  for (const [key, value] of Object.entries(permissionForm.form2)) {
    if(value){
      app_permit_doing.push(`${key}`)
    }
  }
  for (const [key, value] of Object.entries(permissionForm.form3)) {
    if(value){
      app_permit_done.push(`${key}`)
    }
  }

  for (const [key, value] of Object.entries(permissionForm.groupForm)) {
    if(value){
      group_team_assignment.push(`${key}`)
    }
  }


  try {
    const data = await TASKC.CreateNewApp(
      App_Acronym,
      App_Description,
      startDate,
      endDate,
      app_permit_toDoList,
      app_permit_doing,
      app_permit_done,
      App_Rnumber
    );
    if (data){
      TASKC.AddAppTeamAssignment(App_Acronym, group_team_assignment)


      
      res.status(200).json({message:"success"});
    }
  } catch (err) {
    console.log("err", err)
    res.status(400).json(err);
  }
});

//* ======================    @@     Create new application      ==============================
router.post("/updateapp", async function (req, res) {
  const {
    App_Acronym,
    App_Description,
    startDate,
    endDate,
    App_Rnumber,
    permissionForm,
  } = req.body;

  const app_permit_toDoList = []
  const app_permit_doing = []
  const app_permit_done = []
  const group_team_assignment = []

  for (const [key, value] of Object.entries(permissionForm.form1)) {
    if (value){
      app_permit_toDoList.push(`${key}`)
    }
  }
  for (const [key, value] of Object.entries(permissionForm.form2)) {
    if(value){
      app_permit_doing.push(`${key}`)
    }
  }
  for (const [key, value] of Object.entries(permissionForm.form3)) {
    if(value){
      app_permit_done.push(`${key}`)
    }
  }
  for (const [key, value] of Object.entries(permissionForm.groupForm)) {
    if(value){
      group_team_assignment.push(`${key}`)
    }
  }
  try {
    const data = await TASKC.UpdateApp(
      App_Acronym,
      App_Description,
      startDate,
      endDate,
      app_permit_toDoList,
      app_permit_doing,
      app_permit_done,
      App_Rnumber
    );
    if (data){
      console.log("groupTeam", group_team_assignment)
      TASKC.UpdateAppTeamAssignment(App_Acronym, group_team_assignment)
      res.status(200).json({message:"Update success"});
    }
  } catch (err) {
    console.log("err", err)
    res.status(400).json(err);
  }
});

//* =======================    @     Create new plan      ==============================
router.post("/createplan", async function (req, res) {
  const { plan_app_acronym, plan_mvp_name, plan_startDate, plan_endDate } =
    req.body;

  console.log("plan acronym", plan_app_acronym);
  console.log("mvp name", plan_mvp_name);
  console.log("startDate", plan_startDate);
  console.log("endDate", plan_endDate);

  try {
    const data = await TASKC.CreateNewPlan(
      plan_app_acronym,
      plan_mvp_name,
      plan_startDate,
      plan_endDate
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* =======================    @     Create new plan      ==============================
router.post("/creategroup", async function (req, res) {
  const { group_name } = req.body;
  console.log("groupname in express", group_name);

  try {
    const data = await TASKC.CreateNewGroup(group_name);
    res.status(200).json({message:"Success"});
  } catch (err) {
    res.status(400).json(err);
  }
});

//* =======================    @     Create new task      ==============================
router.post("/createtask", async function (req, res) {
  const data = req.body;
  

  try {
    const rNumber = await TASKC.FetchRnumber(data.appAcronym);
    console.log("rnumber", rNumber.App_Rnumber)
    const newRnumber = rNumber.App_Rnumber + 1
    console.log("newRnumber", newRnumber, typeof newRnumber)
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
    TASKC.UpdateRnumber(data.appAcronym, newRnumber)
    res.status(200).json(result);
  } catch (err) {
    console.log("err", err)
    res.status(400).json(err);
  }
});

//* ================    @     Fetches app according to team assigned      ==============================
router.get("/appgroups", async function (req, res) {
  let appArr = []
  let package = []
  const team = req.session.teams
  const {role_groups} = req.session.loginUser
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
        // console.log("result2", result2)
        package.push(result2[0]);
      }
      res.status(200).json(package);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     Fetches Group Assigned to App     ==============================
router.get("/appgroups/:appAcronym", async function (req, res) {
  const {appAcronym} = req.params

  try {
    const data = await TASKC.FetchGroupTeamOnApp(appAcronym);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});


//! ======================    @     FEmail route   ==============================
router.post("/appgroups/email", async function (req, res) {
  const { userID, groupName } = req.body;
  const roleName="Project Lead"
  let package = []
  try {
    const allUsers = await USERC.FindAllUser()
    // console.log("allUsers", allUsers)
    for (let i=0; i < allUsers.length; i++) {
      const username =  await USERC.FetchUsername(allUsers[i].user_id);
      const roleGroup =  await USERC.RoleGroupFetch(username)
      const result = await USERC.CheckRole(roleGroup[0].role_groups, roleName);
      if (result === true) {
        if (allUsers[i].group_name == groupName){
          package.push(allUsers[i])
          const leadData = await USERC.FetchProfileData(allUsers[i].user_id)
          const devData = await USERC.FetchProfileData(userID)
          EMAILC.SendDoneEmail(devData.email, leadData.email)
          
        }
      }
    }
    res.status(200).json(package);
  } catch (error) {
    console.log("error from catch block", error);
  }
});



module.exports = router;
