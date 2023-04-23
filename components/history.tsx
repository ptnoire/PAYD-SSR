import styles from "../src/pages/index.module.css";
import { HistoryFormating } from "./historyFormat";
import type { BillHistory } from "@prisma/client";

export function BillHistoryComponent(props: {
  history: Array<BillHistory> | undefined;
  title: string;
}) {
  return (
    <div className={styles.modal_format}>
      <div className={styles.modalT}>
        <h1 className={styles.gradient_text}>{props.title}&apos;s History</h1>
      </div>
      <div className={styles.modalD}>
        {props.history && props.history.length === 0 && (
          <h3 className={styles.textItalic}>
            Looks like there is no history on this bill just yet!
          </h3>
        )}
        {props.history &&
          props.history.length !== 0 &&
          props.history?.map((bill) => (
            <HistoryFormating {...bill} key={bill.id} />
          ))}
      </div>
      <div className={styles.modalB}></div>
    </div>
  );
}
