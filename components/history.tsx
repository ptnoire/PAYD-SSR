import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../src/pages/index.module.css";
import { HistoryFormating } from "./historyFormat";
import { RouterOutputs } from "~/utils/api";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { CloseModal } from "~/pages";

type BillIndex = RouterOutputs["bills"]["getBillById"];
type BillHistoryIndex = RouterOutputs["bills"]["getBillHistoryById"][number];

type BillHistoryComponentProps = {
  uniqueBill: BillIndex;
  history: BillHistoryIndex[] | undefined;
};
export function BillHistoryComponent(props: BillHistoryComponentProps) {
  if (!props.uniqueBill) return <div>Couldn't Retrieve Bill Data!</div>;
  if (!props.history) return <div>Couldn't Retrieve History!</div>;

  return (
    <div className={styles.modal_format}>
      <div className={styles.modalT}>
        <h1 className={styles.gradient_text}>
          {props.uniqueBill.billName}&apos;s History
        </h1>
      </div>
      <div className={styles.modalD}>
        {props.history.length === 0 && (
          <h3 className={styles.textItalic}>
            Looks like there is no history on this bill just yet!
          </h3>
        )}
        {props.history.length !== 0 &&
          props.history?.map((bill) => (
            <HistoryFormating {...bill} key={bill.id} />
          ))}
      </div>
      <div className={styles.modalB}>
        <button onClick={CloseModal}>
          <FontAwesomeIcon icon={faClose} className="fa-icon" />
        </button>
      </div>
    </div>
  );
}
