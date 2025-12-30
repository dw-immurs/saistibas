const Footer = () => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <span>
        Saistības. Saturs un latviskošana: © {startYear}
        {currentYear > startYear && `—${currentYear}`}{" "}
        <a
          href="https://dw-https://x.com/dw_immurs"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Dāvis Valters Immurs
        </a>
      </span>
    </footer>
  );
};

const styles = {
  footer: {
    padding: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#666",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default Footer;
