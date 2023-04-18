import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import { BillFormating } from "./billListFormat";
import { useUser } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

export function BillList() {
  const { isSignedIn } = useUser();

  if (!isSignedIn)
    return (
      <div>
        <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
        <h1>Welcome to Payd-2!</h1>
        <h2>Let&apos;s sign in to get started.</h2>
      </div>
    );

  if (isSignedIn) {
    const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();

    if (postsLoading) return <LoadingSpinner />;

    if (!data || data.length === 0)
      return (
        <div>
          <h1 className="center">No bills created yet! 👩‍🏫</h1>
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
      <h3 className="center">Something Went Wrong!</h3>
    </div>
  );
}
