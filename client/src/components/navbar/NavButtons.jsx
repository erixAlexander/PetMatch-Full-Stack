const NavButtons = ({
  firstButtonClick,
  secondButtonClick,
  isDisabled,
  firstText,
  secondText,
}) => {
  return (
    <div className="nav-button-container">
      <button
        className="nav-login-button"
        onClick={firstButtonClick}
        disabled={isDisabled}
      >
        {firstText}
      </button>
      <button
        className="nav-signup-button"
        onClick={secondButtonClick}
        disabled={isDisabled}
      >
        {secondText}
      </button>
    </div>
  );
};

export default NavButtons;
