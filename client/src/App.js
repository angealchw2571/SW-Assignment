import { useAtom } from "jotai";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement/UserManagement";
import EditPassword from "./components/UserManagement/EditPassword";
import UpdateProfile from "./components/UserManagement/UpdateProfile";
// import User from "./components/UserManagement/User";
// import NewUser from "./components/UserManagement/NewUser";
import NewRole from "./components/UserManagement/NewRole";
import Error from "./components/Error";
import Status from "./components/UserManagement/Status";
// import NavBar from "./components/NavBar";
import { userSessionAtom } from './components/LoginPage';
import { BrowserRouter, Navigate } from "react-router-dom";
import { Route, Routes } from "react-router";
import ResetPassword from "./components/UserManagement/ResetPassword";
import UpdatePermissions from "./components/UserManagement/UpdatePermissions";
import Authentication from "./components/Authentication";
import AppHome from "./components/AppManagement/views/AppHome";
import IndividualApp from "./components/AppManagement/views/IndividualApp";
import CreateApp from "./components/AppManagement/CreateApp";
import EditApp from "./components/AppManagement/views/EditApp";
import IndividualTask from "./components/TaskManagement/IndividualTask";
import NewTask from "./components/TaskManagement/NewTask";
import NewGroup from "./components/UserManagement/NewGroup";
import { ToastContainer } from "react-toastify";
import TestToast from "./components/TestToast"
import NavBarNew from "./components/NavBarNew"
import IndividualUser from "./components/UserManagement/IndividualUser";
import CreateNewUser from "./components/UserManagement/CreateNewUser"
import CreateNewRole from "./components/UserManagement/CreateNewRole";
import CreateNewGroup from "./components/UserManagement/CreateNewGroup";
import AdminBoard from "./components/UserManagement/AdminBoard";
import AppHomeNew from "./components/AppManagement/AppHomeNew";
import AppSwiper from "./components/AppManagement/AppSwiper"


function App() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [session, setSession] = useAtom(userSessionAtom);

  // console.log("session", session)

  const isAuthorised = () => {
    if (sessionData.role_groups === undefined) {
      return false;
    } else if (sessionData.role_groups.includes("Admin")){
      return true
    } 
  };

  const isLogged = () => {
    if (sessionData.username === undefined) {
      return false;
    } else return true;
  };
  const auth = isAuthorised();
  const logged = isLogged()
  
  function AdminRoute({ children }) {
    if (logged) {
      return auth ? children : <Navigate to="/auth" />;
    } else {
      return <Navigate to="/error" />;
    }
  }

function PrivateRoute({children}){
  return logged ? children : <Navigate to= '/error'/>
}
  


  return (
    <BrowserRouter>
      <div className="App">
        <NavBarNew />
        <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/login" />} />
          <Route exact path="/login" element={<LoginPage />} />
					<Route exact path="/home" element={<PrivateRoute><Home/></PrivateRoute>} />
          <Route exact path="/users" element={<AdminRoute><AdminBoard /></AdminRoute>} />
          <Route exact path="/user/:id" element={<PrivateRoute><IndividualUser/></PrivateRoute>} />
					<Route exact path="/profile/edit/pass/:id" element={<PrivateRoute><EditPassword /></PrivateRoute>} />
          <Route exact path="/profile/edit/:id/" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          <Route exact path="/profile/edit/status/:id" element={<AdminRoute><Status /></AdminRoute>} />
          <Route exact path="/profile/edit/role/:id" element={<AdminRoute><UpdatePermissions /></AdminRoute>} />
          <Route exact path="/profile/edit/reset/:id" element={<AdminRoute><ResetPassword /></AdminRoute>} />
          <Route exact path="/new" element={<AdminRoute><CreateNewUser/></AdminRoute>} />
          <Route exact path="/newrole" element={<AdminRoute><CreateNewRole /></AdminRoute>} />
          <Route exact path="/newgroup" element={<CreateNewGroup />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/error" element={<Error />} />
          <Route exact path="/test" element={<AppHomeNew />} />
          <Route exact path="/test2" element={<AppSwiper />} />
          <Route exact path="/app/newtask/:appAcronym" element={<PrivateRoute><NewTask /></PrivateRoute>} />
          <Route exact path="/app/home" element={<PrivateRoute><AppHomeNew /></PrivateRoute>} />
          <Route exact path="/appcreate" element={<PrivateRoute><CreateApp /></PrivateRoute>} />
          <Route exact path="/app/edit/:appAcronym" element={<PrivateRoute><EditApp /></PrivateRoute>} />
          <Route exact path="/app/:appAcronym" element={<PrivateRoute><IndividualApp /></PrivateRoute>} />
          <Route exact path="/apptask/:appAcronym/:taskID" element={<PrivateRoute><IndividualTask /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
