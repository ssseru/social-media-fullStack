import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.text}>
        Made with love by{" "}
        <span className={styles.footerName}>Sai Sagar Seru</span>
      </div>
      <div className={styles.text}>Never stop chatting</div>
    </div>
  );
};

export default Footer;
