import styles from "./index.module.css";
import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingSpinner } from "components/loading";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

const ProfilePage: NextPage = () => {
  return (
    <>
      <main className={styles.main}>
        {/* <NavBar /> */}
        <div className="container">
          <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
          <h1>Slug View</h1>
          <LoadingSpinner />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
