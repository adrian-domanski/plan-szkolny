import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Link from "next/link";
import { capitalize } from "../../helpers/helpers";
import moment from "moment";
moment.locale("pl");

const Header = () => {
  const [date, setDate] = useState(moment());
  const {
    authContext: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    const updateDate = setInterval(() => setDate(moment()), 1000);

    return () => clearInterval(updateDate);
  }, []);

  return (
    <header className="app-home-header">
      <img
        src="/img/app/home-header/768w.jpg"
        srcSet="/img/app/home-header/768w.jpg 768w,
                /img/app/home-header/1200w.jpg 1200w,
                /img/app/home-header/1920w.jpg 1920w"
        alt="Tło z kwiatami, widokiem na wode i góry"
        className="app-home-header__img"
      />
      <div className="app-home-header__content">
        <Link href="/app/moje-konto">
          <div className="avatar app-home-header__avatar">
            <img
              src={
                user.avatar
                  ? user.avatar.url
                  : "/img/app/avatar-placeholder.png"
              }
              alt="Zdjęcie użytkownika"
              className="avatar__img"
            />
          </div>
        </Link>
        <div className="app-home-header-welcome">
          <h1 className="app-home-header-welcome__title">
            Witaj {user && user.name}!
          </h1>
        </div>
        <div className="app-home-day">
          {capitalize(date.format("dddd, D MMMM | H:mm"))}
        </div>
      </div>
    </header>
  );
};

export default Header;
