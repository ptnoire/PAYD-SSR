import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";

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
      // Reset Inputs
      // setBillName("")
      // setBillDueAmt("")
      ctx.bills.getAll.invalidate();
    },
  });

  const handleSubmit = async () =>
    mutate(
      BillFormSchema.parse({
        billName,
        billDueAmt: parseFloat(billDueAmt),
        billDueDate,
        isRecurring,
      })
    );

  return (
    <div className="formInput">
      <div className="form_title form_style">
        <h2>{props.title ? props.title : "Submit New Bill"}</h2>
      </div>
      <form onSubmit={handleSubmit} className="upload" id="upload">
        <div className="form_inputs form_style">
          <input
            className="text__field"
            id="title"
            name="title"
            type="text"
            placeholder="Insert Bill Name Here"
            value={billName}
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
            onChange={(e) => setBillDueAmt(e.target.value)}
            required
          />
          <input
            className="text__field dateBox"
            id="date"
            name="dueDate"
            type="date"
            value={billDueDate}
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
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <span>Monthly?</span>
          </label>
        </div>
        <div className="form_btns form_style">
          <button className="cancel_btn">
            <FontAwesomeIcon icon={faCancel} className="fa-icon" />
          </button>
          <button className="btn--submit">
            <FontAwesomeIcon icon={faCheck} className="fa-icon" />
          </button>
        </div>
      </form>
    </div>
  );
}
