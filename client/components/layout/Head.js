import React from "react";
import NextHead from "next/head";

const Head = ({ title, description }) => {
  return (
    <NextHead>
      <title>{title ? `${title} | ` : null}Plan szkolny</title>
      <link rel="icon" href="/img/icon.png" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      {description ? <meta name="description" content={description} /> : null}
      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <link
        href="/img/icons/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="/img/icons/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link rel="apple-touch-icon" href="/img/icons/apple-icon-180x180.png" />
      <meta name="apple-mobile-web-app-status-bar" content="#ba75ff" />
      <meta name="theme-color" content="#ba75ff" />
    </NextHead>
  );
};

export default Head;
