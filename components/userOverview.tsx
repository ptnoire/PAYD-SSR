import type {
  BillWithHistory,
  billHistoryMutateFunction,
  functionObject,
} from "~/helpers/exportTypes";
import styles from "../src/pages/index.module.css";
import { Pagination } from "./pagination";
import { useState } from "react";
import { OverviewFormat } from "./overviewFormat";

export function UserOverview(props: {
  bills: Array<BillWithHistory>;
  passFunctions: functionObject;
  historyEditFunction: billHistoryMutateFunction;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.bills?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.modal_format}>
      <div className={styles.modalT}>
        <h1 className={styles.gradient_text}>Account Overview</h1>
      </div>
      <div className={styles.modalD}>
        {props.bills && props.bills.length === 0 && (
          <h3 className={styles.textItalic}>
            Looks like you haven&apos;t created any bills or history yet!
          </h3>
        )}
        {currentItems &&
          currentItems.length !== 0 &&
          props.bills.map((bill) => (
            <OverviewFormat
              bills={bill}
              key={bill.id}
              passFunctions={props.passFunctions}
            />
          ))}
      </div>
      <div className={styles.modalB}>
        {props.bills && props.bills.length > 10 && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={props.bills?.length || 0}
            currentPage={currentPage}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
}
