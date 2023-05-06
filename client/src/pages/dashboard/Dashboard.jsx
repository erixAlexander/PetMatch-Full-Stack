import { useState, useEffect } from "react";
import DashboardDesktop from "./DashboardDesktop";
import DashboardCellPhone from "./DashboardCellPhone";
import useWindowSize from "../../hooks/useWindowSize";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Image } from "cloudinary-react";

const Dashboard = () => {
  const size = useWindowSize();
  const [screenSize, setScreenSize] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [genderedUsers, setGenderedUsers] = useState([]);
  const [cookies] = useCookies("");
  const axiosPrivate = useAxiosPrivate();
  const userId = cookies.userId;

  const getUser = async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/user`,
        {
          params: { userId },
        }
      );
      setUser(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/gendered-users`,
        {
          params: { gender: user?.gender_interest, type: user?.type_of_pet },
        }
      );
      setGenderedUsers(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateMatches = async (userId, matchedUserId) => {
    try {
      await axiosPrivate.put(`${process.env.REACT_APP_URL}/addmatch`, {
        userId,
        matchedUserId,
        timestamp: new Date().toISOString(),
      });
      getUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setScreenSize(size.width);
  }, [size]);

  return (
    <>
      {screenSize > 765 ? (
        <DashboardDesktop
          userId={userId}
          loading={loading}
          user={user}
          getUser={getUser}
          genderedUsers={genderedUsers}
          getGenderedUsers={getGenderedUsers}
          updateMatches={updateMatches}
        />
      ) : (
        <DashboardCellPhone
          userId={userId}
          setLoading={setLoading}
          loading={loading}
          user={user}
          getUser={getUser}
          Image={Image}
          genderedUsers={genderedUsers}
          getGenderedUsers={getGenderedUsers}
          updateMatches={updateMatches}
        />
      )}
    </>
  );
};

export default Dashboard;
