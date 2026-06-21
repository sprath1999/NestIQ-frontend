import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintService } from "../../../services/complaintService";
import styles from "../../../styles/complaints/Complaints.module.css";

const filters = [
  "ALL",
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];
const statuses = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function AdminComplaints() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    assignedTo: "",
    resolutionNote: "",
  });
  const queryClient = useQueryClient();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["allComplaints"],
    queryFn: complaintService.getAllComplaints,
  });

  const { mutate: updateComplaint, isPending } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      complaintService.updateComplaint(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
      setShowModal(false);
      setSelectedComplaint(null);
    },
  });

  const handleUpdate = () => {
    if (!selectedComplaint) return;
    updateComplaint({
      id: selectedComplaint.id,
      payload: updateForm,
    });
  };

  const openUpdateModal = (complaint: any) => {
    setSelectedComplaint(complaint);
    setUpdateForm({
      status: complaint.status,
      assignedTo: complaint.assignedTo || "",
      resolutionNote: complaint.resolutionNote || "",
    });
    setShowModal(true);
  };

  const filteredComplaints = complaints?.filter((c: any) =>
    activeFilter === "ALL" ? true : c.status === activeFilter,
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>All Complaints</h1>
        <span
          style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}
        >
          Total: {complaints?.length || 0}
        </span>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterActive : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {isLoading ? (
        <div className={styles.loading}>Loading complaints...</div>
      ) : filteredComplaints?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No complaints found</p>
          <p className={styles.emptySubtext}>
            No complaints with status {activeFilter}
          </p>
        </div>
      ) : (
        <div className={styles.complaintGrid}>
          {filteredComplaints?.map((complaint: any) => (
            <div key={complaint.id} className={styles.complaintCard}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{complaint.title}</h3>
                <span
                  className={`${styles.badge} ${styles[`badge${complaint.status}`]}`}
                >
                  {complaint.status.replace("_", " ")}
                </span>
              </div>

              <div className={styles.cardMeta}>
                <span className={styles.category}>{complaint.category}</span>
                <span className={styles.flat}>Flat {complaint.flatNumber}</span>
                <span className={styles.flat}>by {complaint.residentName}</span>
                <span className={styles.date}>
                  {formatDate(complaint.createdAt)}
                </span>
              </div>

              <p className={styles.description}>{complaint.description}</p>

              <div className={styles.cardBottom}>
                {complaint.assignedTo && (
                  <span className={styles.assignedTo}>
                    Assigned to: {complaint.assignedTo}
                  </span>
                )}
                <button
                  className={styles.addBtn}
                  onClick={() => openUpdateModal(complaint)}
                  style={{ padding: "6px 16px", fontSize: "var(--text-xs)" }}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {showModal && selectedComplaint && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Update Complaint</h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              {selectedComplaint.title}
            </p>

            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.select}
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, status: e.target.value })
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Assign To</label>
                <input
                  className={styles.input}
                  placeholder="Vendor or staff name"
                  value={updateForm.assignedTo}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, assignedTo: e.target.value })
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Resolution Note</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Add a note about the resolution"
                  value={updateForm.resolutionNote}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      resolutionNote: e.target.value,
                    })
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
                  onClick={handleUpdate}
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;
