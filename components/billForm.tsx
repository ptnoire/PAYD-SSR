import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../src/pages/index.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { api } from "~/utils/api";

export const BillFormSchema = z.object({
  billName: z.string(),
  billDueAmt: z.number().positive(),
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
    onSuccess: async () => {
      setBillName("");
      setBillDueAmt("");
      setBillDueDate("");
      setIsRecurring(false);
      await ctx.bills.getUserBills.invalidate();
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;
      if (errMsg && errMsg[0]) {
        toast.error(errMsg[0]);
      } else {
        toast.error(
          "Failed to post, please check that all fields are correct!"
        );
      }
    },
  });
  const cancelBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const form = document.querySelector(".formInput");
    if (!form) return;
    form.classList.add("hidden");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      mutate(
        BillFormSchema.parse({
          billName,
          billDueAmt: parseFloat(billDueAmt),
          billDueDate,
          isRecurring,
        })
      );

      const form = document.querySelector(".formInput");
      if (!form) return;
      form.classList.add("hidden");
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        const errMsg = e.errors[0]?.message;
        if (errMsg) {
          toast.error(errMsg);
        }
      } else {
        toast.error(
          "Failed to post, please check that all fields are filled out!"
        );
      }
    }
  };

  return (
    <div className="formInput hidden">
      <div className={`${styles.form_title}`}>
        <h2>{props.title ? props.title : "Submit New Bill"}</h2>
      </div>
      <div className={`${styles.form_inputs}`}>
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
          />
          <input
            className="text__field dateBox"
            id="date"
            name="dueDate"
            type="date"
            value={billDueDate}
            disabled={isPosting}
            onChange={(e) => setBillDueDate(e.target.value)}
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
          <div className={styles.form_btns}>
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
