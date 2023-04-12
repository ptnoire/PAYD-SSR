import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../src/pages/index.module.css";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

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

export default NavBar();
