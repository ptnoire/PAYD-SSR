import styles from "../src/pages/index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faSmileBeam,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const NewListDisplay = () => {
  return (
    <div className="center">
      <FontAwesomeIcon icon={faSmileBeam} className="fa-icon" />
      <h1 className={styles.welcomeTitle}>Welcome!</h1>
      <h2>Let&apos;s get it started in here!</h2>
      <h3 className={styles.textItalic}>
        At the top of this screen, you&apos;ll see a plus sign icon:{" "}
        <FontAwesomeIcon icon={faSquarePlus} />
        <br />
        click that to add a new bill, a form should appear!
      </h3>
      <p className={styles.textItalic}>
        If have any questions or want some help, please click the{" "}
        <FontAwesomeIcon icon={faCircleQuestion} />
        <br /> icon at the top or click{" "}
        <Link
          href="https://github.com/ptnoire/PAYD-bill-tracker/blob/master/README.md#its-payd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.gradient_text}>here</span>.
        </Link>
      </p>
    </div>
  );
};
