import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement/UserManagement";
import EditPassword from "./components/UserManagement/EditPassword";
import UpdateProfile from "./components/UserManagement/UpdateProfile";
import User from "./components/UserManagement/User";
import NewUser from "./components/UserManagement/NewUser";
import NewRole from "./components/UserManagement/NewRole";
import Error from "./components/Error";
import Status from "./components/UserManagement/Status";
import NavBar from "./components/NavBar";
import { userSessionAtom } from './components/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import ResetPassword from "./components/UserManagement/ResetPassword";
import UpdatePermissions from "./components/UserManagement/UpdatePermissions";
import Authentication from "./components/Authentication";
import AppHome from "./components/AppManagement/views/AppHome";
import IndividualApp from "./components/AppManagement/views/IndividualApp";
import CreateApp from "./components/AppManagement/CreateApp";
import Test from "./components/AppManagement/views/Test";

function App() {
  const sessionData = useAtom(userSessionAtom)[0];

  const isAuthorised = () => {
    if (sessionData.role_groups === undefined) {
      return false;
    } else if (sessionData.role_groups.includes("Admin")){
      return true
    };
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
          <Route exact path="/profile/edit/role/:id" element={<PrivateRoute><UpdatePermissions /></PrivateRoute>} />
          <Route exact path="/profile/edit/reset/:id" element={<PrivateRoute><ResetPassword /></PrivateRoute>} />
          <Route exact path="/new" element={<PrivateRoute><NewUser/></PrivateRoute>} />
          <Route exact path="/newrole" element={<PrivateRoute><NewRole /></PrivateRoute>} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/error" element={<Error />} />
          {/* <Route path="/createtask" element={<CreateTask />} /> */}
          <Route path="/app/home" element={<AppHome />} />
          <Route path="/appcreate" element={<CreateApp />} />
          <Route path="/app/edit/:appAcronym" element={<Test />} />
          <Route path="/app/:appAcronym" element={<IndividualApp />} />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
