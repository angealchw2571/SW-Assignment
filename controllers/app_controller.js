const express = require("express");
const router = express.Router();
const TASKC = require("../libs/appControllerLibs.js");

//* ======================    @     GET ALL APPLICATIONS       ==============================

router.get("/apps", async function (req, res) {
  try {
    const data = await TASKC.FetchAllApp();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;

//* ======================    @     GET ALL PLAN       ==============================
router.get("/plans", async function (req, res) {
  try {
    const data = await TASKC.FetchAllPlan();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//* ======================    @     GET ALL TASK       ==============================
router.get("/tasks/:appAcronym", async function (req, res) {
  const {appAcronym} = req.params

  try {
    const data = await TASKC.FetchTask(appAcronym);
    res.status(200).json(data);
  } catch (err) {
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

//! =======================    @     Create new task      ==============================
router.post("/createtask", async function (req, res) {
  const {
    task_app_acronym,
    task_plan,
    task_id,
    task_name,
    task_description,
    notes,
  } = req.body;

  try {
    const data = await TASKC.CreateNewTask(
      task_app_acronym,
      task_plan,
      task_id,
      task_name,
      task_description,
      notes
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

//? ------------------------------------ test route ----------------------------

router.get("/appgroups", async function (req, res) {
  let appArr = []
  let package = []
  const team = req.session.teams
  try {
    const result = await TASKC.FetchGroupTeamAssignment(team);
    for (let i=0; i < result.length ; i++){
      result[i].group_team_assignment.forEach((e)=> {
        if (e === team){
          appArr.push(result[i].App_Acronym)
        }
      })
    }
    
    console.log("appArr", appArr);
    for (let i =0; i < appArr.length; i++){
      const result2 = await TASKC.FetchAppDetails(appArr[i])
      // console.log("result2", result2)
      package.push(result2[0])
    }
    res.status(200).json(package);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
