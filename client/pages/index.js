import React, { useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import Link from "next/link";
import Particles from "react-particles-js";
import particlesConfig from "../lib/particlesConfig.json";
import Head from "../components/layout/Head";

const Home = () => {
  const headerEl = useRef();
  const headerParticles = useRef();

  useEffect(() => {
    window.onload = () => {
      if (
        headerParticles.current.state.canvas.height <
        headerEl.current.offsetHeight
      ) {
        headerParticles.current.state.canvas.height =
          headerEl.current.offsetHeight;
      }
    };
  }, []);

  return (
    <Layout>
      <Head description="Nasza strona ma za zadanie pomóc Ci w organizacji twoich obowiązków szkolnych. Korzystając z naszej pomocy będziecie w stanie stworzyć jedno wspólne miejsce, w którym każdy znajdzie informacje o terminach najbliżyszch zadań i sprawdzianów szkolnych. Zapewniamy rozbudowany system zarządzania obowiązkami oraz zadaniami. Na pewno niejednokrotnie zdarzyło Ci się zapomnieć czegoś na zajęcia. Czasami konsekwencje nieodrobionej pracy domowej czy zapomnianej kartkówki, o której mowa była tydzień temu, bywają bardzo bolesne w skutkach. Jeżeli nie jesteś zainteresowany stworzeniem grupy klasowej, nic nie stoi na przeszkodzie abyś sam zaczął planowanie swoich obowiązków. Dołącz do grona zadowolonych uczniów już dziś, a przekonasz się o korzyściach wynikających z grupowej pracy." />
      <div className="home-page">
        <header className="home-page-header" ref={headerEl}>
          <img
            src="/img/hero-image/1200w.jpg"
            srcSet="/img/hero-image/1200w.jpg 1200w, /img/hero-image/1920w.jpg 1920w"
            alt="Biórko z planem tygodnia i długopisem"
            className="home-page-header__img"
          />

          <div className="hope-page-header-content">
            <Particles
              ref={headerParticles}
              className="home-page-header__particles"
              params={particlesConfig.header}
            />
            <div className="hope-page-header-content__wrapper">
              <h1 className="hope-page-header-content__title">
                plan-szkolny.pl
              </h1>
              <p className="hope-page-header-content__subtitle">
                Wszystko, o czym musisz pamiętać na jutro...
              </p>
            </div>
          </div>
        </header>
        <div className="home-page-wrapper">
          <main className="home-page-content container container--not-app">
            {/* What we offer */}
            <section className="home-page-content__section what-we-offer">
              <h1 className="home-page__title">Co oferujemy</h1>
              <div className="home-page-img">
                <img
                  src="/img/tasks.jpg"
                  className="home-page-img__img"
                  alt="Terminarz i kubek herbaty na stole"
                />
              </div>
              <p className="home-page__lead home-page__lead--mb">
                Nasza strona ma za zadanie pomóc Ci w organizacji twoich
                obowiązków szkolnych. Doskonale zdajemy sobie sprawę jak ciężko
                jest zapamiętać wszystkie zadania domowe, terminy sprawdzianów
                czy innych ważnych wydarzeń z życia szkoły.
              </p>

              <p className="home-page__lead">
                Na pewno niejednokrotnie zdarzyło Ci się zapomnieć czegoś na
                zajęcia. Czasami konsekwencje nieodrobionej pracy domowej czy
                zapomnianej kartkówki, o której mowa była tydzień temu, bywają
                bardzo bolesne w skutkach.
              </p>
            </section>
          </main>
          <section className="container home-page-content what-we-offer-grid container--not-app">
            {/* Class group */}
            <section className="home-page-content__section class-group">
              <h1 className="home-page__title">Grupa klasowa</h1>
              <div className="home-page-img">
                <img
                  src="/img/people.jpg"
                  className="home-page-img__img"
                  alt="Grupa znajomych obejmujących się rękoma"
                />
              </div>
              <p className="home-page__lead">
                Klasa powinna wspierać się wzajemnie. Korzystając z naszej
                strony będziecie w stanie stworzyć jedno wspólne miejsce, w
                którym każdy znajdzie odpowiedź na odwieczne pytanie -{" "}
                <b>"Mamy coś na jutro?"</b>
              </p>
            </section>
            {/* Individual account */}
            <section className="home-page-content__section individual-account">
              <h1 className="home-page__title">Konto indywidualne</h1>
              <div className="home-page-img">
                <img
                  src="/img/student.jpg"
                  className="home-page-img__img"
                  alt="Kobieta zasłaniająca twarz książką"
                />
              </div>
              <p className="home-page__lead">
                Jeżeli nie jesteś zainteresowany stworzeniem grupy klasowej, nic
                nie stoi na przeszkodzie abyś sam zaczął planowanie swoich
                obowiązków.
              </p>
            </section>
            {/* Group chat */}
            <section className="home-page-content__section group-chat">
              <h1 className="home-page__title">Grupowy chat</h1>
              <div className="home-page-img">
                <img
                  src="/img/chat.jpg"
                  className="home-page-img__img"
                  alt="Osoba pisząca wiadomość tekstową na tablecie"
                />
              </div>
              <p className="home-page__lead">
                Miejsc do wspólnej konwersacji nigdy nie jest za wiele. Czasami
                chcemy dopytać się klasy o szczegóły zadania, lub po prostu
                poruszyć interesujący nas temat niekoniecznie związany ze
                szkołą.
              </p>
            </section>
            {/* Comfortable content managment */}
            <section className="home-page-content__section content-menagment">
              <h1 className="home-page__title">Wygodne zarządzanie</h1>
              <div className="home-page-img">
                <img
                  src="/img/manage.jpg"
                  className="home-page-img__img"
                  alt="Osoba gestykulująca dłoniami, siedząca przed laptopem"
                />
              </div>
              <p className="home-page__lead home-page__lead--mb">
                Zapewniamy niezwykle intuicyjny i prosty w obsłudze a zarazem
                rozbudowany system planowania waszych obowiązków. Wyznaczcie
                osoby, które będą miały możliwość zarządzania treścią w waszej
                grupie.
              </p>
            </section>
          </section>
          <div className="home-page-content container container--not-app">
            {/* Join Us */}
            <section className="home-page-content__section join-us">
              <h1 className="home-page__title">Dołącz do nas</h1>
              <div className="home-page-img">
                <img
                  src="/img/together.jpg"
                  className="home-page-img__img"
                  alt="Grupa znajomych stojąca tyłem"
                />
              </div>
              <p className="home-page__lead">
                Dołącz do grona zadowolonych uczniów już dziś, a przekonasz się
                o korzyściach wynikających z grupowej pracy.
              </p>
            </section>
            {/* Register */}
            <section className="home-page-content__section home-page-content-register">
              <p className="home-page__lead home-page-content-register__text">
                <Link href="/rejestracja">
                  <button className="btn btn--theme home-page-content-register__btn">
                    Zarejestruj się
                  </button>
                </Link>{" "}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
