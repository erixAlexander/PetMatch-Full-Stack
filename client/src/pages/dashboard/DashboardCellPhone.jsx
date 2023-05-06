import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DashboardMain from "../../components/cellphone/dashboard/DashboardMain";
import Activities from "../../components/cellphone/activities/Activities";
import Loading from "../../components/loading/Loading";
import Chat from "../../components/cellphone/chat/Chat";
import DashboardHeader from "../../components/cellphone/dashboard/DashboardHeader";
import "./dashboard-cellphone.css";
import DashboardFooter from "../../components/cellphone/dashboard/DashboardFooter";

const DashboardCellPhone = ({
  userId,
  loading,
  user,
  getUser,
  Image,
  setLoading,
  getGenderedUsers,
  genderedUsers,
  updateMatches,
}) => {
  const [main, setMain] = useState(true);
  const [messages, setMessages] = useState(false);
  const [activities, setActivities] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getUser(userId);
  }, []);

  return (
    <>
      {user && !loading ? (
        <>
          <div className="small-dashboard-main-container">
            <div className="background"></div>

            <DashboardHeader user={user} Image={Image} />

            <div className="small-dashboard-body">
              {main && (
                <DashboardMain
                  user={user}
                  userId={userId}
                  Loading={loading}
                  setLoading={setLoading}
                  getGenderedUsers={getGenderedUsers}
                  genderedUsers={genderedUsers}
                  updateMatches={updateMatches}
                />
              )}
              {messages && user && <Chat user={user} />}

              {activities && (
                <Activities
                  genderedUsers={genderedUsers}
                  userId={userId}
                  updateMatches={updateMatches}
                />
              )}
            </div>

            <DashboardFooter
              setActivities={setActivities}
              setMain={setMain}
              setMessages={setMessages}
            />
          </div>
        </>
      ) : (
        <div className="loading-icon">
          <Loading type={"spin"} color={"#C6C9CA"} />
        </div>
      )}
    </>
  );
};

export default DashboardCellPhone;
