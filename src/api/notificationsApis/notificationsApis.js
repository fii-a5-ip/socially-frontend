import client from "./client";

// 
export const getNotifications = async () => {
  const res = await client.get("/api/notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await client.patch(`/api/notifications/${id}/read`);
  return res.data;
};
