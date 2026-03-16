import { getCurrentUserIdFromToken } from "./auth";

export function getProfileUrl(userId) {
  const currentUserId = getCurrentUserIdFromToken();

  return Number(userId) === Number(currentUserId)
    ? "/me"
    : `/users/${userId}`;
}