import styles from "./index.module.css";
import { type NextPage } from "next";
import { NavBar } from "components/navBar";
import { BillForm } from "components/billForm";
import { BillList } from "components/billList";

const Home: NextPage = () => {
  return (
    <>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.formList}>
          <BillForm />
        </div>

        <div className={styles.billList}>
          <BillList />
        </div>
      </main>
    </>
  );
};

export default Home;
