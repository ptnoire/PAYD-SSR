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
import { LoadingSpinner } from "components/loading";
import { LandingPage } from "components/landing";
import Link from "next/link";
import { useRef } from "react";
import { BillList } from "components/billList";

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
                  href="https://github.com/ptnoire/PAYD-SSR/blob/main/README.md#payd-2"
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
                    Ready?<br></br>
                    <span className={styles.textItalic}>
                      No sign-up required!
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
                    Payd-1?<br></br>{" "}
                    <span className={styles.textItalic}>View the beta!</span>
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
