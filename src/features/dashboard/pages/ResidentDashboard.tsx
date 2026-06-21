import { useAppSelector } from "../../../store/hook";
import styles from "../../../styles/dashboard/ResidentDashboard.module.css";
import { useNavigate } from "react-router-dom";

const complaints = [
  {
    title: "Water leakage in bathroom",
    date: "Jun 18, 2026",
    status: "In Progress",
  },
  { title: "Broken window latch", date: "Jun 10, 2026", status: "Resolved" },
  { title: "AC not working", date: "Jun 20, 2026", status: "Open" },
];

const notifications = [
  {
    icon: "🚪",
    text: "Your visitor John has arrived at Gate A",
    time: "5 mins ago",
  },
  { icon: "📦", text: "Parcel received at security desk", time: "1 hour ago" },
  {
    icon: "📢",
    text: "Society meeting on June 25 at 6PM",
    time: "2 hours ago",
  },
  {
    icon: "💰",
    text: "Maintenance bill generated for July",
    time: "1 day ago",
  },
];

const amenities = [
  { icon: "🏊", name: "Swimming Pool", time: "Available 6AM - 9PM" },
  { icon: "🏸", name: "Badminton Court", time: "Available 5AM - 10PM" },
  { icon: "🏋️", name: "Gym", time: "Available 24/7" },
  { icon: "🎉", name: "Clubhouse", time: "Available 9AM - 11PM" },
];

const stats = [
  {
    label: "Maintenance Due",
    value: "₹3,500",
    icon: "💰",
    sub: "Due July 1",
    colorClass: "iconOrange",
  },
  {
    label: "My Complaints",
    value: "3",
    icon: "📋",
    sub: "1 open",
    colorClass: "iconRed",
  },
  {
    label: "Amenity Bookings",
    value: "2",
    icon: "🏊",
    sub: "This month",
    colorClass: "iconBlue",
  },
  {
    label: "Visitors Today",
    value: "1",
    icon: "🚪",
    sub: "Pre-approved",
    colorClass: "iconGreen",
  },
];

function ResidentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        My Dashboard — Flat {user?.flatNumber || "N/A"}
      </h1>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[stat.colorClass]}`}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statSub}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Bill + Complaints */}
      <div className={styles.grid}>
        <div className={styles.billCard}>
          <span className={styles.billLabel}>Current Maintenance Bill</span>
          <span className={styles.billAmount}>₹3,500</span>
          <span className={styles.billDue}>Due: July 1, 2026</span>
          <span className={styles.billStatus}>Unpaid</span>
          <button
            className={styles.payBtn}
            onClick={() => navigate("/resident/billing")}
          >
            Pay Now →
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>My Complaints</h3>
            <span
              className={styles.viewAll}
              onClick={() => navigate("/resident/complaints")}
            >
              View all
            </span>
          </div>
          <div className={styles.complaintList}>
            {complaints.map((item, index) => (
              <div key={index} className={styles.complaintItem}>
                <div className={styles.complaintInfo}>
                  <span className={styles.complaintTitle}>{item.title}</span>
                  <span className={styles.complaintDate}>{item.date}</span>
                </div>
                <span
                  className={`${styles.badge} ${
                    item.status === "Open"
                      ? styles.badgeOpen
                      : item.status === "In Progress"
                        ? styles.badgeProgress
                        : styles.badgeResolved
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications + Amenities */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Notifications</h3>
            <span className={styles.viewAll}>Mark all read</span>
          </div>
          <div className={styles.notificationList}>
            {notifications.map((item, index) => (
              <div key={index} className={styles.notificationItem}>
                <div className={styles.notifIcon}>{item.icon}</div>
                <div className={styles.notifInfo}>
                  <p className={styles.notifText}>{item.text}</p>
                  <span className={styles.notifTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Book Amenities</h3>
            <span
              className={styles.viewAll}
              onClick={() => navigate("/resident/amenities")}
            >
              View all
            </span>
          </div>
          <div className={styles.amenityList}>
            {amenities.map((item, index) => (
              <div key={index} className={styles.amenityItem}>
                <div className={styles.amenityLeft}>
                  <span className={styles.amenityIcon}>{item.icon}</span>
                  <div className={styles.amenityInfo}>
                    <span className={styles.amenityName}>{item.name}</span>
                    <span className={styles.amenityTime}>{item.time}</span>
                  </div>
                </div>
                <button className={styles.bookBtn}>Book</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;
