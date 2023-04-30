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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faEdit,
  faHandHoldingDollar,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
dayjs.extend(relativeTime);

export function BillFormating({
  passFunctions,
  isEnabled,
  setIsEnabled,
  ...props
}: BillFormatingProps) {
  const [editBillName, setEditBillName] = useState("");
  const [editBillDueAmt, setEditBillDueAmt] = useState("");
  const [editBillDueDate, setEditBillDueDate] = useState("");
  const [editisRecurring, setEditIsRecurring] = useState(false);
  const [showEditBar, setShowEditBar] = useState(false);

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

  const toggleModal = () => {
    setShowEditBar(!showEditBar);
  };

  const editBill = () => {
    toast.loading("Editting...", { id: "loading" });
    try {
      if (props.editMutate) {
        const parsedDate = new Date(editBillDueDate);
        const isoDateString = parsedDate.toISOString();
        props.editMutate(
          BillEditSchema.parse({
            id: props.id,
            billName: editBillName,
            billDueAmt: parseFloat(editBillDueAmt),
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
    toggleModal();
  };

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ModalRender(
      <div id={`_${props.id}`} className={styles.modal_format}>
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
    <>
      <div id={`_${props.id}`} className={styles.billListFormat} key={props.id}>
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
        {!showEditBar && (
          <div className={styles.billList_btns}>
            <button disabled={!isEnabled} onClick={(e) => paydFunction(e)}>
              <FontAwesomeIcon icon={faHandHoldingDollar} className="fa-icon" />
            </button>
            <button onClick={(e) => historyDisplay(e)}>
              <FontAwesomeIcon icon={faHistory} className="fa-icon" />
            </button>
            <button onClick={toggleModal}>
              <FontAwesomeIcon icon={faEdit} className="fa-icon" />
            </button>
            <button disabled={!isEnabled} onClick={(e) => confirmDelete(e)}>
              <FontAwesomeIcon icon={faClose} className="fa-icon" />
            </button>
          </div>
        )}
        {!!showEditBar && (
          <div className={styles.billList_edit}>
            <input
              className="text__field"
              type="text"
              placeholder={props.billName}
              value={editBillName}
              onChange={(e) => setEditBillName(e.target.value)}
            />
            <input
              className="text__field"
              type="number"
              step="0.01"
              placeholder={props.billDueAmt.toString()}
              value={editBillDueAmt}
              onChange={(e) => setEditBillDueAmt(e.target.value)}
            />
            <input
              className="text__field dateBox"
              name="dueDate"
              type="date"
              value={editBillDueDate}
              onChange={(e) => setEditBillDueDate(e.target.value)}
            />
            <label>
              <input
                className="text__field"
                type="checkbox"
                checked={editisRecurring}
                onChange={(e) => setEditIsRecurring(e.target.checked)}
              />
              <span className={styles.textItalic}>Monthly?</span>
            </label>
            <button onClick={editBill}>
              <FontAwesomeIcon icon={faCheck} className="fa-icon green" />
            </button>
            <button onClick={toggleModal}>
              <FontAwesomeIcon icon={faClose} className="fa-icon red" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
