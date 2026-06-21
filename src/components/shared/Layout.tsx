import { useAppSelector } from "../../store/hook";
import styles from "../../styles/shared/Layout.module.css";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <Sidebar role={user?.role} />
      <div className={styles.main}>
        <Navbar user={user} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
