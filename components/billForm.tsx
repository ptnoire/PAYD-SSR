import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BillForm(props: { title?: String }) {
  return (
    <div className="formInput">
      <div className="form_title form_style">
        <h2>{props.title ? props.title : "Submit New Bill"}</h2>
      </div>
      <div className="form_inputs form_style">
        <form className="upload" id="upload">
          <input
            className="text__field"
            id="title"
            name="title"
            type="text"
            placeholder="Insert Bill Name Here"
            required
          />
          <input
            className="text__field"
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="Insert Cost of Bill Here"
            required
          />
          <input
            className="text__field dateBox"
            id="date"
            name="dueDate"
            type="date"
            required
          />
          <br />
          <label>
            <input id="reoccuring" name="reoccuring" type="checkbox" />
            <span>Monthly?</span>
          </label>
        </form>
      </div>
      <div className="form_btns form_style">
        <button className="cancel_btn">
          <FontAwesomeIcon icon={faCancel} className="fa-icon" />
        </button>
        <button className="btn--submit">
          <FontAwesomeIcon icon={faCheck} className="fa-icon" />
        </button>
      </div>
    </div>
  );
}
