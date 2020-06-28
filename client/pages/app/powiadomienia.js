import Layout from "../../components/layout/Layout";
import Notifications from "../../components/app/Notifications";
import Replacements from "../../components/app/replacements";
import Head from "../../components/layout/Head";

const NotificationsPage = () => {
  return (
    <Layout>
      <Head title="Powiadomienia" />
      <div className="notification-page container">
        <Replacements />
        <h1 className="global-section-title notification-page__title">
          Powiadomienia
        </h1>
        <Notifications />
      </div>
    </Layout>
  );
};

export default NotificationsPage;
