import styles from "./index.module.css";
import { type NextPage } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

import { NavBar } from "components/navBar";
import { LoadingSpinner } from "components/loading";
import { BillForm } from "components/billForm";
import { BillList } from "components/billList";

const Home: NextPage = () => {
  return (
    <>
      <main className={styles.main}>
        <NavBar />
        <div className="container">
          <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
          <h1>Welcome to Payd-2!</h1>
          <LoadingSpinner />
          <div className={styles.formList}>
            <BillForm />
          </div>
        </div>
        <div className={styles.billList}>
          <BillList />
        </div>
      </main>
    </>
  );
};

export default Home;
