import styles from "./index.module.css";
import { type NextPage } from "next";
import { BillForm } from "components/billForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faMoneyBill,
  faSignIn,
  faSignOut,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { BillFormating } from "components/billListFormat";
import { LoadingSpinner } from "components/loading";

const showNewBillSubmit = () => {
  const form = document.querySelector(".formInput");
  if (!form) return;
  form.classList.toggle("hidden");
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();

  return (
    <>
      <main className={styles.main}>
        <div className={styles.topNav}>
          <div className={styles.navDate}>
            <h3 className={styles.paydGreen}>payd-2</h3>
          </div>
          {!userLoaded && <h3>Error: Failed to load user, try refreshing!</h3>}
          {!isSignedIn && (
            <SignInButton>
              <button>
                <FontAwesomeIcon
                  icon={faSignIn}
                  className="fa-icon"
                ></FontAwesomeIcon>
              </button>
            </SignInButton>
          )}
          {!!isSignedIn && (
            <>
              <button onClick={showNewBillSubmit}>
                <FontAwesomeIcon icon={faSquarePlus} className="fa-icon" />
              </button>
              <button>
                <FontAwesomeIcon icon={faCircleQuestion} className="fa-icon" />
              </button>
              <SignOutButton>
                <button>
                  <FontAwesomeIcon icon={faSignOut} className="fa-icon" />
                </button>
              </SignOutButton>

              <Image
                src={user.profileImageUrl}
                alt="Profile Image"
                width={48}
                height={48}
              />
            </>
          )}
        </div>
        <div className={styles.formList}>
          <BillForm />
        </div>

        <div className={styles.billList}>
          {!isSignedIn && (
            <div>
              <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
              <h1>Welcome to Payd-2!</h1>
              <h2>Let&apos;s sign in to get started.</h2>
            </div>
          )}
          {!!isSignedIn && postsLoading && <LoadingSpinner />}
          {!!isSignedIn && (
            <div>
              {data?.map((bill) => (
                <BillFormating {...bill} key={bill.id} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
