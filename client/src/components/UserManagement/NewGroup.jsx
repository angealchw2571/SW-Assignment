import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


function NewGroup() {

  let navigate = useNavigate();

    const handleQuery = async (data) => {
        await axios
          .post(`/api/app/creategroup`, data)
          .then((res) => {
            if (res) {
              alert(res.data.message);
              navigate("/users");
            }
          })
          .catch(function (error) {
            alert(error);
            console.log(error);
          });
      };

    const handleSubmit  = (event) => {
        event.preventDefault();
        const group_name  = event.target.group_name.value
        handleQuery({group_name: group_name})
    }



  return (
    <>
    <h1> Create New Group</h1>
      <label>Group Name</label>
      <br />
      <form onSubmit= {handleSubmit}>
        <input name="group_name" placeholder="Group name" /> <p />
        <button>Create New Group</button>
      </form>
      <p />
      <Link to="/users">
        <button>Back</button>
      </Link>
    </>
  )
}

export default NewGroup