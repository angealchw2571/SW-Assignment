import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement";
import Password from "./components/Password";
import Email from "./components/Email";
import User from "./components/User";
import NewUser from "./components/NewUser";
import Error from "./components/Error";
import Status from "./components/Status";
import LogoutNavBar from "./components/LogoutNavBar";
import { userSessionAtom } from './components/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import ResetPassword from "./components/ResetPassword";

function App() {
  const sessionData = useAtom(userSessionAtom)[0];

  const isAuthenticated = () => {
    if (sessionData.username === undefined) {
      return false;
    } else return true;
  };

  function PrivateRoute({ children }) {
    const auth = isAuthenticated();
    return auth ? children : <Navigate to="/error" />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <LogoutNavBar />
        <Routes>
        {/* <Redirect from="/" to="/home" /> */}
        <Route exact path="/" element={<Navigate replace to="/login" />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route exact path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route exact path="/user/:id" element={<PrivateRoute><User /></PrivateRoute>} />
          <Route exact path="/profile/edit/pass/:id" element={<PrivateRoute><Password /></PrivateRoute>} />
          <Route exact path="/profile/edit/email/:id/" element={<PrivateRoute><Email /></PrivateRoute>} />
          <Route exact path="/profile/edit/status/:id" element={<PrivateRoute><Status /></PrivateRoute>} />
          <Route exact path="/new" element={<PrivateRoute><NewUser /></PrivateRoute>} />
          <Route path="/error" element={<Error />} />
          <Route exact path="/profile/edit/reset/:id" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
