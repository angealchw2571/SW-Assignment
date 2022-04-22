import { React } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "../LoginPage";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

function TaskNoteForm({
  taskData,
  setModalOpen,
  handleModalCloseViewTask,
  handleRefresh,
}) {
  const [sessionData, setSessionData] = useAtom(userSessionAtom);

  const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#ff8aae",
      border: "5px",
      borderRadius: `4px 0 0 4px`,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "pink",
        borderWidth: "2px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff8aae",
      },
    },
  });

  const handleQuery = async (data) => {
    await axios
      .post(`/api/app/tasknote/${taskData.Task_id}`, data)
      .then((res) => {
        if (res) {
          toast.success(res.data.message, { autoClose: 5000 });
          setTimeout(() => {
            setModalOpen(false);
            handleModalCloseViewTask();
            handleRefresh("ALL");
          }, 2000);
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const noteMessage = event.target.noteMessage.value;
    const data = {
      userID: sessionData.username,
      currentState: taskData.Task_state,
      dateTime: new Date(),
      note: noteMessage,
    };
    handleQuery(data);
  };

  return (
    <>
      <h1>Add new note</h1>
      <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              name="noteMessage"
              required
              fullWidth
              id="note"
              label="Message"
              autoFocus
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: "pink",
            color: "black",
            ":hover": {
              backgroundColor: "#ff8aae",
              color: "#f9f1f1",
            },
          }}
        >
          Add note
        </Button>
      </Box>
    </>
  );
}

export default TaskNoteForm;
