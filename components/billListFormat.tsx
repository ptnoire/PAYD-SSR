import { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type BillWithUser = RouterOutputs["bills"]["getAll"][number];

export function BillFormating(props: BillWithUser) {
  const { bill } = props;

  const dueDate = new Date(bill.billDueDate);
  return (
    <div className="billListFormat" key={bill.id}>
      <div className="form_style billList_title">
        <h1>{bill.billName}</h1>
      </div>
      <div className="form_style billList_amt">
        <h2>{`Amount Due: ${bill.billDueAmt}`}</h2>
      </div>
      <div className="form_style billList_dueDates">
        <h3>{dueDate.toLocaleDateString()}</h3>
        {!!bill.isRecurring && <h3>Monthly Bill</h3>}
        <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
      </div>
      <div className="billList_btns">
        <button className="btn payd__button">Payd!</button>
        <button className="btn history__button">View History</button>
        <button className="btn modify_button">Edit Bill</button>
      </div>
    </div>
  );
}
