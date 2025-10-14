# 🎉 Events Platform

A community events management platform where staff can create events and community members can sign up and add them to their calendar.

## 🚀 Live Demo

---

## ✨ Features

### Core Features (MVP)
- ✅ **Event Management** - Create, edit, and delete events (staff only)
- ✅ **Event Sign-up** - Community members can sign up for events
- ✅ **Google Calendar Integration** - Add events directly to Google Calendar
- ✅ **Image Management** - Upload custom images or select from Unsplash
- ✅ **Authentication** - Secure login and registration with Supabase
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

---

### Additional Features
- 🖼️ Unsplash API integration for event images
- 📅 Separate date and time pickers
- 🔍 Filter upcoming events
- 👤 Personal event dashboard
- 🎨 Modern, clean UI with smooth animations

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **APIs:** 
  - Unsplash API (event images)
  - Google Calendar API (calendar integration)
- **Styling:** Custom CSS with responsive design
- **Deployment:** Netlify

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier)
- Unsplash API key (free)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/events-platform.git
cd events-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_UNSPLASH_KEY=your_unsplash_access_key
```

**Get your keys:**
- **Supabase:** https://supabase.com/dashboard → Project Settings → API
- **Unsplash:** https://unsplash.com/developers → New Application

### 4. Database Setup
Run the SQL commands in your Supabase SQL Editor:

```sql
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event signups table
CREATE TABLE event_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for event_signups
CREATE POLICY "Anyone can view signups"
  ON event_signups FOR SELECT USING (true);

CREATE POLICY "Authenticated users can signup"
  ON event_signups FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

CREATE POLICY "Anyone can view event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');
```

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

---

## 🔐 Security

- **Authentication:** Supabase Auth with email/password
- **Authorization:** Row Level Security (RLS) policies
  - Users can only edit/delete their own events
  - Anyone can view events
  - Authenticated users can sign up for events
- **API Keys:** Stored in environment variables (not committed to Git)
- **HTTPS:** Enforced in production via Netlify

---

## 🎨 Features Walkthrough

### For Event Creators (Staff)
1. **Create Event:** Navigate to "Create Event", fill form, upload/select image
2. **Manage Events:** View your events in "My Events" dashboard
3. **Edit/Delete:** Modify or remove events you created

### For Community Members
1. **Browse Events:** View all upcoming events on "Upcoming Events" page
2. **Event Details:** Click on event to see full details
3. **Sign Up:** Click "Sign Up for Event" button
4. **Add to Calendar:** Click "Add to Google Calendar" to sync with your calendar

---

## 👨‍💻 Author

Vanit Kashab
- GitHub: https://github.com/Vanitk1
- LinkedIn: www.linkedin.com/in/vanit-k-11059b151

---

## 🙏 Acknowledgments

- Skills Bootcamp: Software Development Bootcamp in JavaScript @ Northcoders
- Supabase for backend infrastructure
- Unsplash for event images
- Emojipeida for all the emojis
- Netlify for hosting platform

---