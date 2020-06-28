import React from "react";

const Footer = ({ className = "" }) => {
  return (
    <footer className={`main-footer ${className}`}>
      <p className="main-footer__copy">
        Copyright &copy; 2020 | All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
