import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitorService } from "../../../services/visitorService";
import styles from "../../../styles/visitors/Visitors.module.css";
import { useAppSelector } from "../../../store/hook";

function ResidentVisitors() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"visitors" | "parcels">(
    "visitors",
  );
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    visitorName: "",
    visitorPhone: "",
    purpose: "",
    expectedTime: "",
  });
  const queryClient = useQueryClient();

  const { data: visitors, isLoading: loadingVisitors } = useQuery({
    queryKey: ["myVisitors"],
    queryFn: visitorService.getMyVisitors,
  });

  const { data: parcels, isLoading: loadingParcels } = useQuery({
    queryKey: ["myParcels"],
    queryFn: visitorService.getMyParcels,
  });

  const { mutate: preApprove, isPending } = useMutation({
    mutationFn: visitorService.preApproveVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVisitors"] });
      setShowModal(false);
      setForm({
        visitorName: "",
        visitorPhone: "",
        purpose: "",
        expectedTime: "",
      });
    },
  });

  const { mutate: collectParcel } = useMutation({
    mutationFn: visitorService.markParcelCollected,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myParcels"] });
    },
  });

  const handleSubmit = () => {
    preApprove({
      ...form,
      flatNumber: user?.flatNumber || "N/A",
      residentName: user?.name || "",
      expectedTime: form.expectedTime
        ? new Date(form.expectedTime).toISOString()
        : null,
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Visitors & Parcels</h1>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + Pre-approve Visitor
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "visitors" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("visitors")}
        >
          My Visitors
        </button>
        <button
          className={`${styles.tab} ${activeTab === "parcels" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("parcels")}
        >
          My Parcels
        </button>
      </div>

      {activeTab === "visitors" &&
        (loadingVisitors ? (
          <div className={styles.loading}>Loading...</div>
        ) : visitors?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🚪</div>
            <p className={styles.emptyText}>No visitors yet</p>
          </div>
        ) : (
          <div className={styles.list}>
            {visitors?.map((v: any) => (
              <div key={v.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={styles.icon}>🚪</span>
                  <div className={styles.info}>
                    <span className={styles.name}>{v.visitorName}</span>
                    <span className={styles.subInfo}>
                      {v.purpose} · {v.visitorPhone}
                    </span>
                    <span className={styles.time}>
                      {v.preApproved
                        ? `Expected: ${formatDateTime(v.expectedTime)}`
                        : `Entry: ${formatDateTime(v.entryTime)}`}
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.badge} ${styles[`badge${v.status}`]}`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        ))}

      {activeTab === "parcels" &&
        (loadingParcels ? (
          <div className={styles.loading}>Loading...</div>
        ) : parcels?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <p className={styles.emptyText}>No parcels yet</p>
          </div>
        ) : (
          <div className={styles.list}>
            {parcels?.map((p: any) => (
              <div key={p.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={styles.icon}>📦</span>
                  <div className={styles.info}>
                    <span className={styles.name}>From: {p.sender}</span>
                    <span className={styles.subInfo}>
                      {p.description || "No description"}
                    </span>
                    <span className={styles.time}>
                      Arrived: {formatDateTime(p.arrivedAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  {p.collected ? (
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
                    >
                      Collected
                    </span>
                  ) : (
                    <button
                      className={styles.collectBtn}
                      onClick={() => collectParcel(p.id)}
                    >
                      Mark Collected
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Pre-approve Visitor</h2>
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Visitor Name</label>
                <input
                  className={styles.input}
                  value={form.visitorName}
                  onChange={(e) =>
                    setForm({ ...form, visitorName: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  value={form.visitorPhone}
                  onChange={(e) =>
                    setForm({ ...form, visitorPhone: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Purpose</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Family visit, Delivery"
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Expected Time</label>
                <input
                  type="datetime-local"
                  className={styles.input}
                  value={form.expectedTime}
                  onChange={(e) =>
                    setForm({ ...form, expectedTime: e.target.value })
                  }
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Pre-approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentVisitors;
