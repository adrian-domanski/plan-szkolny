import React from "react";
import Navbar from "./Navbar/Navbar";
import Head from "./Head";

const Header = () => {
  return (
    <header className="l-header">
      <Head />
      <Navbar />
    </header>
  );
};

export default Header;
