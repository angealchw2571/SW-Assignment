const mysql = require("mysql");
const moment = require("moment");

const connection = mysql.createConnection({
  host: "host.docker.internal",
  // host: "localhost",
  user: "root",
  password: process.env.MYSQL_PW,
  database: "assignment_db",
});

function FetchAllPlan() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * from plan;", (err, result) => {
      if (err) {
        return reject(err);
      } else {
        console.log("fetch all plan success");
        return resolve(result[0]);
      }
    });
  });
}

function FetchPlanApp(AppAcronym) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * from plan WHERE Plan_App_Acronym = ?;",
      [AppAcronym],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          console.log("fetch all plan success");
          return resolve(result);
        }
      }
    );
  });
}

function FetchTask(AppAcronym) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * from task WHERE Task_App_Acronym = ?;",
      [AppAcronym],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          result.map((e) => {
            e.Task_notes = JSON.parse(e.Task_notes);
          });
          return resolve(result);
        }
      }
    );
  });
}

function FetchAllTask() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * from task ;", (err, result) => {
      if (err) {
        return reject(err);
      } else {
        result.map((e) => {
          e.Task_notes = JSON.parse(e.Task_notes);
        });
        return resolve(result);
      }
    });
  });
}

function FetchTasksInState(state) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * from task WHERE Task_state =?;",
      [state],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          result.map((e) => {
            e.Task_notes = JSON.parse(e.Task_notes);
          });
          return resolve(result);
        }
      }
    );
  });
}

function FetchApp(AppAcronym) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * from application WHERE App_Acronym = ?;",
      [AppAcronym],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          result.map((e) => {
            e.App_permit_Doing = JSON.parse(e.App_permit_Doing);
            e.App_permit_toDoList = JSON.parse(e.App_permit_toDoList);
            e.App_permit_Done = JSON.parse(e.App_permit_Done);
            e.App_permit_createTask = JSON.parse(e.App_permit_createTask);
            e.App_permit_Open = JSON.parse(e.App_permit_Open);
          });
          return resolve(result);
        }
      }
    );
  });
}

function FetchAllApp() {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT *
      FROM application, 
      app_team_assignment 
      WHERE app_team_assignment.App_Acronym = application.App_Acronym;`,
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          result.map((e) => {
            e.App_permit_Doing = JSON.parse(e.App_permit_Doing);
            e.App_permit_toDoList = JSON.parse(e.App_permit_toDoList);
            e.App_permit_Done = JSON.parse(e.App_permit_Done);
            e.App_permit_createTask = JSON.parse(e.App_permit_createTask);
            e.group_team_assignment = JSON.parse(e.group_team_assignment);
          });
          return resolve(result);
        }
      }
    );
  });
}

function CreateNewApp(
  app_acronym,
  app_description,
  app_startDate,
  app_endDate,
  app_permit_toDoList,
  app_permit_doing,
  app_permit_done,
  app_permit_createTask,
  App_Rnumber,
  appColor
) {
  app_permit_toDoList = JSON.stringify(app_permit_toDoList);
  app_permit_doing = JSON.stringify(app_permit_doing);
  app_permit_done = JSON.stringify(app_permit_done);
  app_permit_createTask = JSON.stringify(app_permit_createTask);
  app_startDate = moment(app_startDate).format("YYYY-MM-DD");
  app_endDate = moment(app_endDate).format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO application (
      App_Acronym, 
      App_Description, 
      App_Rnumber, 
      App_startDate, 
      App_endDate, 
      App_permit_toDoList, 
      App_permit_Doing, 
      App_permit_Done,
      App_permit_createTask,
      App_Color
      ) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`;
    connection.query(
      sqlQuery,
      [
        app_acronym,
        app_description,
        App_Rnumber,
        app_startDate,
        app_endDate,
        app_permit_toDoList,
        app_permit_doing,
        app_permit_done,
        app_permit_createTask,
        appColor,
      ],
      (err, result) => {
        if (err) {
          console.log("err", err);
          return reject(err);
        } else {
          console.log("create application success");
          return resolve(true);
        }
      }
    );
  });
}

function UpdateApp(
  app_acronym,
  app_description,
  app_startDate,
  app_endDate,
  app_permit_toDoList,
  app_permit_doing,
  app_permit_done,
  app_permit_createTask,
  app_Rnumber,
  app_color
) {
  app_permit_toDoList = JSON.stringify(app_permit_toDoList);
  app_permit_doing = JSON.stringify(app_permit_doing);
  app_permit_done = JSON.stringify(app_permit_done);
  app_permit_createTask = JSON.stringify(app_permit_createTask);
  app_startDate = moment(app_startDate).format("YYYY-MM-DD");
  app_endDate = moment(app_endDate).format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE application SET 
      App_Description = ?, 
      App_Rnumber = ?, 
      App_startDate = ?, 
      App_endDate = ?, 
      App_permit_toDoList = ?, 
      App_permit_Doing = ?, 
      App_permit_Done = ?,
      App_permit_createTask = ?,
      App_Color = ?
      WHERE App_Acronym = ?
      ;`;
    connection.query(
      sqlQuery,
      [
        app_description,
        app_Rnumber,
        app_startDate,
        app_endDate,
        app_permit_toDoList,
        app_permit_doing,
        app_permit_done,
        app_permit_createTask,
        app_color,
        app_acronym,
      ],
      (err, result) => {
        if (err) {
          console.log("err", err);
          return reject(err);
        } else {
          console.log("Update application success");
          return resolve(true);
        }
      }
    );
  });
}

function CreateNewPlan(
  Plan_App_Acronym,
  Plan_MVP_name,
  Plan_startDate,
  Plan_endDate,
  Plan_description
) {
  Plan_startDate = moment(Plan_startDate).format("YYYY-MM-DD");
  Plan_endDate = moment(Plan_endDate).format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO plan (Plan_App_Acronym, Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_description) 
      VALUES ( ?, ?, ?, ?, ?)`;
    connection.query(
      sqlQuery,
      [
        Plan_App_Acronym,
        Plan_MVP_name,
        Plan_startDate,
        Plan_endDate,
        Plan_description,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          console.log("create plan success");
          return resolve(true);
        }
      }
    );
  });
}

function CreateNewGroup(group_name, group_color) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO groups_table (group_name, group_color) 
      VALUES (?, ?);`;
    connection.query(sqlQuery, [group_name, group_color], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}

function CreateNewTask(
  Task_App_Acronym,
  Task_plan,
  Task_id,
  Task_name,
  Task_description,
  notes,
  Task_state,
  Task_creator,
  Task_owner,
  Task_createDate
) {
  Task_createDate = moment(Task_createDate).format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO task (Task_App_Acronym, Task_plan, Task_id, Task_name, Task_description, Task_notes, Task_state, Task_creator, Task_owner, Task_createDate) 
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(
      sqlQuery,
      [
        Task_App_Acronym,
        Task_plan,
        Task_id,
        Task_name,
        Task_description,
        JSON.stringify(notes),
        Task_state,
        Task_creator,
        Task_owner,
        Task_createDate,
      ],
      (err, result) => {
        if (err) {
          console.log(">>", err);
          return resolve(false);
        } else {
          console.log("create task success");
          return resolve(true);
        }
      }
    );
  });
}

function FetchAppDetails(AppAcronym) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT
    *
    FROM application, app_team_assignment 
    WHERE app_team_assignment.App_Acronym = application.App_Acronym AND application.App_Acronym = ?`;
    connection.query(sqlQuery, [AppAcronym], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        result.map((e) => {
          e.App_permit_Doing = JSON.parse(e.App_permit_Doing);
          e.App_permit_toDoList = JSON.parse(e.App_permit_toDoList);
          e.App_permit_Done = JSON.parse(e.App_permit_Done);
          e.App_permit_createTask = JSON.parse(e.App_permit_createTask);
          e.group_team_assignment = JSON.parse(e.group_team_assignment);
        });
        // console.log("fetch assignedgroup success", result);
        // console.log("result", result)

        return resolve(result);
      }
    });
  });
}

function FetchGroupTeamAssignment(groupName) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT group_team_assignment, App_Acronym from app_team_assignment`;
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        // console.log("test success", result);
        result.map((e) => {
          e.group_team_assignment = JSON.parse(e.group_team_assignment);
        });
        return resolve(result);
      }
    });
  });
}

function AddAppTeamAssignment(App_Acronym, group_team_assignment) {
  const sqlQuery = `INSERT INTO app_team_assignment (App_Acronym, group_team_assignment) VALUES(?,?);`;
  group_team_assignment = JSON.stringify(group_team_assignment);

  return new Promise((resolve, reject) => {
    connection.query(
      sqlQuery,
      [App_Acronym, group_team_assignment],
      (err, result) => {
        if (err) {
          console.log(">>", err);
          return reject(err);
        } else {
          console.log("Add app team assignment success", result);
          return resolve(result);
        }
      }
    );
  });
}

function UpdateAppTeamAssignment(App_Acronym, group_team_assignment) {
  group_team_assignment = JSON.stringify(group_team_assignment);
  const sqlQuery = `UPDATE app_team_assignment SET 
  group_team_assignment = ? 
  WHERE App_Acronym = ?;`;

  return new Promise((resolve, reject) => {
    connection.query(
      sqlQuery,
      [group_team_assignment, App_Acronym],
      (err, result) => {
        if (err) {
          console.log(">>", err);
          return reject(err);
        } else {
          // console.log("Add app team assignment success", result);
          return resolve(result);
        }
      }
    );
  });
}

function FetchGroupTeamOnApp(App_Acronym) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT group_team_assignment from app_team_assignment WHERE App_Acronym = ?;`;
    connection.query(sqlQuery, [App_Acronym], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        // console.log("test success", result);
        result.map((e) => {
          e.group_team_assignment = JSON.parse(e.group_team_assignment);
        });
        return resolve(result[0]);
      }
    });
  });
}

function FetchGroupColor(group_name) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT group_color from groups_table WHERE group_name = ?;`;
    connection.query(sqlQuery, [group_name], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
}

function FetchSingleTask(task_id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT * FROM task WHERE Task_id = ?`;
    connection.query(sqlQuery, [task_id], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        result.map((e) => {
          e.Task_notes = JSON.parse(e.Task_notes);
        });
        return resolve(result);
      }
    });
  });
}

function FetchTaskNotes(task_id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT Task_notes FROM task WHERE Task_id = ?`;
    connection.query(sqlQuery, [task_id], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        result.map((e) => {
          e.Task_notes = JSON.parse(e.Task_notes);
        });
        return resolve(result[0]);
      }
    });
  });
}

function AddTaskNotes(newTaskNotes, task_id) {
  const jsonNewTaskNotes = JSON.stringify(newTaskNotes);
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE task SET Task_notes = ? WHERE Task_id = ?`;
    connection.query(sqlQuery, [jsonNewTaskNotes, task_id], (err, result) => {
      if (err) {
        console.log(">>", err);
        return resolve(false);
      } else {
        return resolve(true);
      }
    });
  });
}

function FetchRnumber(app_acronym) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT App_Rnumber FROM application WHERE App_Acronym = ?`;
    connection.query(sqlQuery, [app_acronym], (err, result) => {
      if (err) {
        console.log(">>", err);
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
}

function UpdateRnumber(app_acronym, Rnumber) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE application SET 
    App_Rnumber = ? 
    WHERE App_Acronym = ?;`;
    connection.query(sqlQuery, [Rnumber, app_acronym], (err, result) => {
      if (err) {
        console.log(">>", err);
        return resolve(false);
      } else {
        return resolve(true);
      }
    });
  });
}

function UpdateTask(task_id, taskState, taskOwner) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE task SET 
    Task_owner = ? ,
    Task_state = ?
    WHERE Task_id = ?;`;
    connection.query(
      sqlQuery,
      [taskOwner, taskState, task_id],
      (err, result) => {
        if (err) {
          console.log(">>", err);
          return resolve(false);
        } else {
          return resolve(true);
        }
      }
    );
  });
}
function FetchGroupName(username) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT group_name FROM group_teams_assignment WHERE username = ?`;
    connection.query(
      sqlQuery,
      [username],
      (err, result) => {
        if (err) {
          console.log(">>", err);
          return resolve(false);
        } else {
          return resolve(result);
        }
      }
    );
  });
}

module.exports = {
  FetchAllPlan,
  FetchAllApp,
  FetchTask,
  FetchAllTask,
  CreateNewApp,
  CreateNewPlan,
  CreateNewTask,
  FetchAppDetails,
  FetchGroupTeamAssignment,
  AddAppTeamAssignment,
  UpdateAppTeamAssignment,
  FetchApp,
  UpdateApp,
  FetchGroupTeamOnApp,
  FetchSingleTask,
  FetchTaskNotes,
  AddTaskNotes,
  FetchRnumber,
  UpdateRnumber,
  UpdateTask,
  CreateNewGroup,
  FetchGroupColor,
  FetchPlanApp,
  FetchTasksInState,
  FetchGroupName,
};
