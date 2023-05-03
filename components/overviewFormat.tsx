import {
  BillEditSchema,
  BillWithHistory,
  editMutateFunction,
  functionObject,
} from "~/helpers/exportTypes";
import styles from "../src/pages/index.module.css";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
import {
  faCancel,
  faCaretDown,
  faCaretUp,
  faCheck,
  faClose,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import toast from "react-hot-toast";
import { z } from "zod";

export function OverviewFormat(props: {
  bills: BillWithHistory;
  passFunctions: functionObject;
  editMutate: editMutateFunction;
}) {
  const {
    id,
    payd,
    isRecurring,
    createAt,
    billDueAmt,
    billName,
    billDueDate,
    history,
  } = props.bills;

  const [showMore, setShowMore] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const [editBillName, setEditBillName] = useState(billName);
  const [editBillDueAmt, setEditBillDueAmt] = useState(billDueAmt);
  const [editBillDueDate, setEditBillDueDate] = useState("");
  const [editisRecurring, setEditIsRecurring] = useState(isRecurring);

  const { deleteMutate } = props.passFunctions;

  const slideDownRender = (content: ReactElement) => {
    if (!content) return;
    const slide = document.getElementById(id);

    if (!slide) return null;
    const root = createRoot(slide);
    const closeModal = () => {
      slide?.classList.add("hidden");
      root.unmount();
      setIsEnabled(true);
    };
    const deleteAndClose = () => {
      deleteFunction();
      closeModal();
      document.getElementById(`_${id}`)?.classList.add("hidden");
      setIsEnabled(true);
    };
    slide?.classList.remove("hidden");
    setIsEnabled(false);
    root.render(
      <div className={styles.optionsRow}>
        {content}
        <button onClick={deleteAndClose}>
          <FontAwesomeIcon icon={faCheck} className="fa-icon green" />
        </button>
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} className="fa-icon red" />
        </button>
      </div>
    );
  };

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    slideDownRender(
      <h3 className={styles.textItalic}>
        Are you sure you want to delete this bill?
      </h3>
    );
  };

  const deleteFunction = () => {
    try {
      if (deleteMutate) deleteMutate({ id: id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  const showMoreToggle = () => {
    setShowMore(!showMore);
    setShowEdit(false);
  };

  const editToggle = () => {
    setShowEdit(!showEdit);
  };

  const editBill = () => {
    toast.loading("Editting...", { id: "loading" });
    try {
      if (props.editMutate) {
        const parsedDate = new Date(
          editBillDueDate + " 00:00:00"
        ).toISOString();
        props.editMutate(
          BillEditSchema.parse({
            id: id,
            billName: editBillName,
            billDueAmt: editBillDueAmt,
            billDueDate: parsedDate,
            isRecurring: editisRecurring,
          })
        );
        setEditBillName("");
        setEditBillDueAmt(0);
        setEditBillDueDate("");
        setEditIsRecurring(false);
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
    editToggle();
  };

  return (
    <>
      <div id={`_${id}`} className={styles.overview}>
        {!!showMore && !!showEdit && (
          <h1 className={styles.gradient_text}>Edit Bill Details</h1>
        )}
        {!showEdit && (
          <p>
            Bill Name: <span className={styles.textItalic}>{billName}</span>
          </p>
        )}
        {!!showMore && !!showEdit && (
          <input
            className="text__field"
            type="text"
            placeholder={billName}
            value={editBillName}
            onChange={(e) => setEditBillName(e.target.value)}
          />
        )}
        {!!showMore && !showEdit && (
          <p>
            Cost:{" "}
            <span className={styles.textItalic}>{convertCurr(billDueAmt)}</span>
          </p>
        )}
        {!!showMore && !!showEdit && (
          <input
            className="text__field"
            type="number"
            step="0.01"
            placeholder={billDueAmt.toString()}
            value={editBillDueAmt}
            onChange={(e) => setEditBillDueAmt(parseFloat(e.target.value))}
          />
        )}

        {!!history[0]?.createAt && !!showMore && !showEdit && (
          <p>
            Last Payment Made:<br></br>
            <span className={styles.textItalic}>
              {!!history[0]?.createAt &&
                convertLocalDate(history[0]?.createAt.toString())}
            </span>
          </p>
        )}
        {!!showMore && !showEdit && (
          <p>
            Next Due Date:<br></br>
            <span className={styles.textItalic}>
              {convertLocalDate(billDueDate)}
            </span>
          </p>
        )}
        {!!showMore && !!showEdit && (
          <input
            className="text__field dateBox"
            name="dueDate"
            type="date"
            value={editBillDueDate}
            onChange={(e) => setEditBillDueDate(e.target.value)}
          />
        )}
        {!!showMore && !showEdit && (
          <p>
            Bill Created on:<br></br>
            <span className={styles.textItalic}>
              {convertLocalDate(createAt.toString())}
            </span>
          </p>
        )}
        {!!isRecurring && !!showMore && !showEdit && <p>Monthly Bill</p>}
        {!isRecurring && !!payd && !!showMore && !showEdit && (
          <p className={styles.gradient_text}>Bill Paid!</p>
        )}
        {!!showMore && !!showEdit && (
          <label>
            <input
              className="text__field"
              type="checkbox"
              checked={editisRecurring}
              onChange={(e) => setEditIsRecurring(e.target.checked)}
            />
            <span className={styles.textItalic}>Monthly?</span>
          </label>
        )}
        {!!showMore && !showEdit && (
          <div className={styles.overview_edit}>
            <button disabled={!isEnabled} onClick={editToggle}>
              <FontAwesomeIcon icon={faEdit} className="fa-icon" />
            </button>
            <button disabled={!isEnabled} onClick={confirmDelete}>
              <FontAwesomeIcon icon={faClose} className="fa-icon" />
            </button>
          </div>
        )}
        {!!showMore && !!showEdit && (
          <div className={styles.overview_edit}>
            <button onClick={editBill}>
              <FontAwesomeIcon icon={faCheck} className="fa-icon green" />
            </button>
            <button onClick={editToggle}>
              <FontAwesomeIcon icon={faClose} className="fa-icon red" />
            </button>
          </div>
        )}
        <div className={styles.overview_btns}>
          <button disabled={!isEnabled} onClick={showMoreToggle}>
            {!showMore && (
              <FontAwesomeIcon icon={faCaretDown} className="fa-icon" />
            )}
            {!!showMore && (
              <FontAwesomeIcon icon={faCaretUp} className="fa-icon" />
            )}
          </button>
        </div>
      </div>
      <div id={id} className="slideModal hidden"></div>
    </>
  );
}
