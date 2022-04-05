import { React, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";

function UpdateProfile() {
  let navigate = useNavigate();
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const { id } = useParams();

  const handleQuery = async (data) => {
    
    await axios
      .put(`/api/user/edit/profile/${id}`, data)
      .then((res) => {
        if (res) {
          alert(res.data.message);
          navigate(`/home`);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value
    const age = event.target.age.value
    const currentEmail = event.target.newEmail2.value;
    if (currentEmail.length === 0 || name.length === 0 || age.length === 0 ) {
      alert("Please do not leave empty fields.");
    } else if (newEmail1 === newEmail2) {
      handleQuery({name: name, age:age, email: newEmail2 });
    } else {
      alert("Please check your email again");
    }
  };

  const handleEmail1 = (event) => {
    setNewEmail1(event.target.value);
  };
  const handleEmail2 = (event) => {
    setNewEmail2(event.target.value);
  };

  return (
    <>
      <h1>Update Profile Details</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <br />
          <input name="name" placeholder="Name" />
          <br />
          <label>Age</label>
          <br />
          <input name="age" placeholder="Age" type="number" min="1" max="100" />
          <p />
          <div style={{display: 'flex'}}>
            <div >
              <label>Email</label>
              <br />
              <input
                name="newEmail1"
                placeholder="New Email"
                onChange={handleEmail1}
              />
              <br />
            </div>
            <div>
              <label>Reconfirm Email</label>
              <br />
              <input
                name="newEmail2"
                placeholder="Reconfirm Email"
                onChange={handleEmail2}
              />
            </div>
          </div>
          <br />
          <button>Submit</button>
        </form>
      </div>
      <p />
      <Link to={`/home`}>
        <button>Back</button>
      </Link>
    </>
  );
}

export default UpdateProfile;
