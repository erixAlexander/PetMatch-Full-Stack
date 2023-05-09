import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>
      {auth?.accessToken ? (
        <Outlet />
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "25px",
          }}
        >
          <h3>You are Logged Out!</h3>
          <button
            style={{ padding: "10px" }}
            onClick={() => window.location.replace("/")}
          >
            Go Back Home
          </button>
        </div>
      )}
    </>
  );
};

export default PersistLogin;
