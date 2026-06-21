import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import styles from "../../styles/shared/Sidebar.module.css";
import { useAppDispatch } from "../../store/hook";

interface SidebarProps {
  role?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/admin/flats", label: "Flats", icon: "🏢" },
  { path: "/admin/residents", label: "Residents", icon: "👥" },
  { path: "/admin/complaints", label: "Complaints", icon: "📋" },
  { path: "/admin/amenities", label: "Amenities", icon: "🏊" },
  { path: "/admin/billing", label: "Billing", icon: "💰" },
  { path: "/admin/notices", label: "Notices", icon: "📢" },
  { path: "/admin/visitors", label: "Visitors", icon: "🚪" },
  { path: "/admin/analytics", label: "Analytics", icon: "📊" },
];

const residentLinks = [
  { path: "/resident/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/resident/complaints", label: "My Complaints", icon: "📋" },
  { path: "/resident/amenities", label: "Amenities", icon: "🏊" },
  { path: "/resident/billing", label: "My Bills", icon: "💰" },
  { path: "/resident/visitors", label: "Visitors", icon: "🚪" },
  { path: "/resident/parcels", label: "Parcels", icon: "📦" },
  { path: "/resident/notices", label: "Notice Board", icon: "📢" },
];

const guardLinks = [
  { path: "/guard/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/guard/visitors", label: "Visitor Log", icon: "🚪" },
  { path: "/guard/parcels", label: "Parcel Log", icon: "📦" },
  { path: "/guard/approved", label: "Pre-approved", icon: "✅" },
];

function Sidebar({ role, isOpen }: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "RESIDENT"
        ? residentLinks
        : guardLinks;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.logo}>
        <h1>NestIQ</h1>
        <span className={styles.role}>{role}</span>
      </div>

      <nav className={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        🚪 Logout
      </button>
    </aside>
  );
}

export default Sidebar;
