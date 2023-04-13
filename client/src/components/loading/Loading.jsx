import React from "react";
import ReactLoading from "react-loading";
import "../chat/Chat.css";

const Loading = ({ type, color }) => (
  <ReactLoading type={type} color={color} height={"15%"} width={"15%"} />
);

export default Loading;
