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

const BillList = () => {
  const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  return (
    <div>
      {data?.map((bill) => (
        <BillFormating {...bill} key={bill.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  return (
    <>
      <main className={styles.main}>
        <div className={styles.topNav}>
          <div className={styles.navDate}>
            <h3 className={styles.paydGreen}>payd-2</h3>
          </div>

          {/* User Failed to Load */}
          {!userLoaded && <LoadingSpinner />}

          {/* Not Signed In Nav Bar */}
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

          {/* Signed In Nav Bar */}
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

        {!!isSignedIn && (
          <div className={styles.formList}>
            <BillForm />
          </div>
        )}

        <div className={styles.billList}>
          {!userLoaded && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
          {!isSignedIn && userLoaded && (
            <div className={styles.container}>
              <FontAwesomeIcon icon={faMoneyBill} className="fa-icon" />
              <h1 className={styles.welcomeTitle}>Welcome to payd-2</h1>
              <h2 className={styles.zIndex2}>
                Let&apos;s sign in to get started.
              </h2>
              <video
                autoPlay
                loop
                muted
                src="https://cdn.coverr.co/videos/coverr-three-dollars-1756/1080p.mp4"
              ></video>
            </div>
          )}
          {!!isSignedIn && <BillList />}
        </div>
      </main>
    </>
  );
};

export default Home;
