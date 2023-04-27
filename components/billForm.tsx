import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { BillFormSchema } from "~/helpers/exportTypes";
import { api } from "~/utils/api";

export function BillForm() {
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
      toast.success("Bill Successfully Created!", { id: "loading" });
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedDate = new Date(billDueDate);
    const isoDateString = parsedDate.toISOString();
    try {
      toast.loading("Creating...", { id: "loading" });
      mutate(
        BillFormSchema.parse({
          billName,
          billDueAmt: parseFloat(billDueAmt),
          billDueDate: isoDateString,
          isRecurring,
        })
      );
      const form = document.querySelector(".formInput");
      form?.classList.add("hidden");
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

  const cancelBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const form = document.querySelector(".formInput");
    if (!form) return;
    form.classList.add("hidden");
  };

  return (
    <div className="formInput hidden">
      <div className="form_title form_style">
        <h2>Create New Bill</h2>
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
            onChange={(e) => {
              setBillName(e.target.value);
            }}
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
          />
          <input
            className="text__field dateBox"
            id="date"
            name="dueDate"
            type="date"
            value={billDueDate}
            onChange={(e) => setBillDueDate(e.target.value)}
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
          <div className="form_btns">
            <button onClick={(e) => cancelBtn(e)} className="cancel_btn">
              <FontAwesomeIcon icon={faCancel} className="fa-icon" />
            </button>
            <button type="submit">
              <FontAwesomeIcon icon={faCheck} className="fa-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
