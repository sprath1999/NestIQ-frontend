import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { complaintService } from "../../../services/complaintService";
import styles from "../../../styles/complaints/Complaints.module.css";

const categories = [
  "ELECTRICAL",
  "PLUMBING",
  "CLEANING",
  "ELEVATOR",
  "SECURITY",
  "INTERNET",
  "PARKING",
  "OTHER",
];

const filters = [
  "ALL",
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

type ComplaintForm = z.infer<typeof complaintSchema>;

function ResidentComplaints() {
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const queryClient = useQueryClient();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["myComplaints"],
    queryFn: complaintService.getMyComplaints,
  });

  const { mutate: createComplaint, isPending } = useMutation({
    mutationFn: complaintService.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
      setShowModal(false);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = (data: ComplaintForm) => {
    createComplaint(data);
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
        <h1 className={styles.pageTitle}>My Complaints</h1>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + Raise Complaint
        </button>
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
            {activeFilter === "ALL"
              ? "You have not raised any complaints yet"
              : `No complaints with status ${activeFilter}`}
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
                {complaint.resolutionNote && (
                  <span className={styles.assignedTo}>
                    Note: {complaint.resolutionNote}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Raise a Complaint</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title</label>
                <input
                  {...register("title")}
                  className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
                  placeholder="Brief title of the issue"
                />
                {errors.title && (
                  <span className={styles.errorText}>
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Category</label>
                <select {...register("category")} className={styles.select}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className={styles.errorText}>
                    {errors.category.message}
                  </span>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  {...register("description")}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                  placeholder="Describe the issue in detail"
                />
                {errors.description && (
                  <span className={styles.errorText}>
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentComplaints;
