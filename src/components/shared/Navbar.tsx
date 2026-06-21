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
        <div className={styles.notificationBtn}>
          🔔
          <span className={styles.badge}>3</span>
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
