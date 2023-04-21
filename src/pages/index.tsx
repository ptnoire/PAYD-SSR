import styles from "./index.module.css";
import { type NextPage } from "next";
import { BillForm } from "components/billForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faMoneyBill,
  faMoneyCheck,
  faSignIn,
  faSignOut,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { BillFormating } from "components/billListFormat";
import { LoadingSpinner } from "components/loading";
import { LandingPage } from "components/landing";
import Link from "next/link";
import { ReactElement, ReactNode, useRef } from "react";
import { NewListDisplay } from "components/newList";
import { convertCurr } from "~/helpers/convert";
import ReactDOM from "react-dom";

const showNewBillSubmit = () => {
  const form = document.querySelector(".formInput");
  if (!form) return;
  form.classList.toggle("hidden");
};

const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export const ModalRender = (content: ReactElement) => {
  document.querySelector(".backdrop")?.classList.remove("hidden");
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal?.classList.remove("hidden");
  if (!content) return;
  ReactDOM.render(content, modal);
};

export const CloseModal = () => {
  const modal = document.querySelector(".modal");
  if (modal) {
    ReactDOM.unmountComponentAtNode(modal);
    modal.classList.add("hidden");
  }
  const backdrop = document.querySelector(".backdrop");
  if (backdrop) {
    backdrop.classList.add("hidden");
  }
};

const BillList = () => {
  const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();
  const { data: sumReports } = api.bills.getTotals.useQuery();
  const today = new Date();

  if (postsLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  if (!data || data.length === 0) return <NewListDisplay />;

  return (
    <>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyCheck} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>Today&apos;s Date: </span>
          {today.toLocaleDateString()}
        </h3>
        <h3>
          <span className={styles.textItalic}>Current Balance: </span>
          {(typeof sumReports?.currBalance === "number" &&
            convertCurr(sumReports?.currBalance)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyBill} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>
            This Month&apos;s Expenses:{" "}
          </span>
          {(typeof sumReports?.monthExpense === "number" &&
            convertCurr(sumReports?.monthExpense)) ||
            convertCurr(0)}
        </h3>
        <h3>
          <span className={styles.textItalic}>Total Monthly Expenses: </span>
          {(typeof sumReports?.expenses === "number" &&
            convertCurr(sumReports?.expenses)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div>
        {data?.map((bill) => (
          <BillFormating {...bill} key={bill.id} />
        ))}
      </div>
    </>
  );
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const myRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    scrollTo(myRef);
  };

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
                <Link
                  href="https://github.com/ptnoire/PAYD-bill-tracker/blob/master/README.md#its-payd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className="fa-icon"
                  />
                </Link>
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
              <h3 className={styles.textPop}>
                Simple. No-nonsense. Bill Tracking.
              </h3>
              <div className={styles.landingC2}>
                <div className={styles.c2_1}>
                  <h2>
                    Returning?<br></br>
                    <span className={styles.textItalic}>
                      Let&apos;s sign-in!
                    </span>
                  </h2>

                  <SignInButton>
                    <button>
                      <FontAwesomeIcon
                        icon={faSignIn}
                        className="fa-icon"
                      ></FontAwesomeIcon>
                    </button>
                  </SignInButton>
                </div>
                <div className={styles.c2_2}>
                  <h2>
                    New?<br></br>
                    <span className={styles.textItalic}>
                      Scroll to learn more!
                    </span>
                  </h2>
                  <button onClick={handleClick}>
                    <FontAwesomeIcon icon={faArrowDown} className="fa-icon" />
                  </button>
                </div>
                <div className={styles.c2_3}>
                  <h2>
                    Curious?<br></br>{" "}
                    <span className={styles.textItalic}>Try the demo!</span>
                  </h2>
                  <button>
                    <Link
                      href="https://ptnoire.github.io/PAYD-bill-tracker/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="fa-icon"
                      />
                    </Link>
                  </button>
                </div>
              </div>

              <video
                autoPlay
                loop
                muted
                src="https://cdn.coverr.co/videos/coverr-ocean-sequence-8009/1080p.mp4"
              ></video>
            </div>
          )}
          {!!isSignedIn && <BillList />}
        </div>
      </main>
      <div ref={myRef}>{!isSignedIn && userLoaded && <LandingPage />}</div>
      <div className="modal hidden"></div>
      <div className="backdrop hidden"></div>
    </>
  );
};

export default Home;
