import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

export const BillFormSchema = z.object({
  billName: z.string(),
  billDueAmt: z.number(),
  billDueDate: z.string(),
  isRecurring: z.boolean(),
});

export function BillForm(props: { title?: string }) {
  const [billName, setBillName] = useState("");
  const [billDueAmt, setBillDueAmt] = useState("");
  const [billDueDate, setBillDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.bills.create.useMutation({
    onSuccess: () => {
      setBillName("");
      setBillDueAmt("");
      setBillDueDate("");
      setIsRecurring(false);
      ctx.bills.getAll.invalidate();
    },
  });
  const cancelBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Cancel submitting
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      BillFormSchema.parse({
        billName,
        billDueAmt: parseFloat(billDueAmt),
        billDueDate,
        isRecurring,
      })
    );
  };

  return (
    <div className="formInput">
      <div className="form_title form_style">
        <h2>{props.title ? props.title : "Submit New Bill"}</h2>
      </div>
      <div className="form_inputs form_style">
        <form onSubmit={(event) => handleSubmit(event)} id="billForm">
          <input
            className="text__field"
            id="title"
            name="title"
            type="text"
            placeholder="Insert Bill Name Here"
            value={billName}
            disabled={isPosting}
            onChange={(e) => setBillName(e.target.value)}
            required
          />
          <input
            className="text__field"
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="Insert Cost of Bill Here"
            value={billDueAmt}
            disabled={isPosting}
            onChange={(e) => setBillDueAmt(e.target.value)}
            required
          />
          <input
            className="text__field dateBox"
            id="date"
            name="dueDate"
            type="date"
            value={billDueDate}
            disabled={isPosting}
            onChange={(e) => setBillDueDate(e.target.value)}
            required
          />
          <br />
          <label>
            <input
              id="reoccuring"
              name="reoccuring"
              type="checkbox"
              checked={isRecurring}
              disabled={isPosting}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <span>Monthly?</span>
          </label>
          <div className="form_btns">
            <button onClick={(e) => cancelBtn(e)} className="cancel_btn">
              <FontAwesomeIcon icon={faCancel} className="fa-icon" />
            </button>
            <button type="submit" disabled={isPosting}>
              <FontAwesomeIcon icon={faCheck} className="fa-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
