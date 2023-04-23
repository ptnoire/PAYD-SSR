import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);
import type { BillHistory } from "@prisma/client";
import { api } from "~/utils/api";
// import toast from "react-hot-toast";

// import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function HistoryFormating(props: BillHistory) {
  const ctx = api.useContext();
  const paydAt = props.createAt.toISOString();
  const paydDate = convertLocalDate(paydAt);
  let slideModal: boolean = false;

  // const { mutate } = api.bills.deleteBillHistory.useMutation({
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

  // export const ModalRender = (content: ReactElement) => {
  //   if (!content) return;
  //   const modal = document.querySelector(".modal");
  //   const root = createRoot(modal!);
  //   const closeModal = () => {
  //     root.unmount();
  //     backdrop?.classList.add("hidden");
  //     modal?.classList.add("hidden");
  //   };

  //   backdrop?.classList.remove("hidden");
  //   modal?.classList.remove("hidden");
  //   root.render(
  //     <>
  //       <button className="modal_close" onClick={closeModal}>
  //         <FontAwesomeIcon icon={faClose} className="fa-icon" />
  //       </button>
  //       {content}
  //       <div className="center">
  //         <button onClick={closeModal}>
  //           <FontAwesomeIcon icon={faClose} className="fa-icon" />
  //         </button>
  //       </div>
  //     </>
  //   );
  //   backdrop?.addEventListener("click", closeModal);
  // };

  // const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   slideModal = !slideModal;
  // };

  // const deleteFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   try {
  //     mutate({ id: props.id });
  //   } catch (error) {
  //     toast.error("Failed to delete bill");
  //   }
  // };

  return (
    <>
      <div className={styles.history_format} key={props.id}>
        <h3 className={styles.history_title}>{props.billName}</h3>
        <h3>{paydDate}</h3>
        <h3 className={styles.textItalic}>
          {`Amount Paid: ${convertCurr(props.amtPaid)}`}
        </h3>
        <button className="btn">Edit</button>
        <button className="btn">Delete</button>
      </div>
      <div className="deleteSlideModal"></div>
    </>
  );
}
