import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "../../styles/shared/Layout.module.css";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hook";

function Layout() {
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        // onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <div className={styles.main}>
        <Navbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
