import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);
import type { BillHistory } from "@prisma/client";

// import toast from "react-hot-toast";
// import { CloseModal, ModalRender } from "~/pages";
// import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function HistoryFormating(props: BillHistory) {
  const paydAt = props.createAt.toISOString();
  const paydDate = convertLocalDate(paydAt);

  //   const { mutate: deleteMutate } = api.bills.deleteBill.useMutation({
  //     onSuccess: async () => {
  //       await ctx.bills.getUserBills.invalidate();
  //       await ctx.bills.getExpenseTotal.invalidate();
  //       await ctx.bills.getMonthTotal.invalidate();
  //       await ctx.bills.getCurBalance.invalidate();
  //       toast.success("Bill Successfully Deleted!");
  //     },
  //     onError: (e) => {
  //       const errMsg = e.data?.zodError?.fieldErrors.content;
  //       if (errMsg && errMsg[0]) {
  //         toast.error(errMsg[0]);
  //       } else {
  //         toast.error("Failed to Delete!");
  //       }
  //     },
  //   });

  //   const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     ModalRender(
  //       <div className={styles.modal_format}>
  //         <div className={styles.modalT}>
  //           <h1 className={styles.gradient_text}>Delete {props.billName}?</h1>
  //         </div>
  //         <div className={styles.modalD}>
  //           <h3>
  //             Deleting this item will get rid of everything associated with it as
  //             well.
  //           </h3>
  //           <h3 className={styles.textItalic}>
  //             Once confirmed, you can&apos;t undo this action!
  //           </h3>
  //         </div>
  //         <div className={styles.modalB}>
  //           <button onClick={CloseModal}>
  //             <FontAwesomeIcon icon={faCancel} className="fa-icon" />
  //           </button>
  //           <button onClick={(e) => deleteFunction(e)}>
  //             <FontAwesomeIcon icon={faCheck} className="fa-icon" />
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   };

  //   const deleteFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     try {
  //       deleteMutate({ id: props.id });
  //       CloseModal();
  //     } catch (error) {
  //       toast.error("Failed to delete bill");
  //     }
  //   };

  return (
    <div className={styles.history_format} key={props.id}>
      <h3>{paydDate}</h3>
      <h2 className={styles.textItalic}>
        {`Amount Paid: ${convertCurr(props.amtPaid)}`}
      </h2>
      <button className="btn modify_button">Edit</button>
      <button className="btn">Delete</button>
    </div>
  );
}
