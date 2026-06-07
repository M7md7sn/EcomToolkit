"use server";

import path from "path";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "../db";

const FILE_PATH = path.join(process.cwd(), "data", "submissions.json");

export type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  platform: string;
  salesVolume: string;
  storeUrl: string;
  createdAt: string;
};

/**
 * Get the passcode from environment variables or default to admin123.
 */
function getPasscode(): string {
  return process.env.ADMIN_PASSCODE || "admin123";
}

/**
 * Check if the current user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) return false;
  return session.value === getPasscode();
}

/**
 * Action: Submit Contact / Audit Request
 */
export async function submitAuditRequest(formData: {
  name: string;
  email: string;
  phone: string;
  platform: string;
  salesVolume: string;
  storeUrl: string;
}) {
  try {
    // Basic validation
    if (!formData.name || !formData.email) {
      return { success: false, error: "Name and Email are required." };
    }

    const submissions = readJsonFile<Submission>(FILE_PATH);

    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: (formData.phone || "").trim(),
      platform: formData.platform,
      salesVolume: formData.salesVolume,
      storeUrl: (formData.storeUrl || "").trim(),
      createdAt: new Date().toISOString(),
    };

    submissions.unshift(newSubmission);
    writeJsonFile<Submission>(FILE_PATH, submissions);

    return { success: true };
  } catch (error) {
    console.error("Failed to submit audit request:", error);
    return { success: false, error: "Server error. Please try again." };
  }
}

/**
 * Action: Verify Passcode and Log In
 */
export async function loginAdmin(passcode: string) {
  if (passcode === getPasscode()) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", passcode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid passcode." };
}

/**
 * Action: Log Out
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

/**
 * Action: Fetch Submissions (Admin Only)
 */
export async function getSubmissions(): Promise<{ success: boolean; data?: Submission[]; error?: string }> {
  const isAdminLoggedIn = await isAuthenticated();
  if (!isAdminLoggedIn) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const submissions = readJsonFile<Submission>(FILE_PATH);
    return { success: true, data: submissions };
  } catch (error) {
    console.error("Failed to read submissions:", error);
    return { success: false, error: "Failed to read data." };
  }
}

/**
 * Action: Delete Submission (Admin Only)
 */
export async function deleteSubmission(id: string): Promise<{ success: boolean; error?: string }> {
  const isAdminLoggedIn = await isAuthenticated();
  if (!isAdminLoggedIn) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const submissions = readJsonFile<Submission>(FILE_PATH);
    const remainingSubmissions = submissions.filter((submission) => submission.id !== id);
    writeJsonFile<Submission>(FILE_PATH, remainingSubmissions);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete submission:", error);
    return { success: false, error: "Failed to delete submission." };
  }
}
