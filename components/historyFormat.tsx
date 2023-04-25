import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);
import type { BillHistory } from "@prisma/client";
import toast from "react-hot-toast";

import {
  faCancel,
  faCheck,
  faClose,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import type { functionObject } from "~/helpers/exportTypes";

type HistoryFormatingProps = BillHistory & {
  passFunctions: functionObject;
};

export function HistoryFormating({
  passFunctions,
  ...props
}: HistoryFormatingProps) {
  const paydAt = props.createAt.toISOString();
  const paydDate = convertLocalDate(paydAt);

  const { deleteHistoryMutate } = passFunctions;

  const slideDownRender = (content: ReactElement) => {
    if (!content) return;
    const slide = document.getElementById(props.id);
    console.log(slide);
    if (!slide) return null;
    const root = createRoot(slide);
    const closeModal = () => {
      slide?.classList.add("hidden");
      root.unmount();
    };
    const deleteAndClose = () => {
      deleteFunction();
      closeModal();
      document.getElementById(`_${props.id}`)?.classList.add("hidden");
    };
    slide?.classList.remove("hidden");
    root.render(
      <div className={styles.optionsRow}>
        {content}
        <button onClick={deleteAndClose}>
          <FontAwesomeIcon icon={faCheck} className="fa-icon" />
        </button>
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} className="fa-icon" />
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
      if (deleteHistoryMutate) deleteHistoryMutate({ id: props.id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  return (
    <>
      <div id={`_${props.id}`} className={styles.history_format} key={props.id}>
        <h3 className={styles.history_title}>{props.billName}</h3>
        <p>{paydDate}</p>
        <h3 className={styles.textItalic}>
          {`Amount Paid: ${convertCurr(props.amtPaid)}`}
        </h3>
        <div className={styles.history_buttons}>
          <button className="btn">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="btn" onClick={confirmDelete}>
            <FontAwesomeIcon icon={faCancel} />
          </button>
        </div>
      </div>
      <div id={props.id} className="slideModal hidden"></div>
    </>
  );
}
