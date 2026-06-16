LOCARA ATLAS
Enterprise Dataset Delivery Platform
MVP Product Requirements Document
Product
Locara Atlas
Version
1.0 — MVP Specification
Owner
Dheeraj Verma, Locara AI
Status
Ready for Development
Target
MVP in 1–2 Weeks
Prepared
May 2026
1. Executive Summary
Locara AI collects and delivers egocentric household video datasets for robotics and embodied AI training. Currently, datasets are shared via Google Drive folders and CSV spreadsheets — a workflow that looks unprofessional, limits discoverability, and reduces the perceived value of the data.
Locara Atlas is a private, invitation-only web portal that transforms this into a premium client experience. Clients receive a login link, sign in, and immediately see a curated, searchable, filterable view of the video datasets assigned to them — with real video playback, metadata panels, and QA compliance details.
The Core Business Impact
Before Atlas: Client receives Drive folder + spreadsheet. Feels like a vendor.
After Atlas: Client logs into a branded platform. Feels like an AI infrastructure partner.
This single change affects pricing, trust, retention, and enterprise conversion rate.
2. MVP Scope — What We Are and Are Not Building
This document specifies only the MVP. The goal is a working, impressive client-facing portal in 1–2 weeks. All advanced features are explicitly deferred to V2.
2.1 MVP Includes
Secure login with email and password
Admin panel to create clients and assign video collections
Collections page — Netflix-style browsing of dataset groups
Dataset Explorer — searchable, filterable grid of video cards
Video Detail Page — real video streaming with metadata panel
Basic analytics dashboard (total videos, hours, task breakdown)
Dataset request form — clients can request more data
2.2 MVP Does NOT Include
Annotation overlays, bounding boxes, or pose tracking
AI-powered semantic search (planned for V2)
Watermarked downloads
Client-specific branding / white-labeling
API access for clients
CSV bulk upload automation (admin manually seeds data for MVP)
Payment or marketplace functionality
3. Users and Roles
3.1 Role: Admin (Locara Internal Team)
This is the Locara operations team — specifically Dheeraj and whoever manages datasets.
Create and manage organizations (client companies)
Create user accounts and assign them to an organization
Create collections and assign videos to them
Assign which collections a client organization can see
View all data, all clients, full analytics
Receive and respond to dataset requests
3.2 Role: Client Viewer (Robotics/AI Company)
These are the paying clients — robotics researchers, computer vision engineers, embodied AI teams at companies like Measurement Labs, RIME, etc.
Log in with credentials provided by Locara
See ONLY the collections and videos assigned to their organization
Browse, search, filter, and watch videos
View metadata and QA/compliance status
Submit requests for additional datasets
Cannot see other clients' data under any circumstance
Critical Security Requirement
Row-level security must be enforced at the database level (Supabase RLS policies).
A client from Organization A must NEVER be able to access data from Organization B,
even by manipulating URLs or API calls. This is non-negotiable.
4. Recommended Tech Stack
This stack is chosen for speed of MVP development, low cost, and clean scalability path.
Layer
Technology
Why
Frontend
Next.js 15 + TypeScript
Fast, SEO-friendly, excellent developer ecosystem
Styling
Tailwind CSS + shadcn/ui
Rapid, consistent, premium-looking UI components
Animations
Framer Motion
Smooth transitions that make the app feel premium
Backend / Auth
Supabase
Auth, PostgreSQL DB, row-level security, storage metadata all in one
Video Storage
Cloudflare R2 or AWS S3
Cost-effective object storage; videos streamed via URL
Video Streaming
Native HTML5 or Cloudflare Stream
Direct MP4 streaming for MVP; upgrade to CDN-backed stream for scale
Hosting
Vercel
One-command deployment, auto CI/CD, free SSL
Important Architecture Decision
Videos are NEVER stored inside the application repository.
Only the video URL (pointing to S3/R2/Cloudflare) is stored in the database.
The app streams the video dynamically from the external URL.
This keeps the app lightweight, fast, and scalable to 100,000+ videos.
5. Database Schema
All tables should be created in Supabase PostgreSQL. Row-Level Security (RLS) must be enabled on all tables.
5.1 organizations
Represents a client company (e.g., Measurement Labs, RIME).
Column
Type
Description
id
uuid (PK)
Auto-generated primary key
name
text NOT NULL
Company name e.g. 'Measurement Labs'
logo_url
text
Optional logo URL for future branding
created_at
timestamptz
Record creation timestamp
is_active
boolean DEFAULT true
Soft disable client access without deletion
5.2 users
Both admin and client users. Role field determines what they can access.
Column
Type
Description
id
uuid (PK)
Must match Supabase Auth user id
organization_id
uuid FK → organizations
Which company this user belongs to
name
text NOT NULL
Display name
email
text UNIQUE NOT NULL
Login email
role
text CHECK IN ('admin','client')
Determines permissions throughout the app
created_at
timestamptz
Record creation timestamp
is_active
boolean DEFAULT true
Deactivate access without deleting account
5.3 collections
A named group of videos, e.g. 'Kitchen Activities Dec 2025'. Each collection belongs to one organization.
Column
Type
Description
id
uuid (PK)
Auto-generated primary key
organization_id
uuid FK → organizations
Which client can see this collection
title
text NOT NULL
e.g. 'Kitchen Activities — December 2025'
description
text
Short description shown on collection card
cover_image_url
text
Hero image URL for the collection card
tags
text[]
e.g. ['cooking', 'dishwashing', 'urban']
is_published
boolean DEFAULT false
Admin must explicitly publish before client can see
created_at
timestamptz
Record creation timestamp
5.4 videos
The core dataset record. Each video belongs to a collection. This table is seeded with your real dataset metadata.
Column
Type
Description
id
uuid (PK)
Auto-generated primary key
collection_id
uuid FK → collections
Which collection this video belongs to
video_id
text NOT NULL
Original ID e.g. 'VID_001'
worker_id
text
Anonymized worker ID e.g. 'RANI_W622'
task_type
text[]
Human-readable tasks e.g. ['Making Tea']
normalized_tags
text[]
Machine tags e.g. ['tea_preparation']
duration_minutes
integer
Duration in minutes
video_length
text
Display format e.g. '0:08:20'
environment
text
e.g. 'Urban 1RK'
recording_date
date
Date of recording
video_url
text NOT NULL
Full streaming URL (S3/R2/direct MP4)
thumbnail_url
text
Preview image URL
file_size
text
e.g. '3.73 GB'
resolution
text
e.g. '1080p'
frame_rate
text
e.g. '60fps'
audio_quality
text
e.g. 'Good'
hands_visible
boolean
Whether hands are visible in the frame
lighting_quality
text
e.g. 'Good'
pii_check_status
text
e.g. 'No PII' or 'Blurred Required'
qa_status
text DEFAULT 'Pending'
'Verified', 'Pending', 'Rejected'
created_at
timestamptz
Record creation timestamp
5.5 dataset_requests
Submitted by client users to request additional data from Locara.
Column
Type
Description
id
uuid (PK)
Auto-generated primary key
organization_id
uuid FK → organizations
Which client submitted this
user_id
uuid FK → users
Which user submitted this
task_type
text
What kind of activity they need
environment
text
Indoor/outdoor/specific environment
hours_needed
integer
How many hours of footage
deadline
date
When they need it by
notes
text
Any additional requirements
status
text DEFAULT 'Submitted'
'Submitted', 'Under Review', 'Approved', 'Delivered'
created_at
timestamptz
Record creation timestamp
5.6 access_logs
Audit trail of important user actions. Critical for enterprise clients who ask about data access controls.
Column
Type
Description
id
uuid (PK)
Auto-generated primary key
user_id
uuid FK → users
Who performed the action
action
text NOT NULL
e.g. 'video_view', 'collection_view', 'request_submitted'
resource_id
text
ID of the video or collection accessed
created_at
timestamptz
When the action occurred
6. Row-Level Security (RLS) Policies
These Supabase RLS policies are mandatory. Without them, a client could access another client's data.
6.1 collections Table
Admin: can SELECT, INSERT, UPDATE, DELETE all rows
Client: can SELECT only where organization_id matches their own organization_id from the users table
6.2 videos Table
Admin: full access
Client: can SELECT only videos where collection_id belongs to a collection the client's organization owns
6.3 dataset_requests Table
Admin: can read and update all requests
Client: can INSERT new requests, SELECT only their own organization's requests
7. Page-by-Page Specifications
7.1 Login Page
The very first screen a client sees. This must feel premium — it sets the tone for the entire experience.
Visual Design
Full-screen dark background with subtle gradient
Centered glassmorphism card (blurred background, slight border glow)
Locara Atlas logo/wordmark at the top of the card
No navigation bar, no distractions — pure focus on login
Fields and Interactions
Email input field (with label)
Password input field (with show/hide toggle)
'Sign In' button — full width, brand color, smooth hover state
'Forgot Password' link — subtle, below the button
Error state: clear inline error message if credentials are wrong
Loading state: spinner inside the button while authenticating
Behavior After Login
Admin role → redirect to Admin Dashboard
Client role → redirect to Collections page
Session should persist — user should not need to re-login for 7 days
7.2 Dashboard Page
The first page clients land on after login. It should immediately communicate scale, quality, and professionalism.
Metric Cards (Top Row)
Four large animated cards showing:
Total Videos in their assigned collections
Total Dataset Hours (sum of duration_minutes / 60, formatted as '18.5 hrs')
Number of Collections assigned
Compliance Rate (% of videos with pii_check_status = 'No PII')
Charts Section
Task Distribution — horizontal bar chart showing count per task type (Cooking, Dishwashing, Laundry, etc.)
Resolution Breakdown — donut chart (1080p vs 720p vs other)
FPS Distribution — bar chart (30fps vs 60fps vs other)
Recent Activity
Table showing the 5 most recently added videos (video ID, task, date added)
Quick Links
'Browse Collections' button → Collections page
'Search Dataset' button → Dataset Explorer
7.3 Collections Page
Netflix-style browsing of dataset groups. This is where the client understands the structure of what they have access to.
Layout
Page title: 'Your Collections'
Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile
Each card is a Collection Card (see spec below)
Collection Card Specification
Cover image — full-bleed thumbnail, 16:9 aspect ratio
Title — bold, white text overlaid on image with gradient overlay at bottom
Number of videos — e.g. '12 videos'
Total hours — e.g. '1.8 hrs'
Tags — up to 3 tag pills (e.g. Kitchen, Cooking, 1080p)
Hover state: slight scale-up (1.03x), shadow deepens, cursor becomes pointer
On click: navigate to Collection Detail page
Collection Detail Page
Hero banner with cover image and title
Collection stats: video count, total hours, environments, date range
Grid of video cards for all videos in the collection
Same search and filter bar as Dataset Explorer (scoped to this collection)
7.4 Dataset Explorer Page
The most important page in the product. This is where clients spend the most time validating data quality.
Layout
Left sidebar: filter panel (240px wide, fixed on scroll)
Main area: search bar at top, results grid below
Top right: grid/list toggle, sort dropdown, result count
Search Bar
Full-width search input at top of page
Placeholder: 'Search by task, environment, video ID...'
Searches across: task_type, normalized_tags, environment, video_id, worker_id
Results update in real-time as user types (debounced 300ms)
Filter Panel — Full Specification
Filter Name
Input Type
Data Source
Behavior
Task Type
Multi-select checkboxes
Distinct values from task_type column
OR logic — show if any selected tag matches
Environment
Multi-select checkboxes
Distinct values from environment column
OR logic
Duration
Range slider
Min/max from duration_minutes
Show videos within selected minute range
Frame Rate
Radio buttons
30fps / 60fps / All
Filter by exact frame_rate value
Resolution
Radio buttons
1080p / 720p / All
Filter by exact resolution value
Audio Quality
Radio buttons
Good / Poor / All
Filter by audio_quality value
PII Status
Radio buttons
No PII / Blurred Required / All
Filter by pii_check_status value
Hands Visible
Toggle switch
Boolean
When ON, show only hands_visible = true
Lighting Quality
Radio buttons
Good / Poor / All
Filter by lighting_quality value
Filter interactions: All filters are combinable (AND logic between different filters, OR within same filter). A 'Clear All Filters' button appears when any filter is active. Active filter count badge shows on the filter panel header.
Sort Options
Newest First (default) — by recording_date DESC
Oldest First — by recording_date ASC
Longest Duration — by duration_minutes DESC
Shortest Duration — by duration_minutes ASC
Video Card Specification (Grid View)
Thumbnail image — 16:9, rounded corners, lazy loaded
Duration badge — bottom left of thumbnail, e.g. '8:20'
QA badge — top right of thumbnail: green 'Verified' or yellow 'Pending'
PII badge — top left of thumbnail: blue 'No PII' or orange 'Blurred Req.'
Video ID — small muted text below thumbnail
Task labels — horizontal scrolling chip row (e.g. 'Making Tea')
Environment — icon + text (e.g. '🏠 Urban 1RK')
FPS and Resolution — small metadata row at bottom
Hover state: thumbnail brightens slightly, play icon appears centered
On click: navigate to Video Detail page
Video Card Specification (List View)
Full-width row with thumbnail on left (120px wide)
All metadata in columns to the right
Useful for scanning many videos quickly
Pagination
24 videos per page in grid view, 50 in list view
Page number controls at bottom
Result count shown: e.g. 'Showing 1–24 of 87 videos'
7.5 Video Detail Page
The deepest level of the product. When a client opens this page, they are evaluating whether this video is suitable for their training data. Every detail matters here.
Page Layout
Left column (65% width): Video player + activity timeline + related videos
Right column (35% width): Metadata panel (sticky on scroll)
Dark background to make the video feel cinematic
Video Player Requirements
Large responsive player that fills the left column
Streams directly from the video_url stored in the database
Controls: Play/Pause, Seek bar with timestamps, Volume, Playback speed (0.5x, 1x, 1.5x, 2x), Fullscreen
Loading skeleton while video URL is fetching
Buffering indicator (spinner overlay) while video is loading
Error state: friendly message if video URL fails to load
Do NOT autoplay — wait for user to press play
Activity Timeline
Displayed below the video player. Shows the task breakdown for the video.
Example: VID_002 Activity Timeline
00:00 – 04:30  →  Cutting Vegetables
04:30 – 12:15  →  Cooking Meal
12:15 – 16:03  →  Dishwashing
Note: For MVP, these are manually entered or inferred from task_type. In V2,
this will be driven by real annotation timestamps from the annotations table.
Right Metadata Panel
Section A — Core Information
Field
Value Example
Video ID
VID_002
Worker ID
RANI_W622 (anonymized)
Recording Date
December 2, 2025
Environment
Urban 1RK
Duration
16 minutes (0:16:03)
File Size
3.73 GB
Section B — Technical Specs
Field
Value Example
Resolution
1080p
Frame Rate
60 fps
Audio Quality
Good
Lighting Quality
Good
Hands Visible
Yes
Section C — Compliance
Field
Value Example
PII Check Status
No PII  ✓
QA Status
Verified  ✓
Annotation Status
Completed
Action Buttons (below metadata panel)
'Download Metadata' — downloads a JSON file with all metadata fields for this video
'Request Similar Data' — opens the dataset request form pre-filled with this video's task type and environment
Related Videos Section
Horizontal scrolling row of 4–6 video cards below the main player
Shows videos from the same collection with similar task_type or normalized_tags
Label: 'More from this Collection' or 'Similar Tasks'
7.6 Admin Panel
Only accessible to users with role = 'admin'. Should be a separate section of the app, clearly distinct from the client view.
Admin Sidebar Navigation
Organizations
Users
Collections
Videos
Dataset Requests
Analytics
Organizations Management
Table view: organization name, user count, collection count, active/inactive status, created date
'Create Organization' button → modal form with fields: Name, Logo URL (optional)
'Edit' and 'Deactivate' actions per row
Users Management
Table view: name, email, organization, role, active status, created date
'Create User' button → modal form: Name, Email, Organization (dropdown), Role (dropdown: admin/client)
Creating user triggers Supabase Auth invite email to the user
'Deactivate' action — disables login without deleting account
Collections Management
Table view: title, organization, video count, published status, created date
'Create Collection' button → modal form: Title, Description, Organization (dropdown), Cover Image URL, Tags
'Publish / Unpublish' toggle — controls client visibility
'Assign Videos' → opens a video picker where admin selects which videos to include
Videos Management
Table view: video ID, task type, collection, worker ID, PII status, QA status, created date
For MVP: admin manually adds videos via a 'Add Video' form
Form fields: all fields from the videos schema (Section 5.4)
'Edit' action per video — opens same form pre-filled
'Delete' action — with confirmation dialog
Dataset Requests Management
Table view: client name, organization, task type, hours needed, deadline, status, submitted date
Admin can update status (Under Review, Approved, Delivered, Closed)
Admin can add internal notes to a request
7.7 Dataset Request Page (Client View)
Allows clients to formally request additional data directly from within the portal.
Request Form Fields
Field
Input Type
Required?
Notes
Task Type
Text input or multi-select
Yes
e.g. 'Cooking', 'Laundry'
Environment
Dropdown
Yes
Urban 1RK, Urban 2BHK, Rural, Outdoor, Other
Hours Needed
Number input
Yes
Approximate hours of footage
Deadline
Date picker
Yes
When they need delivery
Special Requirements
Text area
No
Resolution, lighting, hands visibility, etc.
Notes
Text area
No
Any additional context
Request History
Below the form, show a table of all previous requests from this organization
Columns: Request Date, Task Type, Hours, Deadline, Status
Status shown as a colored badge (yellow: Submitted, blue: Under Review, green: Delivered)
8. Navigation Structure
8.1 Client Navigation (Sidebar)
Nav Item
Route
Icon
Visible To
Dashboard
/dashboard
BarChart icon
All clients
Collections
/collections
Grid icon
All clients
Dataset Explorer
/explorer
Search icon
All clients
Dataset Requests
/requests
FileText icon
All clients
Settings
/settings
Settings icon
All clients
8.2 Admin Navigation (Sidebar)
Nav Item
Route
Visible To
Admin Dashboard
/admin
Admin only
Organizations
/admin/organizations
Admin only
Users
/admin/users
Admin only
Collections
/admin/collections
Admin only
Videos
/admin/videos
Admin only
Requests
/admin/requests
Admin only
Analytics
/admin/analytics
Admin only
9. Dataset Taxonomy — Normalized Tags
All task descriptions must be normalized into machine-readable tags. This is critical for consistent filtering and future AI search capability.
Raw Task Description
Normalized Tag
Display Label
Wash Dishes / Washing Dishes
dishwashing
Dishwashing
Cleaning Kitchen / Cleaning kitchen
kitchen_cleaning
Kitchen Cleaning
Cooking Meal
meal_preparation
Meal Preparation
Cutting vegetables / Cutting Vegetables
vegetable_cutting
Vegetable Cutting
Washing Cloths / Washing Clothes
laundry
Laundry
Hanging clothes / Hanging Clothes
clothes_hanging
Clothes Hanging
Making Tea
tea_preparation
Tea Preparation
Mopping
floor_cleaning
Floor Cleaning / Mopping
Arranging the utensils
utensil_organization
Utensil Organization
Arranging the bed cover
bed_making
Bed Making
Cleaning kitchen, Arranging utensils
kitchen_cleaning, utensil_organization
Multiple tags
Every video in the database must have both the task_type (human-readable array) and normalized_tags (machine-readable array) populated. The developer should write a migration script to populate normalized_tags from existing task_type values using this mapping table.
10. Seed Data — Real Dataset Records
The following 12 records are Locara's real dataset metadata and must be seeded into the videos table. The developer should use these as the starting data for the MVP.
Video ID
Worker ID
Task Type
Duration
FPS
PII Status
QA Status
VID_001
RANI_W622
Making Tea
8 min
60fps
No PII
Verified
VID_002
RANI_W622
Cooking, Cutting Veg, Dishwashing
16 min
60fps
No PII
Verified
VID_003
RANI_W622
Dishwashing, Kitchen Cleaning
4 min
60fps
No PII
Verified
VID_004
RANI_W1152
Dishwashing, Laundry, Kitchen Cleaning
15 min
30fps
Blurred Required
Pending
VID_005
RANI_W1152
Hanging Clothes
1 min
30fps
Blurred Required
Pending
VID_006
RANI_W1152
Hanging Clothes, Bed Making
1 min
30fps
No PII
Verified
VID_007
RANI_W1226
Dishwashing, Utensil Org, Kitchen Cleaning, Cooking
8 min
30fps
No PII
Verified
VID_008
RANI_W1226
Laundry, Hanging Clothes
6 min
30fps
No PII
Verified
VID_009
RANI_W1226
Hanging Clothes, Mopping
5 min
30fps
No PII
Verified
VID_010
RANI_W951
Cooking, Dishwashing, Kitchen Clean, Laundry, Utensil Org
31 min
30fps
No PII
Verified
VID_011
RANI_W1081
Dishwashing, Kitchen Cleaning, Utensil Org
3 min
30fps
No PII
Verified
VID_012
RANI_W1081
Dishwashing, Cutting Vegetables
11 min
30fps
No PII
Verified
All 12 videos are from the Urban 1RK environment, recorded in December 2025 at 1080p resolution with Good audio and lighting quality. Hands are visible in all videos.
Video URLs
The developer will receive the real S3/Cloudflare video URLs separately from Dheeraj.
These should be inserted into the video_url column for each record.
Thumbnail URLs can initially use high-quality Unsplash kitchen/household images
as placeholders until real video thumbnails are generated.
11. Design System
11.1 Color Palette
Role
Color
Usage
Primary Brand
#1A3C5E (dark navy)
Logo, headings, primary buttons
Accent
#2E86AB (steel blue)
Links, active states, badges, charts
Background
#0F0F14 (near black)
Page background (dark mode)
Surface
#1A1A2E (dark blue-black)
Cards, panels, modals
Border
#2A2A3E
Card borders, dividers
Text Primary
#F0F0F0
Main body text
Text Secondary
#9090A0
Labels, metadata, secondary text
Success
#22C55E (green)
Verified badges, PII cleared indicators
Warning
#F59E0B (amber)
Blurred Required badges, Pending status
Error
#EF4444 (red)
Error states, rejected status
11.2 Typography
Element
Font
Size
Weight
Page Titles (H1)
Inter or Geist
32px
700 (Bold)
Section Headers (H2)
Inter or Geist
24px
600 (Semibold)
Card Titles
Inter or Geist
18px
600 (Semibold)
Body Text
Inter or Geist
14px
400 (Regular)
Labels / Metadata
Inter or Geist
12px
400 (Regular)
Badges / Tags
Inter or Geist
11px
500 (Medium)
Video Duration
Mono (JetBrains Mono)
13px
500 (Medium)
11.3 Component Library
Use shadcn/ui as the component foundation
All components should be overridden to match the dark theme defined above
Do not use any light-mode or default shadcn styling without customization
Framer Motion should be used for: page transitions, card hover states, metric card number animations, filter panel open/close, loading skeletons
12. Performance Requirements
Metric
Target
Notes
Login to Collections page load
< 2 seconds
Including auth check
Dataset Explorer search response
< 500ms
After user stops typing (debounce)
Video player first frame load
< 3 seconds
On standard broadband (50 Mbps)
Filter application
< 300ms
Results should update near-instantly
Admin panel page loads
< 2 seconds
Mobile responsiveness
All pages functional
Must work on tablet minimum
13. MVP Delivery Checklist
The following checklist defines what 'done' means for the MVP. All items must be complete before the product is shared with a client.
13.1 Authentication
Login page built and connected to Supabase Auth
Password reset (forgot password) flow working
Role-based redirect after login (admin vs client)
Protected routes — unauthenticated users redirected to login
RLS policies tested — client A cannot access client B's data
13.2 Database
All 6 tables created in Supabase
RLS enabled on all tables
12 real video records seeded with correct metadata
At least 1 organization created
At least 1 collection created and published
Admin user account created and working
Test client user account created and working
13.3 Client-Facing Pages
Dashboard: 4 metric cards, 2 charts, recent videos table — all showing real data
Collections: grid of cards, all real data, hover states working
Dataset Explorer: search working, all 9 filters working, grid and list view working
Video Detail: real video streaming from URL, metadata panel complete, related videos showing
Dataset Request: form submits successfully, history table shows previous requests
13.4 Admin Panel
Create/edit/deactivate organizations
Create/edit/deactivate users with role assignment
Create/edit/publish/unpublish collections
Add/edit/delete video records
View and update status of dataset requests
13.5 Quality
No console errors in production build
All pages load correctly on Chrome, Safari, Firefox
Responsive layout tested on 1440px desktop and 768px tablet
Loading states visible for all async operations
Error states visible for failed API calls or video load failures
14. Future Roadmap (Post-MVP)
These features are explicitly NOT in scope for MVP but should be considered in architectural decisions.
V2 (1–2 months post MVP)
Semantic search — vector embeddings for natural language queries ('find cooking videos with visible utensils')
CSV bulk upload in admin panel — upload spreadsheet to seed videos automatically
Annotation viewer — timestamp-linked activity labels overlaid on video timeline
Watermarked downloads — videos exported with client watermark
Client analytics — per-client view of their usage (most watched, searches, time spent)
Custom branding per organization — logo, color scheme
V3 (3–6 months post MVP)
API access — REST API for programmatic dataset access by client engineering teams
Bounding box and segmentation overlays on video frames
Dataset marketplace — external clients can browse and purchase dataset licenses
Auto-tagging pipeline — AI-generated tags from video content
Pose estimation previews
15. Glossary
Term
Definition
Egocentric video
Video recorded from a first-person / head-mounted perspective, as if you are seeing through the person's eyes
Embodied AI
AI systems that interact with the physical world through a robotic body (manipulation, navigation, household tasks)
PII
Personally Identifiable Information — faces, names, or other data that could identify an individual
RLS
Row-Level Security — database policy that restricts which rows a user can read/write based on their identity
Normalized tags
Standardized machine-readable labels used for consistent filtering and search (e.g. 'dishwashing' instead of 'Wash Dishes')
Collection
A curated group of videos, similar to a playlist, assigned to a specific client organization
Organization
A client company that has access to the portal (e.g. Measurement Labs, RIME)
Supabase
The backend platform used for authentication, database, and permissions
Cloudflare R2
Object storage service used to host video files, similar to AWS S3 but cheaper
Signed URL
A temporary, expiring URL that grants access to a private file — prevents unauthorized sharing
— End of Document —