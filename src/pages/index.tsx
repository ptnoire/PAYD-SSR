import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
// import NavBar from "components/navBar";

const NavBar = () => {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  console.log(user);

  return (
    <div className={styles.topNav}>
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
          <SignOutButton>
            <button>
              <FontAwesomeIcon icon={faSignOut} className="fa-icon" />
            </button>
          </SignOutButton>

          <img src={user.profileImageUrl} />
        </>
      )}
    </div>
  );
};

const Home: NextPage = () => {
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
          <h1>Welcome to Payd-2!</h1>
        </div>
      </main>
    </>
  );
};

export default Home;
