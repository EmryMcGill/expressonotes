// package imports
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
// page imports
import Login from "./pages/login";
import Signup from "./pages/signup";
import Landing from "./pages/Landing";
import Home from "./pages/Home";

import { usePocket } from "./pb/PbContext";

function App() {

  // hooks
  const { user } = usePocket();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={user ? <Navigate to='/app' /> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to='/app' /> : <Signup />} />
        <Route path='/app' element={user ? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </Router>
  )
}

export default App
