import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
import { BillHistoryComponent } from "./history";
import { BillEditSchema, BillFormatingProps } from "~/helpers/exportTypes";
import { ModalRender } from "./modal";
import { z } from "zod";
import { useState } from "react";
dayjs.extend(relativeTime);

export function BillFormating({
  passFunctions,
  isEnabled,
  setIsEnabled,
  ...props
}: BillFormatingProps) {
  const [editbillName, setEditBillName] = useState("");
  const [editbillDueAmt, setEditBillDueAmt] = useState("");
  const [editbillDueDate, setEditBillDueDate] = useState("");
  const [editisRecurring, setEditIsRecurring] = useState(false);

  const dueDate = convertLocalDate(props.billDueDate);
  const { paydMutate, deleteMutate } = passFunctions;

  const paydFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (paydMutate) {
        setIsEnabled(false);
        paydMutate({ id: props.id });
        toast.loading("Processing...", { id: "loading" });
      }
    } catch (error) {
      setIsEnabled(true);
      toast.error("Failed to pay this bill! Uh Oh!");
    }
  };

  const historyDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!props.history) return;
    ModalRender(
      <BillHistoryComponent
        history={...props.history}
        title={props.billName}
        passFunctions={passFunctions}
      />
    );
  };

  const editBill = () => {
    toast.loading("Editting...", { id: "loading" });
    try {
      if (props.editMutate) {
        const parsedDate = new Date(editbillDueDate);
        const isoDateString = parsedDate.toISOString();
        props.editMutate(
          BillEditSchema.parse({
            id: props.id,
            billName: editbillName,
            billDueAmt: parseFloat(editbillDueAmt),
            billDueDate: isoDateString,
            isRecurring: editisRecurring,
          })
        );
      }
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        const errMsg = e.errors[0]?.message;
        if (errMsg) {
          toast.error(errMsg, { id: "loading" });
        }
      } else {
        toast.error(
          "Failed to post, please check that all fields are filled out!",
          { id: "loading" }
        );
      }
    }
  };

  const editModalDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ModalRender(
      <div className="formInput">
        <div className="form_title form_style">
          <h2>Edit {props.billName}</h2>
        </div>
        <div className="form_inputs form_style">
          <form>
            <input
              className="text__field"
              id="title"
              name="title"
              type="text"
              placeholder="Insert Bill Name Here"
              value={props.billName}
              onChange={(e) => {
                setEditBillName(e.target.value);
              }}
            />
            <input
              className="text__field"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Insert Cost of Bill Here"
              value={props.billDueAmt}
              onChange={(e) => setEditBillDueAmt(e.target.value)}
            />
            <input
              className="text__field dateBox"
              id="date"
              name="dueDate"
              type="date"
              value={props.billDueDate}
              onChange={(e) => setEditBillDueDate(e.target.value)}
            />
            <br />
            <label>
              <input
                id="reoccuring"
                name="reoccuring"
                type="checkbox"
                checked={props.isRecurring}
                onChange={(e) => setEditIsRecurring(e.target.checked)}
              />
              <span>Monthly?</span>
            </label>
          </form>
        </div>
      </div>,
      editBill
    );
  };

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ModalRender(
      <div className={styles.modal_format}>
        <div className={styles.modalT}>
          <h1 className={styles.gradient_text}>Delete {props.billName}?</h1>
        </div>
        <div className={styles.modalD}>
          <h3>
            Deleting this item will get rid of everything associated with it as
            well.
          </h3>
          <h3 className={styles.textItalic}>
            Once confirmed, you can&apos;t undo this action!
          </h3>
        </div>
      </div>,
      deleteFunction
    );
  };

  const deleteFunction = () => {
    try {
      if (deleteMutate) {
        setIsEnabled(false);
        deleteMutate({ id: props.id });
        toast.loading("Processing...", { id: "loading" });
      }
    } catch (error) {
      setIsEnabled(true);
      toast.error("Failed to delete bill");
    }
  };

  return (
    <div className={styles.billListFormat} key={props.id}>
      <div className={styles.billList_title}>
        <h1 className={styles.gradient_text}>{props.billName}</h1>
      </div>
      <div className={styles.billList_amt}>
        <h2 className={styles.textItalic}>{`Amount Due: ${convertCurr(
          props.billDueAmt
        )}`}</h2>
        <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
      </div>
      <div className={styles.billList_dueDates}>
        <h3 className="center">
          Pay By: <span className={styles.textItalic}>{dueDate}</span>
        </h3>
        {!!props.isRecurring && <h3>Monthly Bill</h3>}
      </div>
      <div className={styles.billList_btns}>
        <button
          className="btn"
          disabled={!isEnabled}
          onClick={(e) => paydFunction(e)}
        >
          Payd!
        </button>
        <button className="btn" onClick={(e) => historyDisplay(e)}>
          History
        </button>
        <button className="btn" onClick={(e) => editModalDisplay(e)}>
          Edit
        </button>
        <button
          className="btn"
          disabled={!isEnabled}
          onClick={(e) => confirmDelete(e)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
