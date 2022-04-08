import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskNotes from "./TaskNotes"
const moment = require('moment');


function IndividualTask() {
  const { taskID } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [taskData, setTaskData] = useState();

const getData = async () => {
      try {
        const res = await axios.get(`/api/app/task/${taskID}`);
        setnetworkStatus("loading");
        setTaskData(res.data[0]);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
  useEffect(() => {
    getData();
  }, []);


  return (
    <>
      {networkStatus === "resolved" ? (
        <>
        <div>
            
          <h1>App {taskData.Task_App_Acronym}</h1>
          <div>Task Plan: {taskData.Task_plan}</div><br/>
          <div>Task ID: {taskData.Task_id}</div><br/>
          <div>Task Name: {taskData.Task_name}</div><br/>
          <div>Task Description: {taskData.Task_description}</div><br/>
          <div>Task State: {taskData.Task_state}</div><br/>
          <div>Task Creator: {taskData.Task_creator}</div><br/>
          <div>Task Owner: {taskData.Task_owner}</div><br/>
          <div>Task create date: {moment(taskData.Task_createDate).format("DD-MMM-YYYY")}</div><br/>
          <p/>
          </div>

          <TaskNotes taskData={taskData} getData={getData} />
        </>
      ) : null}
    </>
  );
}

export default IndividualTask;
