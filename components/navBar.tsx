import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import styles from "../src/pages/index.module.css";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export function NavBar() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded)
    return (
      <div className={styles.topNav}>
        <div className={styles.navDate}>
          <h3 className={styles.paydGreen}>payd-2</h3>
        </div>
        <h3>Error: Failed to load user, try refreshing.</h3>
      </div>
    );

  return (
    <div className={styles.topNav}>
      <div className={styles.navDate}>
        <h3 className={styles.paydGreen}>payd-2</h3>
      </div>
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

          <img src={user.profileImageUrl} alt="Profile Image" />
        </>
      )}
    </div>
  );
}
