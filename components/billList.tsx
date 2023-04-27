import styles from "../src/pages/index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { convertCurr } from "~/helpers/convert";
import type { functionObject } from "~/helpers/exportTypes";
import { LoadingSpinner } from "./loading";
import { NewListDisplay } from "./newList";
import { Dashboard } from "./dashboard";
import { BillFormating } from "./billListFormat";
import { useState } from "react";
import toast from "react-hot-toast";

export const BillList = () => {
  const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();
  const [isEnabled, setIsEnabled] = useState(true);

  const ctx = api.useContext();

  const { mutate: deleteMutate } = api.bills.deleteBill.useMutation({
    onSuccess: async () => {
      await ctx.bills.getUserBills.invalidate();
      toast.success("Bill Successfully Deleted!", { id: "loading" });
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;
      if (errMsg && errMsg[0]) {
        toast.error(errMsg[0]);
      } else {
        toast.error("Failed to Delete!");
      }
    },
  });

  const { mutate: paydMutate } = api.bills.payd.useMutation({
    onSuccess: async () => {
      await ctx.bills.getUserBills.invalidate();
      toast.success("Bill Payd!!", { id: "loading" });
      setIsEnabled(true);
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;
      if (errMsg && errMsg[0]) {
        toast.error(errMsg[0], { id: "loading" });
      } else {
        toast.error("Failed to pay bill, whoops!", { id: "loading" });
      }
    },
  });

  const { mutate: deleteHistoryMutate } =
    api.bills.deleteBillHistory.useMutation({
      onSuccess: async () => {
        await ctx.bills.getUserBills.invalidate();
        toast.success("Bill Successfully Deleted!", { id: "loading" });
        setIsEnabled(true);
      },
      onError: (e) => {
        const errMsg = e.data?.zodError?.fieldErrors.content;
        if (errMsg && errMsg[0]) {
          toast.error(errMsg[0], { id: "loading" });
        } else {
          toast.error("Failed to Delete!", { id: "loading" });
        }
      },
    });

  const { mutate: editMutate } = api.bills.edit.useMutation({
    onSuccess: async () => {
      await ctx.bills.getUserBills.invalidate();
      toast.success("Bill Successfully Editted!", { id: "loading" });
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;
      if (errMsg && errMsg[0]) {
        toast.error(errMsg[0]);
      } else {
        toast.error("Failed to Delete!", { id: "loading" });
      }
    },
  });

  const passFunctions: functionObject = {
    deleteMutate,
    paydMutate,
    deleteHistoryMutate,
  };

  const today = new Date();

  if (postsLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  if (!data || data.userBills.bills.length === 0) return <NewListDisplay />;

  return (
    <>
      <div className={styles.optionsRow}>
        <Dashboard history={data.userHistory} passFunctions={passFunctions} />
      </div>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyCheck} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>Today&apos;s Date: </span>
          {today.toLocaleDateString()}
        </h3>
        <h3>
          <span className={styles.textItalic}>Current Balance: </span>
          {(typeof data?.currBalance === "number" &&
            convertCurr(data?.currBalance)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyBill} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>
            This Month&apos;s Expenses:{" "}
          </span>
          {(typeof data?.monthExpense === "number" &&
            convertCurr(data?.monthExpense)) ||
            convertCurr(0)}
        </h3>
        <h3>
          <span className={styles.textItalic}>Total Monthly Expenses: </span>
          {(typeof data?.expenses === "number" &&
            convertCurr(data?.expenses)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div>
        {data.userBills.bills?.map((bill) => (
          <BillFormating
            {...bill}
            key={bill.id}
            passFunctions={passFunctions}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            editMutate={editMutate}
          />
        ))}
      </div>
    </>
  );
};
