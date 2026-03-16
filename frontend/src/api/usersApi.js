import api from "./axios";

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateCurrentUser = async (userData) => {
  const res = await api.put("/users/me", userData);
  return res.data;
};

export const uploadProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await api.post("/users/me/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};