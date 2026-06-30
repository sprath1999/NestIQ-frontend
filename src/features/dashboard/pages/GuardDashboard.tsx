import { useAppSelector } from "../../../store/hook";
import styles from "../../../styles/dashboard/GuardDashboard.module.css";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Visitors Today",
    value: "14",
    icon: "🚪",
    sub: "3 currently inside",
    colorClass: "iconBlue",
  },
  {
    label: "Parcels Logged",
    value: "6",
    icon: "📦",
    sub: "2 uncollected",
    colorClass: "iconOrange",
  },
  {
    label: "Pre-approved",
    value: "4",
    icon: "✅",
    sub: "Expected today",
    colorClass: "iconGreen",
  },
  {
    label: "Alerts Sent",
    value: "1",
    icon: "🚨",
    sub: "Today",
    colorClass: "iconRed",
  },
];

const recentVisitors = [
  { name: "Rahul Sharma", flat: "Flat A-101", time: "10:30 AM", status: "In" },
  { name: "Priya Singh", flat: "Flat B-202", time: "11:00 AM", status: "Out" },
  { name: "Delivery Boy", flat: "Flat C-303", time: "11:45 AM", status: "In" },
  { name: "Amit Kumar", flat: "Flat D-404", time: "12:15 PM", status: "Out" },
];

const recentParcels = [
  { flat: "Flat A-101", time: "9:00 AM", icon: "📦" },
  { flat: "Flat B-202", time: "10:15 AM", icon: "📦" },
  { flat: "Flat C-303", time: "11:30 AM", icon: "📦" },
];

const preApproved = [
  { name: "Sunita Devi", flat: "Flat A-101", time: "Expected 2:00 PM" },
  { name: "Ravi Plumber", flat: "Flat B-302", time: "Expected 3:30 PM" },
  { name: "Pizza Delivery", flat: "Flat D-401", time: "Expected 7:00 PM" },
];

function GuardDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleEmergency = () => {
    console.log(user);

    if (window.confirm("Send emergency alert to ALL residents?")) {
      alert("Emergency alert sent to all residents!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Guard Dashboard</h1>

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

      {/* Emergency Button */}
      <button className={styles.emergencyBtn} onClick={handleEmergency}>
        🚨 SEND EMERGENCY ALERT TO ALL RESIDENTS
      </button>

      {/* Visitors + Parcels */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Visitors</h3>
            <button
              className={styles.logBtn}
              onClick={() => navigate("/guard/visitors")}
            >
              + Log Visitor
            </button>
          </div>
          <div className={styles.visitorList}>
            {recentVisitors.map((item, index) => (
              <div key={index} className={styles.visitorItem}>
                <div className={styles.visitorInfo}>
                  <span className={styles.visitorName}>{item.name}</span>
                  <span className={styles.visitorFlat}>{item.flat}</span>
                  <span className={styles.visitorTime}>{item.time}</span>
                </div>
                <span
                  className={`${styles.badge} ${
                    item.status === "In" ? styles.badgeIn : styles.badgeOut
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Parcels Logged</h3>
            <button
              className={styles.logBtn}
              onClick={() => navigate("/guard/visitors")}
            >
              + Log Parcel
            </button>
          </div>
          <div className={styles.parcelList}>
            {recentParcels.map((item, index) => (
              <div key={index} className={styles.parcelItem}>
                <span className={styles.parcelIcon}>{item.icon}</span>
                <div className={styles.parcelInfo}>
                  <span className={styles.parcelFlat}>{item.flat}</span>
                  <span className={styles.parcelTime}>
                    Logged at {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-approved Visitors */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Pre-approved Visitors Today</h3>
        </div>
        <div className={styles.preApprovedList}>
          {preApproved.map((item, index) => (
            <div key={index} className={styles.preApprovedItem}>
              <div className={styles.preApprovedInfo}>
                <span className={styles.preApprovedName}>{item.name}</span>
                <span className={styles.preApprovedFlat}>
                  {item.flat} · {item.time}
                </span>
              </div>
              <button
                className={styles.allowBtn}
                onClick={() => navigate("/guard/visitors")}
              >
                Allow Entry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuardDashboard;
