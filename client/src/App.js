import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import OnBoarding from "./pages/onboarding/Onboarding";
import Profile from "./pages/profile/Profile";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import PersistLogin from "./components/PersistLogin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PersistLogin />}>
        {<Route path="/dashboard" element={<Dashboard />} />}
        {<Route path="/onboarding" element={<OnBoarding />} />}
        {<Route path="/profile" element={<Profile />} />}
      </Route>
    </Routes>
  );
};

export default App;
