import { RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);

type BillWithUser = RouterOutputs["bills"]["getUserBills"][number];

export function BillFormating(props: BillWithUser) {
  const dueDate = new Date(props.billDueDate);

  const deleteFunction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data } = api.bills.deleteBill.useQuery({ id: props.id });
      toast.success(`${data?.billName} successfully deleted!`);
    } catch (error) {
      toast.error("Failed to delete bill");
    }
  };

  return (
    <div className="billListFormat" key={props.id}>
      <div className="form_style billList_title">
        <h1>{props.billName}</h1>
      </div>
      <div className="form_style billList_amt">
        <h2>{`Amount Due: ${props.billDueAmt}`}</h2>
      </div>
      <div className="form_style billList_dueDates">
        <h3>{dueDate.toLocaleDateString()}</h3>
        {!!props.isRecurring && <h3>Monthly Bill</h3>}
        <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
      </div>
      <div className="billList_btns">
        <button className="btn payd__button">Payd!</button>
        <Link href={`/billHistory/${props.id}`}>
          <button className="btn history__button">View History</button>
        </Link>
        <button className="btn modify_button">Edit Bill</button>
        <button className="btn" onClick={(e) => deleteFunction(e)}>
          Delete Bill
        </button>
      </div>
    </div>
  );
}
