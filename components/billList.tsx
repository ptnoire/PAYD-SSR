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

    if (!data || data.length === 0)
      return (
        <div>
          <h1>No bills created yet! 👩‍🏫</h1>
        </div>
      );

    return (
      <div>
        {data?.map((bill) => (
          <BillFormating {...bill} key={bill.id} />
        ))}
      </div>
    );
  }
  return (
    <div>
      <h3>Something Went Wrong!</h3>
    </div>
  );
}
