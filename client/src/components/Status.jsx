import { React } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function Status() {
  const { id } = useParams();
  let navigate = useNavigate();

  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/status/${id}`, data)
      .then((res) => {
        if (res) {
          alert(res.data.message);
          navigate("/users");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newStatus = event.target.status.value;
    handleQuery({ status: newStatus });
  };

  return (
    <>
      <h1>Change Status</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Status:
          <select name="status" defaultValue="">
            <option value="" hidden="hidden">
              Select
            </option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </label>
        <p />
        <button>Submit</button>
      </form>
      <p/>
      <Link to={`/user/${id}`}>
        <button>Back</button>
      </Link>
    </>
  );
}

export default Status;
