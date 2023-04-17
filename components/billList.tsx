import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import { BillFormating } from "./billListFormat";
import { useUser } from "@clerk/nextjs";

export function BillList() {
  const { isSignedIn } = useUser();

  if (!isSignedIn)
    return (
      <div>
        <h3>Sign in to get started!</h3>
      </div>
    );

  if (isSignedIn) {
    const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();

    if (postsLoading) return <LoadingSpinner />;

    if (!data) return <div>Something went wrong!</div>;

    return (
      <div>
        {data?.map((bill) => (
          <BillFormating {...bill} key={bill.id} />
        ))}
      </div>
    );
  }
  return <div>Something went wrong!</div>;
}
