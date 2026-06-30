import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitorService } from "../../../services/visitorService";
// import styles from "../../../styles/visitors/Visitors.module.css";
import styles from "../../../styles/visitors/Visitors.module.css";

function GuardVisitors() {
  const [activeTab, setActiveTab] = useState<
    "visitors" | "parcels" | "preapproved"
  >("visitors");
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    visitorName: "",
    visitorPhone: "",
    purpose: "",
    flatNumber: "",
    residentName: "",
  });
  const [parcelForm, setParcelForm] = useState({
    flatNumber: "",
    residentName: "",
    sender: "",
    description: "",
  });
  const queryClient = useQueryClient();

  const { data: visitors, isLoading: loadingVisitors } = useQuery({
    queryKey: ["allVisitors"],
    queryFn: visitorService.getAllVisitors,
  });

  const { data: parcels, isLoading: loadingParcels } = useQuery({
    queryKey: ["allParcels"],
    queryFn: visitorService.getAllParcels,
  });

  const { data: preApproved, isLoading: loadingPreApproved } = useQuery({
    queryKey: ["preApprovedVisitors"],
    queryFn: visitorService.getPreApprovedVisitors,
  });

  const { mutate: logEntry, isPending: loggingEntry } = useMutation({
    mutationFn: visitorService.logEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allVisitors"] });
      setShowVisitorModal(false);
      setVisitorForm({
        visitorName: "",
        visitorPhone: "",
        purpose: "",
        flatNumber: "",
        residentName: "",
      });
    },
  });

  const { mutate: logExit } = useMutation({
    mutationFn: visitorService.logExit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allVisitors"] });
    },
  });

  const { mutate: logParcel, isPending: loggingParcel } = useMutation({
    mutationFn: visitorService.logParcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allParcels"] });
      setShowParcelModal(false);
      setParcelForm({
        flatNumber: "",
        residentName: "",
        sender: "",
        description: "",
      });
    },
  });

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
        <h1 className={styles.pageTitle}>Visitor & Parcel Management</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className={styles.addBtn}
            onClick={() => setShowVisitorModal(true)}
          >
            + Log Visitor
          </button>
          <button
            className={styles.addBtn}
            onClick={() => setShowParcelModal(true)}
          >
            + Log Parcel
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "visitors" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("visitors")}
        >
          All Visitors
        </button>
        <button
          className={`${styles.tab} ${activeTab === "preapproved" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("preapproved")}
        >
          Pre-approved Today
        </button>
        <button
          className={`${styles.tab} ${activeTab === "parcels" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("parcels")}
        >
          Parcels
        </button>
      </div>

      {activeTab === "visitors" &&
        (loadingVisitors ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.list}>
            {visitors?.map((v: any) => (
              <div key={v.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={styles.icon}>🚪</span>
                  <div className={styles.info}>
                    <span className={styles.name}>{v.visitorName}</span>
                    <span className={styles.subInfo}>
                      {v.purpose} · Flat {v.flatNumber} · {v.visitorPhone}
                    </span>
                    <span className={styles.time}>
                      Entry: {formatDateTime(v.entryTime)}
                      {v.exitTime && ` · Exit: ${formatDateTime(v.exitTime)}`}
                    </span>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span
                    className={`${styles.badge} ${styles[`badge${v.status}`]}`}
                  >
                    {v.status}
                  </span>
                  {v.status === "INSIDE" && (
                    <button
                      className={styles.exitBtn}
                      onClick={() => logExit(v.id)}
                    >
                      Log Exit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

      {activeTab === "preapproved" &&
        (loadingPreApproved ? (
          <div className={styles.loading}>Loading...</div>
        ) : preApproved?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✅</div>
            <p className={styles.emptyText}>No pre-approved visitors</p>
          </div>
        ) : (
          <div className={styles.list}>
            {preApproved?.map((v: any) => (
              <div key={v.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={styles.icon}>✅</span>
                  <div className={styles.info}>
                    <span className={styles.name}>{v.visitorName}</span>
                    <span className={styles.subInfo}>
                      {v.purpose} · Flat {v.flatNumber}
                    </span>
                    <span className={styles.time}>
                      Expected: {formatDateTime(v.expectedTime)}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.actionBtn}
                  onClick={() =>
                    logEntry({
                      visitorName: v.visitorName,
                      visitorPhone: v.visitorPhone,
                      purpose: v.purpose,
                      flatNumber: v.flatNumber,
                      residentName: v.residentName,
                      residentId: v.residentId,
                    })
                  }
                >
                  Allow Entry
                </button>
              </div>
            ))}
          </div>
        ))}

      {activeTab === "parcels" &&
        (loadingParcels ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.list}>
            {parcels?.map((p: any) => (
              <div key={p.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={styles.icon}>📦</span>
                  <div className={styles.info}>
                    <span className={styles.name}>
                      Flat {p.flatNumber} - {p.residentName}
                    </span>
                    <span className={styles.subInfo}>From: {p.sender}</span>
                    <span className={styles.time}>
                      Logged: {formatDateTime(p.arrivedAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={styles.badge}
                  style={{
                    backgroundColor: p.collected ? "#dcfce7" : "#fef3c7",
                    color: p.collected ? "#16a34a" : "#d97706",
                  }}
                >
                  {p.collected ? "Collected" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        ))}

      {showVisitorModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowVisitorModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Log Visitor Entry</h2>
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Visitor Name</label>
                <input
                  className={styles.input}
                  value={visitorForm.visitorName}
                  onChange={(e) =>
                    setVisitorForm({
                      ...visitorForm,
                      visitorName: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  value={visitorForm.visitorPhone}
                  onChange={(e) =>
                    setVisitorForm({
                      ...visitorForm,
                      visitorPhone: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Purpose</label>
                <input
                  className={styles.input}
                  value={visitorForm.purpose}
                  onChange={(e) =>
                    setVisitorForm({ ...visitorForm, purpose: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Flat Number</label>
                <input
                  className={styles.input}
                  value={visitorForm.flatNumber}
                  onChange={(e) =>
                    setVisitorForm({
                      ...visitorForm,
                      flatNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Resident Name</label>
                <input
                  className={styles.input}
                  value={visitorForm.residentName}
                  onChange={(e) =>
                    setVisitorForm({
                      ...visitorForm,
                      residentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowVisitorModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={() => logEntry(visitorForm)}
                  disabled={loggingEntry}
                >
                  {loggingEntry ? "Logging..." : "Log Entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showParcelModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowParcelModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Log Parcel</h2>
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Flat Number</label>
                <input
                  className={styles.input}
                  value={parcelForm.flatNumber}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, flatNumber: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Resident Name</label>
                <input
                  className={styles.input}
                  value={parcelForm.residentName}
                  onChange={(e) =>
                    setParcelForm({
                      ...parcelForm,
                      residentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Sender</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Amazon, Flipkart"
                  value={parcelForm.sender}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, sender: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description</label>
                <input
                  className={styles.input}
                  placeholder="Optional"
                  value={parcelForm.description}
                  onChange={(e) =>
                    setParcelForm({
                      ...parcelForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowParcelModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={() => logParcel(parcelForm)}
                  disabled={loggingParcel}
                >
                  {loggingParcel ? "Logging..." : "Log Parcel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuardVisitors;
