import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

const Replacements = () => {
  const {
    authContext: { user }
  } = useContext(AuthContext);
  const [replacements, setReplacements] = useState("");

  useEffect(() => {
    if (user.class.replacements) {
      setReplacements(user.class.replacements);
    }
  }, [user]);

  return (
    <section className="replacements">
      <h1 className="global-section-title">Zastępstwa</h1>
      <ul className="replacements-links">
        {replacements ? (
          <>
            {replacements.today ? (
              <li className="replacements-links__item">
                <a
                  target="_blank"
                  href={replacements.today}
                  className="replacements-links__item-link">
                  Dzisiaj
                </a>
              </li>
            ) : null}
            {replacements.tomorrow ? (
              <li className="replacements-links__item">
                <a
                  target="_blank"
                  href={replacements.tomorrow}
                  className="replacements-links__item-link">
                  Jutro
                </a>
              </li>
            ) : null}
            {replacements.dayAfter ? (
              <li className="replacements-links__item">
                <a
                  target="_blank"
                  href={replacements.dayAfter}
                  className="replacements-links__item-link">
                  Pojutrze
                </a>
              </li>
            ) : null}
            {replacements.page ? (
              <li className="replacements-links__item">
                <a
                  target="_blank"
                  href={replacements.page}
                  className="replacements-links__item-link">
                  Strona
                </a>
              </li>
            ) : null}
          </>
        ) : (
          <p className="global-section-subtitle">Brak danych o zastępstwach</p>
        )}
      </ul>
    </section>
  );
};

export default Replacements;
