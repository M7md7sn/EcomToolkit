"use server";

import path from "path";
import { readJsonFile, writeJsonFile } from "../db";
import { isAuthenticated } from "./contact";

const FILE_PATH = path.join(process.cwd(), "data", "posts.json");

export type Post = {
  slug: string;
  categoryEn: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  introEn: string;
  introAr: string;
  contentEn: string;
  contentAr: string;
  tools: string[];
  createdAt: string;
  updatedAt?: string;
};

/**
 * Action: Get all posts
 */
export async function getPosts(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
  try {
    const posts = readJsonFile<Post>(FILE_PATH);
    return { success: true, data: posts };
  } catch (error) {
    console.error("Failed to read posts:", error);
    return { success: false, error: "Failed to read blog posts." };
  }
}

/**
 * Action: Get single post by slug
 */
export async function getPostBySlug(
  slug: string,
): Promise<{ success: boolean; data?: Post; error?: string }> {
  try {
    const posts = readJsonFile<Post>(FILE_PATH);
    const matchedPost = posts.find((post) => post.slug === slug);
    if (!matchedPost) {
      return { success: false, error: "Post not found." };
    }
    return { success: true, data: matchedPost };
  } catch (error) {
    console.error(`Failed to read post slug ${slug}:`, error);
    return { success: false, error: "Failed to read post." };
  }
}

/**
 * Action: Save Post (Create / Update) - Admin Only
 */
export async function savePost(postData: Post): Promise<{ success: boolean; error?: string }> {
  const isAdminLoggedIn = await isAuthenticated();
  if (!isAdminLoggedIn) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const posts = readJsonFile<Post>(FILE_PATH);
    const existingIndex = posts.findIndex((post) => post.slug === postData.slug);
    const now = new Date().toISOString();

    if (existingIndex > -1) {
      // Update existing post
      posts[existingIndex] = {
        ...posts[existingIndex],
        ...postData,
        updatedAt: now,
      };
    } else {
      // Create new post
      posts.push({
        ...postData,
        createdAt: now,
      });
    }

    // Sort posts by creation date descending
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    writeJsonFile<Post>(FILE_PATH, posts);
    return { success: true };
  } catch (error) {
    console.error("Failed to save post:", error);
    return { success: false, error: "Failed to save blog post." };
  }
}

/**
 * Action: Delete Post - Admin Only
 */
export async function deletePost(slug: string): Promise<{ success: boolean; error?: string }> {
  const isAdminLoggedIn = await isAuthenticated();
  if (!isAdminLoggedIn) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const posts = readJsonFile<Post>(FILE_PATH);
    const remainingPosts = posts.filter((post) => post.slug !== slug);
    writeJsonFile<Post>(FILE_PATH, remainingPosts);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete blog post." };
  }
}
