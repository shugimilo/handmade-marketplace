export function getAuthPayloadFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Failed to parse token:", err);
    return null;
  }
}

export function isCurrentUserAdmin() {
  const payload = getAuthPayloadFromToken();
  return !!payload?.isAdmin;
}