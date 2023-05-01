import type {
  billHistoryMutateFunction,
  functionObject,
} from "~/helpers/exportTypes";
import styles from "../src/pages/index.module.css";
import { HistoryFormating } from "./historyFormat";
import type { BillHistory } from "@prisma/client";
import { Pagination } from "./pagination";
import { useState } from "react";

export function BillHistoryComponent(props: {
  history: Array<BillHistory> | undefined;
  title: string;
  passFunctions: functionObject;
  historyEditFunction: billHistoryMutateFunction;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.history?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
        {currentItems &&
          currentItems.length !== 0 &&
          currentItems?.map((bill) => (
            <HistoryFormating
              {...bill}
              key={bill.id}
              passFunctions={props.passFunctions}
              historyEditFunction={props.historyEditFunction}
            />
          ))}
      </div>
      <div className={styles.modalB}>
        {props.history && props.history.length > 10 && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={props.history?.length || 0}
            currentPage={currentPage}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
}
