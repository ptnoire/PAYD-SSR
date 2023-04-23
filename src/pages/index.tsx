import styles from "./index.module.css";
import { type NextPage } from "next";
import { BillForm } from "components/billForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faMoneyCheck,
  faMoneyBill,
  faSignIn,
  faSignOut,
  faSquarePlus,
  faClose,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { LoadingSpinner } from "components/loading";
import { LandingPage } from "components/landing";
import Link from "next/link";
import { useRef } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { NewListDisplay } from "components/newList";
import { convertCurr } from "~/helpers/convert";
import { BillFormating } from "components/billListFormat";
import { BillHistoryComponent } from "components/history";

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
  if (!content) return;
  const backdrop = document.querySelector(".backdrop");
  const modal = document.querySelector(".modal");
  const root = createRoot(modal!);
  const closeModal = () => {
    root.unmount();
    backdrop?.classList.add("hidden");
    modal?.classList.add("hidden");
  };

  backdrop?.classList.remove("hidden");
  modal?.classList.remove("hidden");
  root.render(
    <>
      <button className="modal_close" onClick={closeModal}>
        <FontAwesomeIcon icon={faClose} className="fa-icon" />
      </button>
      {content}
      <div className="center">
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} className="fa-icon" />
        </button>
      </div>
    </>
  );
  backdrop?.addEventListener("click", closeModal);
};

const BillList = () => {
  const { data, isLoading: postsLoading } = api.bills.getUserBills.useQuery();
  const today = new Date();

  if (postsLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  if (!data || data.userBills.bills.length === 0) return <NewListDisplay />;

  return (
    <>
      {data.userHistory && data.userHistory.length !== 0 && (
        <div className={styles.optionsRow}>
          <button
            onClick={(e) => {
              e.preventDefault();
              ModalRender(
                <BillHistoryComponent
                  history={...data.userHistory}
                  title={"Account"}
                />
              );
            }}
          >
            <FontAwesomeIcon icon={faHistory} className="fa-icon" />
          </button>
        </div>
      )}
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyCheck} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>Today&apos;s Date: </span>
          {today.toLocaleDateString()}
        </h3>
        <h3>
          <span className={styles.textItalic}>Current Balance: </span>
          {(typeof data?.currBalance === "number" &&
            convertCurr(data?.currBalance)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div className={styles.expenseRow}>
        <FontAwesomeIcon icon={faMoneyBill} className="fa-icon hideMobile" />
        <h3>
          <span className={styles.textItalic}>
            This Month&apos;s Expenses:{" "}
          </span>
          {(typeof data?.monthExpense === "number" &&
            convertCurr(data?.monthExpense)) ||
            convertCurr(0)}
        </h3>
        <h3>
          <span className={styles.textItalic}>Total Monthly Expenses: </span>
          {(typeof data?.expenses === "number" &&
            convertCurr(data?.expenses)) ||
            convertCurr(0)}
        </h3>
      </div>
      <div>
        {data.userBills.bills?.map((bill) => (
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
          {!userLoaded && <LoadingSpinner />}

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
