import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticeService } from "../../../services/noticeService";
import styles from "../../../styles/notices/Notices.module.css";
import { useAppSelector } from "../../../store/hook";

const categories = [
  "General",
  "Maintenance",
  "Event",
  "Emergency",
  "Payment",
  "Other",
];

function NoticeBoard() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "General",
    pinned: false,
  });
  const queryClient = useQueryClient();

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: noticeService.getAllNotices,
  });

  const { mutate: createNotice, isPending: creating } = useMutation({
    mutationFn: noticeService.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setShowModal(false);
      resetForm();
    },
  });

  const { mutate: updateNotice, isPending: updating } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      noticeService.updateNotice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setShowModal(false);
      resetForm();
    },
  });

  const { mutate: deleteNotice } = useMutation({
    mutationFn: noticeService.deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  const resetForm = () => {
    setForm({ title: "", content: "", category: "General", pinned: false });
    setEditingNotice(null);
  };

  const openEdit = (notice: any) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      pinned: notice.pinned,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    if (editingNotice) {
      updateNotice({ id: editingNotice.id, payload: form });
    } else {
      createNotice(form);
    }
  };

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
        <h1 className={styles.pageTitle}>Notice Board</h1>
        {isAdmin && (
          <button
            className={styles.addBtn}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Post Notice
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading notices...</div>
      ) : notices?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📢</div>
          <p className={styles.emptyText}>No notices posted yet</p>
        </div>
      ) : (
        <div className={styles.noticeGrid}>
          {notices?.map((notice: any) => (
            <div
              key={notice.id}
              className={`${styles.noticeCard} ${notice.pinned ? styles.noticeCardPinned : ""}`}
            >
              <div className={styles.noticeHeader}>
                <h3 className={styles.noticeTitle}>
                  {notice.pinned && (
                    <span className={styles.pinnedIcon}>📌</span>
                  )}
                  {notice.title}
                </h3>
                {isAdmin && (
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(notice)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        if (window.confirm("Delete this notice?")) {
                          deleteNotice(notice.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.noticeMeta}>
                <span className={styles.category}>{notice.category}</span>
                <span className={styles.date}>
                  {formatDate(notice.createdAt)}
                </span>
              </div>

              <p className={styles.noticeContent}>{notice.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingNotice ? "Edit Notice" : "Post Notice"}
            </h2>
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  placeholder="Notice title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Content</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Write the notice content here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={form.pinned}
                  onChange={(e) =>
                    setForm({ ...form, pinned: e.target.checked })
                  }
                  id="pinned"
                />
                <label htmlFor="pinned" className={styles.label}>
                  Pin this notice to top
                </label>
              </div>

              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={creating || updating}
                >
                  {creating || updating
                    ? "Saving..."
                    : editingNotice
                      ? "Update"
                      : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;
