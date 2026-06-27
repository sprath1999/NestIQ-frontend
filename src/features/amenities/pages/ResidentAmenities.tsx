import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { amenityService } from "../../../services/amenityService";
import styles from "../../../styles/amenities/Amenities.module.css";

function ResidentAmenities() {
  const [activeTab, setActiveTab] = useState<"amenities" | "bookings">(
    "amenities",
  );
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: "",
    startTime: "",
    endTime: "",
  });
  const [bookingError, setBookingError] = useState("");
  const queryClient = useQueryClient();

  const { data: amenities, isLoading: loadingAmenities } = useQuery({
    queryKey: ["availableAmenities"],
    queryFn: amenityService.getAvailableAmenities,
  });

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ["myBookings"],
    queryFn: amenityService.getMyBookings,
  });

  const { mutate: bookAmenity, isPending } = useMutation({
    mutationFn: amenityService.bookAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      setShowModal(false);
      setBookingForm({ bookingDate: "", startTime: "", endTime: "" });
      setBookingError("");
      setActiveTab("bookings");
    },
    onError: (error: any) => {
      setBookingError(
        error.response?.data?.message ||
          "Slot already booked. Please choose a different time.",
      );
    },
  });

  const { mutate: cancelBooking } = useMutation({
    mutationFn: amenityService.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const handleBook = () => {
    if (
      !bookingForm.bookingDate ||
      !bookingForm.startTime ||
      !bookingForm.endTime
    ) {
      setBookingError("Please fill all fields");
      return;
    }
    setBookingError("");
    bookAmenity({
      amenityId: selectedAmenity.id,
      bookingDate: bookingForm.bookingDate,
      startTime: bookingForm.startTime,
      endTime: bookingForm.endTime,
    });
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
      <h1 className={styles.pageTitle}>Amenities</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "amenities" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("amenities")}
        >
          Available Amenities
        </button>
        <button
          className={`${styles.tab} ${activeTab === "bookings" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </button>
      </div>

      {/* Amenities Tab */}
      {activeTab === "amenities" && (
        <>
          {loadingAmenities ? (
            <div className={styles.loading}>Loading amenities...</div>
          ) : (
            <div className={styles.amenityGrid}>
              {amenities?.map((amenity: any) => (
                <div key={amenity.id} className={styles.amenityCard}>
                  <div className={styles.amenityIcon}>{amenity.icon}</div>
                  <h3 className={styles.amenityName}>{amenity.name}</h3>
                  <p className={styles.amenityDescription}>
                    {amenity.description}
                  </p>

                  <div className={styles.amenityMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Hours:</span>
                      <span>
                        {amenity.availableFrom} - {amenity.availableTo}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Slot:</span>
                      <span>{amenity.slotDurationMinutes} mins</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Capacity:</span>
                      <span>{amenity.maxCapacity} persons</span>
                    </div>
                  </div>

                  <span
                    className={`${styles.badge} ${styles[`badge${amenity.status}`]}`}
                  >
                    {amenity.status}
                  </span>

                  <button
                    className={styles.bookBtn}
                    disabled={amenity.status !== "AVAILABLE"}
                    onClick={() => {
                      setSelectedAmenity(amenity);
                      setShowModal(true);
                      setBookingError("");
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <>
          {loadingBookings ? (
            <div className={styles.loading}>Loading bookings...</div>
          ) : bookings?.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏊</div>
              <p className={styles.emptyText}>No bookings yet</p>
            </div>
          ) : (
            <div className={styles.bookingGrid}>
              {bookings?.map((booking: any) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingLeft}>
                    <span className={styles.bookingIcon}>
                      {booking.amenityIcon}
                    </span>
                    <div className={styles.bookingInfo}>
                      <span className={styles.bookingName}>
                        {booking.amenityName}
                      </span>
                      <span className={styles.bookingDate}>
                        {formatDate(booking.bookingDate)}
                      </span>
                      <span className={styles.bookingTime}>
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                  <div className={styles.bookingRight}>
                    <span
                      className={`${styles.badge} ${styles[`badge${booking.status}`]}`}
                    >
                      {booking.status}
                    </span>
                    {booking.status === "CONFIRMED" && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {showModal && selectedAmenity && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {selectedAmenity.icon} Book {selectedAmenity.name}
            </h2>
            <p className={styles.modalSubtitle}>
              Available {selectedAmenity.availableFrom} -{" "}
              {selectedAmenity.availableTo} ·
              {selectedAmenity.slotDurationMinutes} min slots
            </p>

            {bookingError && (
              <div className={styles.errorAlert}>{bookingError}</div>
            )}

            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Booking Date</label>
                <input
                  type="date"
                  className={styles.input}
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingForm.bookingDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      bookingDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Start Time</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={bookingForm.startTime}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>End Time</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={bookingForm.endTime}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelModalBtn}
                  onClick={() => {
                    setShowModal(false);
                    setBookingError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleBook}
                  disabled={isPending}
                >
                  {isPending ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentAmenities;
