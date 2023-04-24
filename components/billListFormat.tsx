import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
import { BillHistoryComponent } from "./history";
import type { BillWithHistory } from "~/server/api/routers/bills";
import { ModalRender } from "~/pages";
import type { functionObject } from "~/pages";
dayjs.extend(relativeTime);

type BillFormatingProps = BillWithHistory & {
  passFunctions: functionObject;
};

export function BillFormating({ passFunctions, ...props }: BillFormatingProps) {
  const dueDate = convertLocalDate(props.billDueDate);
  const { paydMutate, deleteMutate } = passFunctions;

  const paydFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (paydMutate) paydMutate({ id: props.id });
    } catch (error) {
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
      if (deleteMutate) deleteMutate({ id: props.id });
    } catch (error) {
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
        <button className="btn payd__button" onClick={(e) => paydFunction(e)}>
          Payd!
        </button>
        <button className="btn" onClick={(e) => historyDisplay(e)}>
          History
        </button>
        <button className="btn">Edit</button>
        <button className="btn" onClick={(e) => confirmDelete(e)}>
          Delete
        </button>
      </div>
    </div>
  );
}
