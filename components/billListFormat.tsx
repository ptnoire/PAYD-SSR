import { RouterOutputs, api } from "~/utils/api";
import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);

type BillWithUser = RouterOutputs["bills"]["getUserBills"][number];

export function BillFormating(props: BillWithUser) {
  const dueDate = new Date(props.billDueDate);
  const ctx = api.useContext();

  const { mutate } = api.bills.deleteBill.useMutation({
    onSuccess: async () => {
      await ctx.bills.getUserBills.invalidate();
      toast.success("Bill Successfully Deleted!");
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

  const deleteFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      mutate({ id: props.id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  // const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  // }

  return (
    <div className={styles.billListFormat} key={props.id}>
      <div className={`${styles.billList_title} ${styles.form_style}`}>
        <h1 className={styles.gradient_text}>{props.billName}</h1>
      </div>
      <div className={`${styles.billList_amt} ${styles.form_style}`}>
        <h2>{`Amount Due: ${props.billDueAmt}`}</h2>
      </div>
      <div className={`${styles.billList_dueDates} ${styles.form_style}`}>
        <h3>{dueDate.toLocaleDateString()}</h3>
        {!!props.isRecurring && <h3>Monthly Bill</h3>}
        <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
      </div>
      <div className={styles.billList_btns}>
        <button className="btn payd__button">Payd!</button>
        <Link href={`/billHistory/${props.id}`}>
          <button className="btn history__button">History</button>
        </Link>
        <button className="btn modify_button">Edit</button>
        <button className="btn" onClick={(e) => deleteFunction(e)}>
          Delete
        </button>
      </div>
    </div>
  );
}
