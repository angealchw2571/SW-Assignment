import LoginPage from './components/LoginPage'
import Home from './components/Home'
import Users from './components/Users'
import Password from './components/Password'
import Email from './components/Email'
import User from './components/User'
import NewUser from './components/NewUser'
// import { Navigate } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from "react-router"



function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Routes>
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/users" element={<Users />} />
      <Route exact path="/profile/edit/:id" element={<Password />} />
      <Route exact path="/profile/edit/email/:id/" element={<Email />} />
      <Route exact path="/user/:id" element={<User />} />
      <Route exact path="/new" element={<NewUser />} />
    </Routes>
    </div>
    </BrowserRouter>


  );
}

export default App;
