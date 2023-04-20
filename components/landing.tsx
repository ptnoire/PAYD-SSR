import styles from "../src/pages/index.module.css";

export const LandingPage = () => {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.land_1}>
        <h1 className={styles.gradient_text}>Simple. No-nonsense.</h1>
      </div>
      <div className={styles.land_2}>
        <h2 className={styles.textItalic}>
          Managing your bills and finances can be a hassle, but it doesn&apos;t
          have to be. Say goodbye to the stress of bill management and hello to
          Payd. Keep track of all your bills and expenses in one place without
          having to share your banking details with anyone.
        </h2>
        <h2 className={styles.textItalic}>
          Add. Delete. Update. Organize. Track all your costs, view the history
          of each bill, see total monthly expenses. Take control of your money
          and manage your bills like a pro and stay on top of your finances
          effortlessly.
        </h2>
        <h1>Free to use. No Data Selling. No Ads.</h1>
      </div>
      <div className={styles.land_3}>
        <h3 className={styles.textItalic}>
          To help your make life a little easier.
        </h3>
        <h1 className={styles.gradient_text}>Bill Tracking.</h1>
      </div>
    </div>
  );
};
