import type { BillWithHistory, functionObject } from "~/helpers/exportTypes";
import styles from "../src/pages/index.module.css";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
import {
  faCaretDown,
  faCaretUp,
  faCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import toast from "react-hot-toast";

export function OverviewFormat(props: {
  bills: BillWithHistory;
  passFunctions: functionObject;
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
  const [isEnabled, setIsEnabled] = useState(true);

  const { deleteMutate } = props.passFunctions;

  const slideDownRender = (content: ReactElement) => {
    if (!content) return;
    const slide = document.getElementById(id);
    console.log(slide);
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
        Are you sure you want to delete this history item?
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
  };

  return (
    <div id={`_${id}`} className={styles.overview}>
      <p>
        Bill Name: <span className={styles.textItalic}>{billName}</span>
      </p>
      {!!showMore && (
        <p>
          Cost:
          <span className={styles.textItalic}>{convertCurr(billDueAmt)}</span>
        </p>
      )}
      {!!history[0]?.createAt && !!showMore && (
        <p>
          Last Payment Made:
          <span className={styles.textItalic}>
            {!!history[0]?.createAt &&
              convertLocalDate(history[0]?.createAt.toString())}
          </span>
        </p>
      )}
      {!!showMore && (
        <p>
          Next Due Date:
          <span className={styles.textItalic}>
            {convertLocalDate(billDueDate)}
          </span>
        </p>
      )}
      {!!showMore && (
        <p>
          Bill Created on:
          <span className={styles.textItalic}>
            {convertLocalDate(createAt.toString())}
          </span>
        </p>
      )}
      {!!isRecurring && !!showMore && <p>Monthly Bill</p>}
      {!isRecurring && !!payd && !!showMore && <p>Bill Paid!</p>}
      <div className={styles.overview_btns}>
        <button disabled={!isEnabled} onClick={showMoreToggle}>
          {!showMore && (
            <FontAwesomeIcon icon={faCaretDown} className="fa-icon" />
          )}
          {!!showMore && (
            <FontAwesomeIcon icon={faCaretUp} className="fa-icon" />
          )}
        </button>
        <button disabled={!isEnabled} onClick={confirmDelete}>
          <FontAwesomeIcon icon={faClose} className="fa-icon" />
        </button>
      </div>
      <div id={id} className="slideModal hidden"></div>
    </div>
  );
}
