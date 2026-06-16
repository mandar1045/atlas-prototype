# Locara Atlas MVP Architecture & Schema

This document outlines the architecture, technology stack, and database structures for the Locara Atlas MVP.

## Overview

The Locara Atlas MVP is designed as a modern, high-performance web application tailored for delivering enterprise video datasets securely. It replaces manual Google Drive sharing with a premium, brand-aligned client portal. 

## Technology Stack

1. **Frontend Framework:** Next.js 15 (App Router) with TypeScript for type-safe, server-rendered React.
2. **Styling:** Tailwind CSS + Shadcn UI + Base UI for rapid, highly-customizable and accessible design tokens.
3. **Animations:** Framer Motion for premium micro-interactions and page transitions.
4. **Backend & Database:** Supabase (PostgreSQL) handling Auth, Database, and Row-Level Security (RLS).
5. **Video Storage & Streaming:** Videos hosted on Cloudflare R2 / AWS S3 and streamed natively via HTML5 `video` tags to reduce application weight.
6. **Hosting:** Vercel for CI/CD and edge deployment.

## Supabase PostgreSQL Schema

The database is built on PostgreSQL via Supabase, with Row-Level Security (RLS) strictly enforced.

### 1. `organizations`
Represents client companies.
- `id`: uuid (PK)
- `name`: text NOT NULL
- `logo_url`: text
- `is_active`: boolean DEFAULT true
- `created_at`: timestamptz

### 2. `users`
Locara Admins and Client Users.
- `id`: uuid (PK) -> Matches Supabase Auth
- `organization_id`: uuid FK -> `organizations`
- `name`: text NOT NULL
- `email`: text UNIQUE NOT NULL
- `role`: text CHECK IN ('admin', 'client')
- `is_active`: boolean DEFAULT true
- `created_at`: timestamptz

### 3. `collections`
Named groups of videos assigned to a specific organization.
- `id`: uuid (PK)
- `organization_id`: uuid FK -> `organizations`
- `title`: text NOT NULL
- `description`: text
- `cover_image_url`: text
- `tags`: text[]
- `is_published`: boolean DEFAULT false
- `created_at`: timestamptz

### 4. `videos`
The core dataset records containing metadata and the streaming URL.
- `id`: uuid (PK)
- `collection_id`: uuid FK -> `collections`
- `video_id`: text NOT NULL
- `worker_id`: text
- `task_type`: text[]
- `normalized_tags`: text[]
- `duration_minutes`: integer
- `video_length`: text
- `environment`: text
- `recording_date`: date
- `video_url`: text NOT NULL
- `thumbnail_url`: text
- `file_size`: text
- `resolution`: text
- `frame_rate`: text
- `audio_quality`: text
- `hands_visible`: boolean
- `lighting_quality`: text
- `pii_check_status`: text
- `qa_status`: text DEFAULT 'Pending'
- `created_at`: timestamptz

### 5. `dataset_requests`
Requests submitted by clients for more data.
- `id`: uuid (PK)
- `organization_id`: uuid FK -> `organizations`
- `user_id`: uuid FK -> `users`
- `task_type`: text
- `environment`: text
- `hours_needed`: integer
- `deadline`: date
- `notes`: text
- `status`: text DEFAULT 'Submitted'
- `created_at`: timestamptz

## Row-Level Security (RLS) Policies
- **Collections**: Clients can SELECT only where `organization_id` matches their own.
- **Videos**: Clients can SELECT videos whose `collection_id` belongs to an organization they have access to.
- **Dataset Requests**: Clients can INSERT new requests and SELECT only their own organization's requests. Admins have global access.
