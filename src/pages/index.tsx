import styles from "./index.module.css";
import { type NextPage } from "next";
import { BillForm } from "components/billForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faMoneyBill,
  faSignIn,
  faSignOut,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { LoadingSpinner } from "components/loading";
import { LandingPage } from "components/landing";
import Link from "next/link";
import { useRef } from "react";
import type { ReactElement } from "react";
import ReactDOM from "react-dom";
import { BillList } from "components/billList";
import type { UserData } from "components/billList";

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

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const myRef = useRef<HTMLDivElement>(null);

  const { data } = api.bills.getUserBills.useQuery();
  const userData = data as UserData;

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
          {!!isSignedIn && <BillList {...userData} />}
        </div>
      </main>
      <div ref={myRef}>{!isSignedIn && userLoaded && <LandingPage />}</div>
      <div className="modal hidden"></div>
      <div className="backdrop hidden"></div>
    </>
  );
};

export default Home;
