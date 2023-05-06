import ReactLoading from "react-loading";

const Loading = ({ type, color, height1, width1 }) => (
  <ReactLoading
    type={type}
    color={color}
    height={height1 || "15%"}
    width={width1 || "15%"}
  />
);

export default Loading;
