import { convertCurr } from "~/helpers/convert";
import { BillFormating } from "./billListFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faMoneyBill,
  faMoneyCheck,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../src/pages/index.module.css";
import { NewListDisplay } from "./newList";
import { BillHistory } from "@prisma/client";
import { BillWithHistory } from "~/server/api/routers/bills";
import { ModalRender } from "~/pages";
import { BillHistoryComponent } from "./history";

export type UserData = {
  userBills: {
    bills: Array<BillWithHistory>;
  };
  userHistory: Array<BillHistory>;
  expenses: number;
  monthExpense: number;
  currBalance: number;
};

export const BillList = (props: UserData) => {
  const today = new Date();

  return (
    <>
      {props.userHistory && props.userHistory.length !== 0 && (
        <div className={styles.optionsRow}>
          <button
            onClick={(e) => {
              e.preventDefault,
                ModalRender(
                  <BillHistoryComponent
                    history={...props.userHistory}
                    title={"Account History"}
                  />
                );
            }}
          >
            <FontAwesomeIcon icon={faHistory} className="fa-icon" />
          </button>
        </div>
      )}
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyCheck} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>Today&apos;s Date: </span>
          {today.toLocaleDateString()}
        </h3>
        <h3>
          <span className={styles.textItalic}>Current Balance: </span>
          {(typeof props?.currBalance === "number" &&
            convertCurr(props?.currBalance)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyBill} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>
            This Month&apos;s Expenses:{" "}
          </span>
          {(typeof props?.monthExpense === "number" &&
            convertCurr(props?.monthExpense)) ||
            convertCurr(0)}
        </h3>
        <h3>
          <span className={styles.textItalic}>Total Monthly Expenses: </span>
          {(typeof props?.expenses === "number" &&
            convertCurr(props?.expenses)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div>
        {props.userBills && props.userBills.bills.length === 0 && (
          <NewListDisplay />
        )}
        {props.userBills &&
          props.userBills.bills?.map((bill) => (
            <BillFormating {...bill} key={bill.id} />
          ))}
      </div>
    </>
  );
};
