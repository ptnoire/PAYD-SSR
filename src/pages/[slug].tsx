import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavBar } from "components/navBar";
import { LoadingSpinner } from "components/loading";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Payd-2</title>
        <meta name="description" content="Bill Tracking" />
        <meta
          name="keywords"
          content="Payd-2, Payd, Bill Tracking, Bill, Tracker, Simple, Simple Bill Tracking, Bill Tracker, Bills, Finance"
        ></meta>
        <link
          rel="icon"
          media="(prefers-color-scheme: light)"
          href="/ptblack.ico"
        />
        <link
          rel="icon"
          media="(prefers-color-scheme: dark)"
          href="/ptwhite.ico"
        />
      </Head>
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

export default ProfilePage;
