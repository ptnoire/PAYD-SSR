import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);
import toast from "react-hot-toast";

import {
  faCancel,
  faCheck,
  faClose,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { BillHistoryEditSchema } from "~/helpers/exportTypes";
import type { HistoryFormatingProps } from "~/helpers/exportTypes";
import { z } from "zod";

export function HistoryFormating({
  passFunctions,
  historyEditFunction,
  ...props
}: HistoryFormatingProps) {
  const paydDate = convertLocalDate(props.createAt.toString());
  const { deleteHistoryMutate } = passFunctions;

  const [amtPaid, setAmtPaid] = useState(props.amtPaid);
  const [toggleModal, setToggleModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const slideDownRender = (content: ReactElement) => {
    if (!content) return;
    const slide = document.getElementById(props.id);
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
      document.getElementById(`_${props.id}`)?.classList.add("hidden");
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

  const toggleEditForm = () => {
    setToggleModal(!toggleModal);
  };

  const editHistoryButton = () => {
    toast.loading("Editting...", { id: "loading" });
    try {
      historyEditFunction(
        BillHistoryEditSchema.parse({
          id: props.id,
          billPaidAmt: amtPaid,
        })
      );
      toggleEditForm();
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        const errMsg = e.errors[0]?.message;
        if (errMsg) {
          toast.error(errMsg, { id: "loading" });
          console.log(errMsg);
        }
      } else {
        toast.error(
          "Failed to post, please check that all fields are filled out!",
          { id: "loading" }
        );
      }
    }
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
      if (deleteHistoryMutate) deleteHistoryMutate({ id: props.id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  return (
    <>
      <div id={`_${props.id}`} className={styles.history_format} key={props.id}>
        <h3 className={styles.history_title}>{props.billName}</h3>
        {!toggleModal && (
          <>
            <p>{paydDate}</p>
            <h3 className={styles.textItalic}>
              {`Amount Paid: ${convertCurr(amtPaid)}`}
            </h3>
            <div className={styles.history_buttons}>
              <button disabled={!isEnabled} onClick={toggleEditForm}>
                <FontAwesomeIcon icon={faEdit} className="fa-icon" />
              </button>
              <button disabled={!isEnabled} onClick={confirmDelete}>
                <FontAwesomeIcon icon={faCancel} className="fa-icon" />
              </button>
            </div>
          </>
        )}
        {!!toggleModal && (
          <>
            <input
              className="text__field"
              type="number"
              step="0.01"
              placeholder={props.amtPaid.toString()}
              value={amtPaid}
              onChange={(e) => setAmtPaid(parseFloat(e.target.value))}
            />
            <div className={styles.history_buttons}>
              <button onClick={editHistoryButton}>
                <FontAwesomeIcon icon={faCheck} className="fa-icon green" />
              </button>
              <button onClick={toggleEditForm}>
                <FontAwesomeIcon icon={faClose} className="fa-icon red" />
              </button>
            </div>
          </>
        )}
      </div>
      <div id={props.id} className="slideModal hidden"></div>
    </>
  );
}
