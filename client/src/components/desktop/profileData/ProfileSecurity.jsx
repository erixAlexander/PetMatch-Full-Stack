import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ProfileSecurity = ({ user }) => {
  const USER_REGEX = /.+@.+\.[A-Za-z]{1,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [error, setError] = useState(null);

  const [showSecurityEmail, setShowSecurityEmail] = useState(false);
  const [showSecurityPwd, setShowSecurityPwd] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies("user");
  const userId = cookies.userId;

  let navigate = useNavigate();

  useEffect(() => {
    setValidEmail(USER_REGEX.test(email));
    setError("");
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setError("");
  }, [password]);

  const handleSubmit = async (e) => {
    try {
      if (e.target.name === "email" && !validEmail) {
        setError("You need to enter a valid Email address");
        return;
      }
      if (e.target.name === "pwd" && !validPassword) {
        setError(`Password must be 8 to 24 characters long.
            Must include uppercase and lowercase letters, a number and a special character .!@#$%`);
        return;
      }
      let value;
      let name;
      if (e.target.name === "email") {
        value = email;
        name = "email";
      } else if (e.target.name === "pwd") {
        value = password;
        name = "pwd";
      } else {
        return;
      }
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/security-credentials`,
        { value, userId, name }
      );

      const success = response.status === 201 || 200;
      success && name === "pwd" && window.location.reload();
      if (success && name === "email") {
        await axiosPrivate.get(`${process.env.REACT_APP_URL}/logout`, {
          withCredentials: true,
        });
        removeCookie("userId", cookies.userId);
        removeCookie("authToken", cookies.authToken);
        navigate("/");
      }
    } catch (error) {
      setError(error.response);
    }
  };

  return (
    <div className="main-security-container">
      <h1>Security</h1>
      <hr className="security-hr-sidebar" />
      <form className="profile-security-form">
        <div className="profile-security-container">
          <h2>Current Email</h2>
          <p style={{ marginTop: "-10px" }}> {"Email: " + user?.email}</p>
          <button
            style={{ margin: "10px" }}
            onClick={(e) => {
              e.preventDefault();
              setShowSecurityEmail(!showSecurityEmail);
            }}
            className="primary-title-button"
          >
            Change my Email
          </button>
          {showSecurityEmail && (
            <>
              <h3 className="change-credentials-ptag">Change my email</h3>
              <hr className="security-hr-sidebar" />
              <div className="credentials-button-container">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "profile-valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hide" : "profile-invalid"}
                />
                <label htmlFor="email"></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="New Email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                />

                <button
                  name="email"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  className="primary-submit-button"
                >
                  Submit
                </button>
              </div>
              <p className={email && !validEmail ? "instructions" : "hide"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Please enter a valid Email
              </p>
            </>
          )}

          <button
            style={{ margin: "10px" }}
            onClick={(e) => {
              e.preventDefault();
              setShowSecurityPwd(!showSecurityPwd);
            }}
            className="primary-title-button"
          >
            Change my Password
          </button>
          {showSecurityPwd && (
            <>
              <h3 className="change-credentials-ptag">Change my password</h3>
              <hr className="security-hr-sidebar" />
              <div className="credentials-button-container">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPassword ? "profile-valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validPassword || !password ? "hide" : "profile-invalid"
                  }
                />
                <label htmlFor="password"></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  name="pwd"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  className="primary-submit-button"
                >
                  Submit
                </button>
              </div>
              <p
                className={password && !validPassword ? "instructions" : "hide"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Password must be 8 to 24 characters long. Must include uppercase
                and lowercase letters, a number and a special character .!@#$%
              </p>
              <p className="password-error">{error}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSecurity;
