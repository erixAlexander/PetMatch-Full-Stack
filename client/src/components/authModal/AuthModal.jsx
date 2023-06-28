import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./authModal.css";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const USER_REGEX = /.+@.+\.[A-Za-z]{1,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

  const emailRef = useRef();
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [error, setError] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies("user");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(USER_REGEX.test(email));
    setError("");
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === confirmedPassword);
    setError("");
  }, [password, confirmedPassword]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!validPassword) {
        setError(`Password must be 8 to 24 characters long.
        Must include uppercase and lowercase letters, a number and a special character .!@#$%`);
        return;
      }
      if (!validEmail) {
        setError("You need to enter a valid Email address");
        return;
      }
      if (isSignUp && !validMatch) {
        setError("Passwords need to match");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL}/${isSignUp ? "signup" : "login"}`,
        { email, password },
        { withCredentials: true }
      );

      setCookie("userId", response.data.userId, {
        maxAge: 60 * 60 * 20,
      });

      const success = response.status === 201;
      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClose}>
        <FontAwesomeIcon className="x-mark" icon={faXmark} />
      </div>
      <h1>{isSignUp ? "Create an account" : "Log in"}</h1>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="email">
          <FontAwesomeIcon
            icon={faCheck}
            className={validEmail ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validEmail || !email ? "hide" : "invalid"}
          />
        </label>
        <input
          type="email"
          id="email"
          name="email"
          ref={emailRef}
          placeholder="email"
          autoComplete="off"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={email && !validEmail ? "instructions" : "hide"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Please enter a valid Email
        </p>
        <label htmlFor="password">
          <FontAwesomeIcon
            icon={faCheck}
            className={validPassword ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPassword || !password ? "hide" : "invalid"}
          />
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        {isSignUp && (
          <>
            <label htmlFor="password-check">
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && confirmedPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  validMatch || !confirmedPassword ? "hide" : "invalid"
                }
              />
            </label>
            <input
              type="password"
              id="password-check"
              name="password-check"
              placeholder="confirm password"
              required={true}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              autoComplete="off"
            />
          </>
        )}
        <p
          className={
            password && confirmedPassword && !validMatch
              ? "instructions"
              : "hide"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field.
        </p>

        <input className="secondary-button" type="submit" />
        <p className="password-error">{error}</p>
      </form>
      <hr />
      <h4 className="authmodal-get-app">App available soon</h4>
    </div>
  );
};

export default AuthModal;
