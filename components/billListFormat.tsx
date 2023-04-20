import { RouterOutputs, api } from "~/utils/api";
import styles from "../src/pages/index.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import toast from "react-hot-toast";
import { convertCurr, convertLocalDate } from "~/helpers/convert";
dayjs.extend(relativeTime);

type BillWithUser = RouterOutputs["bills"]["getUserBills"][number];

const validator = async () => {
  const ctx = api.useContext();
  await ctx.bills.getUserBills.invalidate();
  await ctx.bills.getExpenseTotal.invalidate();
  await ctx.bills.getMonthTotal.invalidate();
  await ctx.bills.getCurBalance.invalidate();
};

export function BillFormating(props: BillWithUser) {
  const dueDate = convertLocalDate(props.billDueDate);

  const { mutate: deleteMutate } = api.bills.deleteBill.useMutation({
    onSuccess: async () => {
      validator();
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
      deleteMutate({ id: props.id });
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  const { mutate: paydMutate } = api.bills.payd.useMutation({
    onSuccess: async () => {
      validator();
      toast.success("Bill Payd!!");
    },
    onError: (e) => {
      const errMsg = e.data?.zodError?.fieldErrors.content;
      if (errMsg && errMsg[0]) {
        toast.error(errMsg[0]);
      } else {
        toast.error("Failed to pay bill, whoops!");
      }
    },
  });

  const paydFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      paydMutate({ id: props.id });
    } catch (error) {
      toast.error(`Uh-oh! ${error}`);
    }
  };

  // const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();

  // }

  return (
    <div className={styles.billListFormat} key={props.id}>
      <div className={styles.billList_title}>
        <h1 className={styles.gradient_text}>{props.billName}</h1>
      </div>
      <div className={styles.billList_amt}>
        <h2 className={styles.textItalic}>{`Amount Due: ${convertCurr(
          props.billDueAmt
        )}`}</h2>
      </div>
      <div className={styles.billList_dueDates}>
        <h3>{dueDate}</h3>
        {!!props.isRecurring && <h3>Monthly Bill</h3>}
        <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
      </div>
      <div className={styles.billList_btns}>
        <button className="btn payd__button" onClick={(e) => paydFunction(e)}>
          Payd!
        </button>
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
