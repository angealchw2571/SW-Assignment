import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function NewRole() {
    let navigate = useNavigate();

    const handleQuery = async (data) => {
        await axios
          .post(`/api/user/newrole`, data)
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
        const role_name  = event.target.role_name.value
        const role_description  = event.target.role_description.value
        handleQuery({role_name: role_name, role_description: role_description})
    }
  return (
    <>
      <h1>Create New Role</h1>
      <label>Role Name</label>
      <br />
      <form onSubmit= {handleSubmit}>
        <input name="role_name" placeholder="Role Name" /> <p />
      <label>Role Description</label><br/>
        <input name="role_description" placeholder="Role Description" /> <br />
        <p />
        <button>Create New Role</button>
      </form>

      <p />
      <Link to="/users">
        <button>Back</button>
      </Link>
    </>
  );
}

export default NewRole;
