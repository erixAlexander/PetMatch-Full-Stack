import DashboardWideScreen from "./DashboardWideScreen";
import useWindowSize from "../../hooks/useWindowSize";
import { useState, useEffect } from "react";
import DashboardSmallScreen from "./DashboardSmallScreen";

const Dashboard = () => {
  const size = useWindowSize();
  const [screenSize, setScreenSize] = useState();

  useEffect(() => {
    setScreenSize(size.width);
  }, [size]);

  return (
    <>{screenSize > 765 ? <DashboardWideScreen /> : <DashboardSmallScreen />}</>
  );
};

export default Dashboard;
