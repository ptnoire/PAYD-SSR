import styles from "../index.module.css";
import { type NextPage } from "next";

import { LoadingSpinner } from "components/loading";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { NavBar } from "components/navBar";
import { useRouter } from "next/router";

const BillHistoryPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = api.bills.getBillById.useQuery({
    id: id as string,
  });
  if (!data) return <div>404</div>;

  if (isLoading) return <LoadingSpinner />;

  const dueDate = new Date(data.billDueDate);

  return (
    <>
      <main className={styles.main}>
        <NavBar />
        <div className="container">
          <h1>{data.billName}</h1>
          <h1>{data.billDueAmt}</h1>
          <h3>{dueDate.toLocaleDateString()}</h3>
          {!!data.isRecurring && <h3>Monthly Bill</h3>}
          <h3>{`Due ${dayjs(dueDate).fromNow()}`}</h3>
        </div>
      </main>
    </>
  );
};

export default BillHistoryPage;
