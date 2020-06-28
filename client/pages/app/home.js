import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Header from "../../components/app/header";
import Timeline from "../../components/app/Timeline";
import Tasks from "../../components/app/Tasks";
import Head from "../../components/layout/Head";

const Home = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  return (
    <Layout>
      <Head title="Home" />
      <div className="app-home">
        <Header />
        <Timeline selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <Tasks selectedDay={selectedDay} />
      </div>
    </Layout>
  );
};

export default Home;
