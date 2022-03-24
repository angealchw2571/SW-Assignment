import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement";
import EditPassword from "./components/EditPassword";
import UpdateProfile from "./components/UpdateProfile";
import User from "./components/User";
import NewUser from "./components/NewUser";
import Error from "./components/Error";
import Status from "./components/Status";
import NavBar from "./components/NavBar";
import { userSessionAtom } from './components/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import ResetPassword from "./components/ResetPassword";
import RoleChange from "./components/RoleChange";
import Authentication from "./components/Authentication";

function App() {
  const sessionData = useAtom(userSessionAtom)[0];
  // console.log("sessionData", sessionData);

  const isAuthorised = () => {
    if (sessionData.role_name === "admin") {
      return true;
    } else return false;
  };

  const isLogged = () => {
    if (sessionData.username === undefined) {
      return false;
    } else return true;
  };
  const auth = isAuthorised();
  const logged = isLogged()
  
  function PrivateRoute({ children }) {
    if (logged) {
      return auth ? children : <Navigate to="/auth" />;
    } else {
      return <Navigate to="/error" />;
    }
  }

function HomeRoute({children}){
  return logged ? children : <Navigate to= '/error'/>
}
  
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/login" />} />
          <Route exact path="/login" element={<LoginPage />} />
					<Route exact path="/home" element={<HomeRoute><Home/></HomeRoute>} />
          <Route exact path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route exact path="/user/:id" element={<PrivateRoute><User/></PrivateRoute>} />
					<Route exact path="/profile/edit/pass/:id" element={<HomeRoute><EditPassword /></HomeRoute>} />
          <Route exact path="/profile/edit/:id/" element={<HomeRoute><UpdateProfile /></HomeRoute>} />
          <Route exact path="/profile/edit/status/:id" element={<PrivateRoute><Status /></PrivateRoute>} />
          <Route exact path="/profile/edit/role/:id" element={<PrivateRoute><RoleChange /></PrivateRoute>} />
          <Route exact path="/profile/edit/reset/:id" element={<PrivateRoute><ResetPassword /></PrivateRoute>} />
          <Route exact path="/new" element={<NewUser />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
