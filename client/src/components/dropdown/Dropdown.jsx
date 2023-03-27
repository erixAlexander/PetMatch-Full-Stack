import { useState } from "react";
import { faXmark, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Dropdown.css"

function Dropdown({ items = [], multiSelect = false, handleChange, user }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);

  function handleOnClick(e, item) {
    handleChange(e)

    if (!selection.some((current) => current === item)) {
      if (!multiSelect) {
        setSelection([item]);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (current) => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);
    }
    
    toggle()
  }

  function isItemInSelection(item) {
    if (selection.some((current) => current === item)) {
      return true;
    }
    return false;
  }

  return (
    <div className="onboarding-dropdown-maindiv" >
      <div
        tabIndex={0}
        className="onboarding-dropdown-div"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div>
          <p>{selection.length ? selection[0] : user?.type_of_pet ? user?.type_of_pet : "Please select:" }</p>
        </div>
        <div>
          <p>{open ? <FontAwesomeIcon style={{fontSize:"18px"}} icon={faXmark} /> : <FontAwesomeIcon style={{fontSize:"18px"}} icon={faSortDown} />}</p>
        </div>
      </div>
      {open && (
        <ul className="dropdown-list">
          {items.map((item, index) => (
            <li className="dd-list-item" key={index}>
              <button className="dropdown-option-button" name="type_of_pet" value={item} type="button" onClick={(e) => handleOnClick(e, item)}>
                <span>{item}</span>
                <span>{isItemInSelection(item) && "Selected"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
