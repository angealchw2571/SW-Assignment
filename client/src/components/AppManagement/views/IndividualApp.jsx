import { React, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import KanbanBoard from "../../TaskManagement/views/KanbanBoard";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";



function IndividualApp() {
  const { appAcronym } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [appData, setAppData] = useState();
  let navigate = useNavigate();

  console.log("params", appAcronym);
console.log("appData", appData)

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/app/tasks/${appAcronym}`);
        setnetworkStatus("loading");
        setAppData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [appAcronym]);


  const handleClick = ()=> {
    navigate(`/app/edit/${appAcronym}`);
  }

  return (
    <>
      <div>
        <h1>App {appAcronym}</h1>
        <Button
          sx={{
            bgcolor: "#ff8aae",
            color: "#f9f1f1",
            ":hover": {
              backgroundColor: "pink",
              color: "black",
            },
          }}
          onClick={handleClick}
        >
          <Typography>Edit App</Typography>
        </Button>
        <KanbanBoard />
      </div>
    </>
  );
}

export default IndividualApp;
