import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);
import type { BillHistory } from "@prisma/client";
// import { api } from "~/utils/api";
import toast from "react-hot-toast";

import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";

export function HistoryFormating(props: BillHistory) {
  // const ctx = api.useContext();

  const paydAt = props.createAt.toISOString();
  const paydDate = convertLocalDate(paydAt);

  // const { mutate: deleteMutate } = api.bills.deleteBillHistory.useMutation({
  //   onSuccess: async () => {
  //     await ctx.bills.getUserBills.invalidate();
  //     toast.success("Bill Successfully Deleted!");
  //   },
  //   onError: (e) => {
  //     const errMsg = e.data?.zodError?.fieldErrors.content;
  //     if (errMsg && errMsg[0]) {
  //       toast.error(errMsg[0]);
  //     } else {
  //       toast.error("Failed to Delete!");
  //     }
  //   },
  // });

  const slideDownRender = (content: ReactElement) => {
    if (!content) return;
    const slide = document.querySelector(".slideModal");
    const root = createRoot(slide!);
    const closeModal = () => {
      slide?.classList.add("hidden");
      root.unmount();
    };
    slide?.classList.remove("hidden");
    root.render(
      <div className={styles.optionsRow}>
        {content}
        <button onClick={deleteFunction}>
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

  const deleteFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // deleteMutate({ id: props.id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  return (
    <>
      <div className={styles.history_format} key={props.id}>
        <h3 className={styles.history_title}>{props.billName}</h3>
        <h3>{paydDate}</h3>
        <h3 className={styles.textItalic}>
          {`Amount Paid: ${convertCurr(props.amtPaid)}`}
        </h3>
        <button className="btn">Edit</button>
        <button className="btn" onClick={confirmDelete}>
          Delete
        </button>
      </div>
      <div className="slideModal hidden"></div>
    </>
  );
}
