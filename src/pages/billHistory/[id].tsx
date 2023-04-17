import styles from "../index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

import { NavBar } from "components/navBar";
import { LoadingSpinner } from "components/loading";
import { BillForm } from "components/billForm";
import { BillList } from "components/billList";

const BillHistoryPage: NextPage = () => {
  return (
    <>
      <main className={styles.main}>
        <NavBar />
        <div className="container">
          <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
          <h1>Bill History View</h1>
          <LoadingSpinner />
        </div>
      </main>
    </>
  );
};

export default BillHistoryPage;
