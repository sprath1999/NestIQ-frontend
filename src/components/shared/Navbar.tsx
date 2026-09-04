import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import styles from "../../styles/shared/Navbar.module.css";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    flatNumber?: string;
  } | null;
  onMenuToggle?: () => void;
}

function Navbar({ user, onMenuToggle }: NavbarProps) {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle}>
          ☰
        </button>
        <h2 className={styles.greeting}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h2>
      </div>

      <div className={styles.right}>
        <div className={styles.notificationWrapper}>
          <div
            className={styles.notificationBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </div>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <span className={styles.notificationTitle}>Notifications</span>
                {unreadCount > 0 && (
                  <span className={styles.markAllRead} onClick={markAllAsRead}>
                    Mark all read
                  </span>
                )}
              </div>

              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div className={styles.noNotifications}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      className={`${styles.notificationItem} ${!n.read ? styles.unread : ""}`}
                    >
                      <div className={styles.notificationText}>{n.title}</div>
                      <div className={styles.notificationMessage}>
                        {n.message}
                      </div>
                      <div className={styles.notificationTime}>
                        {formatTime(n.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{user?.name}</span>
            {user?.flatNumber && (
              <span className={styles.flat}>Flat {user.flatNumber}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
