import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import styles from "../../../styles/dashboard/AdminDashboard.module.css";

const revenueData = [
  { month: "Jan", collected: 185000, pending: 15000 },
  { month: "Feb", collected: 192000, pending: 8000 },
  { month: "Mar", collected: 178000, pending: 22000 },
  { month: "Apr", collected: 195000, pending: 5000 },
  { month: "May", collected: 188000, pending: 12000 },
  { month: "Jun", collected: 201000, pending: 9000 },
];

const complaintStatusData = [
  { name: "Open", value: 12, color: "#f59e0b" },
  { name: "In Progress", value: 8, color: "#3b82f6" },
  { name: "Resolved", value: 45, color: "#22c55e" },
];

const recentActivity = [
  { icon: "🚪", text: "Visitor logged at Gate A", time: "2 mins ago" },
  { icon: "📦", text: "Parcel arrived for Flat B-204", time: "15 mins ago" },
  { icon: "📋", text: "New complaint from Flat A-101", time: "32 mins ago" },
  { icon: "💰", text: "Maintenance paid by Flat C-305", time: "1 hour ago" },
  { icon: "🏊", text: "Pool booked by Flat D-102", time: "2 hours ago" },
];

const recentComplaints = [
  { title: "Water leakage in bathroom", flat: "Flat A-101", status: "Open" },
  { title: "Elevator not working", flat: "Flat B-302", status: "In Progress" },
  { title: "Street light broken", flat: "Flat C-205", status: "Open" },
  { title: "Noise complaint", flat: "Flat D-401", status: "Resolved" },
];

const stats = [
  {
    label: "Total Flats",
    value: "120",
    icon: "🏢",
    change: "+2 this month",
    colorClass: styles.iconBlue,
  },
  {
    label: "Total Residents",
    value: "348",
    icon: "👥",
    change: "+5 this month",
    colorClass: styles.iconGreen,
  },
  {
    label: "Pending Bills",
    value: "23",
    icon: "💰",
    change: "₹1.2L due",
    colorClass: styles.iconOrange,
  },
  {
    label: "Open Complaints",
    value: "12",
    icon: "📋",
    change: "3 urgent",
    colorClass: styles.iconRed,
  },
];

function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statChange}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Monthly Revenue Collection</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stackId="1"
                stroke="#2563eb"
                fill="#eff6ff"
                name="Collected"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#f59e0b"
                fill="#fff7ed"
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Complaint Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={complaintStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {complaintStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {recentActivity.map((item, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>{item.icon}</div>
                <div className={styles.activityInfo}>
                  <p className={styles.activityText}>{item.text}</p>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Complaints</h3>
          <div className={styles.complaintList}>
            {recentComplaints.map((item, index) => (
              <div key={index} className={styles.complaintItem}>
                <div className={styles.complaintInfo}>
                  <span className={styles.complaintTitle}>{item.title}</span>
                  <span className={styles.complaintFlat}>{item.flat}</span>
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
    </div>
  );
}

export default AdminDashboard;
