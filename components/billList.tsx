import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import { BillFormating } from "./billListFormat";

export function BillList() {
  const { data, isLoading: postsLoading } = api.bills.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong!</div>;

  return (
    <div className="">
      {data?.map((bill) => (
        <BillFormating {...bill} key={bill.bill.id} />
      ))}
    </div>
  );
}
