# Full-Stack AI Prompt Library (MeiGen.ai Clone)

This plan outlines the architecture, technology stack, and step-by-step process for building and hosting a production-ready AI prompt library website. The initial focus will be on providing high-quality prompts for image generation models like NanoBanana and ChatGPT (DALL-E).

## User Review Required

> [!IMPORTANT]
> Please review the proposed **Technology Stack** and **Hosting** choices below. I have recommended Next.js and Vercel for the easiest path to a production-ready, full-stack application, but let me know if you prefer a different stack (like standard React + Node.js or a specific database).

## Open Questions

> [!WARNING]
> 1. **Database:** Do you want to start with a cloud database immediately (like Supabase or Firebase) to store the prompts, or should we begin with a simple static file (JSON) for the MVP and upgrade later?
> 2. **Design Theme:** I plan to build a very premium, modern dark-mode aesthetic with glassmorphism effects and smooth animations. Does this fit your vision, or do you prefer a light theme?
> 3. **Authentication:** Do users need to log in to save their favorite prompts, or should it just be a public library where anyone can copy prompts without an account?

## Proposed Architecture (User-Generated Content Platform)

Since you want a platform where users can create accounts and post their own prompts (like Instagram/YouTube for prompts), we need a more robust backend.

1.  **Frontend & Framework:** **Next.js (React)**
    *   *Why:* Perfect for a dynamic platform. It handles routing and SEO effortlessly.
2.  **Authentication:** **Clerk or Supabase Auth**
    *   *Why:* Allows users to easily sign up, log in (via Email, Google, GitHub), and manage their profiles.
3.  **Database:** **Supabase (PostgreSQL)**
    *   *Why:* A powerful relational database to store user profiles, prompts, likes, comments, and follower relationships.
4.  **Image Storage:** **Supabase Storage or Cloudinary**
    *   *Why:* Users will upload images along with their prompts. These images need to be stored in a scalable cloud bucket.
5.  **Hosting:** **Vercel**
    *   *Why:* Still the best place to host Next.js apps quickly and efficiently.

## Budget & Utilizing Your GitHub Student Pack

As a senior developer, my advice is to leverage your **GitHub Student Developer Pack** to build this professional setup for **$0 initially**:

1.  **Domain Name:** Use your Student Pack to get a **free domain name** (e.g., from Namecheap or Name.com) for the first year.
2.  **Hosting & CI/CD:** Use **GitHub Pro** (from the pack) to store the code and host the frontend on **Vercel** (Free Tier).
3.  **Database & Auth:** Use **Supabase** (Free Tier). It handles user accounts and the database perfectly until we hit massive scale.

## Senior-Level Phased Rollout Plan

To ensure quality control and build an audience before opening the floodgates, we will use a "Seed and Scale" strategy.

### Phase 1: The "Read-Only" MVP (Focus on UI/UX)
*   **Goal:** Build a flawless, user-friendly UI/UX where the focus is entirely on finding and copying prompts.
*   **Permissions:** YOU (the Admin) are the only one who can upload posts to the database.
*   **End Users:** Anyone can visit the site, filter by AI model (NanoBanana, ChatGPT), and click "Copy Prompt". 
*   **Accounts:** Users *can* create an account, but right now it only allows them to "Save/Bookmark" a prompt to their profile. They cannot post yet.

### Phase 2: Database Setup & Admin Dashboard (Current Phase)

To make the platform functional, we need a place to store images and prompts, and a dashboard for you to manage them.

#### 1. Supabase Database & Storage Setup
*   **Table Creation:** We will create a `prompts` table in Supabase with columns: `id`, `created_at`, `prompt_text`, `model`, and `image_url`.
*   **Storage Bucket:** We will create a storage bucket in Supabase called `prompt-images` to host the files you upload.
*   **Security (RLS):** We will set up rules so *anyone* can view the images and prompts, but *only you* (the Admin) can upload or delete them.

#### 2. The Admin Dashboard UI
*   Create a hidden page at `/admin`.
*   Build a secure form where you can upload an image from your computer, type in the hidden prompt text, select the AI model, and hit "Publish".

#### 3. Wiring the Live Feed
*   Update the homepage (`/`) to stop using mock data. It will now fetch the latest prompts directly from your Supabase database in real-time.

### Phase 3: Opening to the Public (UGC)
*   Once the UI/UX is perfect and you have seeded the platform with great content, we will add the "Create Post" button for all registered users, turning it into a true social network.

### Phase 4: Polish & Deployment
*   Deploy the full-stack application to Vercel.

## Verification Plan

### Manual Verification
- Run the development server locally (`npm run dev`) and test all UI components.
- Verify that the "Copy Prompt" functionality works correctly across different browsers.
- Confirm the design aesthetics meet the "premium" requirement on both desktop and mobile.
- Finally, verify the live production URL once deployed to Vercel.
