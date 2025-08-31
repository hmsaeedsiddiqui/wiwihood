"use client";
import axios from "axios";

export async function logout() {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) return;
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  } catch (err) {
    // ignore errors
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}
