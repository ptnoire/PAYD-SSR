import { RouterOutputs } from "~/utils/api";

type BillWithUser = RouterOutputs["bills"]["getAll"][number];

export function BillFormating(props: BillWithUser) {
  const { bill, owner } = props;
  const dueDate = new Date(bill.billDueDate);
  return (
    <div key={bill.id}>
      <h1>{bill.billName}</h1>
      <h1>{bill.billDueAmt}</h1>
      <h1>{dueDate.toLocaleDateString()}</h1>
      <h1>{bill.isRecurring}</h1>
    </div>
  );
}
