import axiosInstance from "./axiosInstance";

export const amenityService = {
  getAllAmenities: async () => {
    const response = await axiosInstance.get("/amenities");
    return response.data;
  },

  getAvailableAmenities: async () => {
    const response = await axiosInstance.get("/amenities/available");
    return response.data;
  },

  bookAmenity: async (payload: {
    amenityId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
  }) => {
    const response = await axiosInstance.post("/amenities/book", payload);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosInstance.get("/amenities/my-bookings");
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get("/amenities/bookings");
    return response.data;
  },

  cancelBooking: async (id: number) => {
    const response = await axiosInstance.put(
      `/amenities/bookings/${id}/cancel`,
    );
    return response.data;
  },
};
