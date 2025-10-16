# 🎉 Events Platform

A comprehensive community events management platform where staff can create events and community members can discover, purchase tickets, and add them to their calendar. Built with modern web technologies and secure payment processing.

## 🚀 Live Demo

https://community-events1.netlify.app

---

## ✨ Features

### Core Features (MVP)
- ✅ **Event Management** - Create, edit, and delete events (staff only)
- ✅ **Event Sign-up** - Community members can sign up for events
- ✅ **Google Calendar Integration** - Add events directly to Google Calendar
- ✅ **Image Management** - Upload custom images or select from Unsplash
- ✅ **Authentication** - Secure login and registration with Supabase (Email & Google OAuth)
- ✅ **Payment Processing** - Integrated Stripe Checkout for paid events
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

### Additional Features
- 🖼️ Unsplash API integration for event images
- 📅 Separate date and time pickers
- 🔍 Filter upcoming events
- 👤 Personal event dashboard
- 💳 Stripe payment integration for ticketed events
- 🔐 Google OAuth authentication
- 🎨 Modern, clean UI with smooth animations
- 🔔 Payment success confirmation page
- 🎫 Free and paid event support

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Custom CSS with responsive design
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend & Services
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Payment Processing:** Stripe Checkout
- **APIs:** 
  - Unsplash API (event images)
  - Google Calendar API (calendar integration)
  - Stripe API (payment processing)
- **Backend Server:** Node.js + Express

### Deployment
- **Frontend:** Netlify
- **Backend:** [Your backend hosting platform]

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier)
- Unsplash API key (free)
- Stripe account (test mode for development)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/events-platform.git
cd events-platform
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Variables

#### Frontend `.env` (root directory)
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Unsplash
VITE_UNSPLASH_KEY=your_unsplash_access_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# API
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend `.env` (backend directory)
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Get your keys:**
- **Supabase:** https://supabase.com/dashboard → Project Settings → API
- **Unsplash:** https://unsplash.com/developers → New Application
- **Stripe:** https://dashboard.stripe.com/test/apikeys

### 5. Database Setup
Run the SQL commands in your Supabase SQL Editor:

```sql
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
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

### 6. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials
3. Add authorized redirect URIs:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   http://localhost:5173
   ```
4. Add credentials to Supabase → Authentication → Providers → Google


### 7. Run Development Servers

#### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

#### Terminal 2 - Frontend Server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 💳 Testing Payments

Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

---

## 🔐 Security

- **Authentication:** Supabase Auth with email/password & Google OAuth
- **Authorization:** Row Level Security (RLS) policies
  - Users can only edit/delete their own events
  - Anyone can view events
  - Authenticated users can sign up for events
  - Users can only view their own payments
- **Payment Security:** Stripe Checkout with PCI compliance
- **API Keys:** Stored in environment variables (not committed to Git)
- **HTTPS:** Enforced in production via Netlify
- **CORS:** Configured for frontend-backend communication

---

## 🎨 Features Walkthrough

### For Event Creators (Staff)
1. **Create Event:** Navigate to "Create Event", fill form, upload/select image
2. **Set Pricing:** Choose between free or paid events
3. **Manage Events:** View your events in "My Events" dashboard
4. **Edit/Delete:** Modify or remove events you created

### For Community Members
1. **Browse Events:** View all upcoming events on "Upcoming Events" page
2. **Event Details:** Click on event to see full details
3. **Authentication:** Sign up with email or Google account
4. **Purchase Tickets:** For paid events, complete secure Stripe checkout
5. **Sign Up (Free Events):** Click "Sign Up for Event" button
6. **Add to Calendar:** Click "Add to Google Calendar" to sync with your calendar
7. **Payment Confirmation:** View success page after completing purchase

---

## 🚀 Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### Backend
1. Deploy to your preferred platform (Heroku, Railway, Render, etc.)
2. Add environment variables
3. Update `VITE_API_BASE_URL` in frontend `.env`
4. Configure Stripe webhook with production URL


---

## 👨‍💻 Author

**Vanit Kashab**
- GitHub: [@Vanitk1](https://github.com/Vanitk1)
- LinkedIn: [vanit-k-11059b151](https://www.linkedin.com/in/vanit-k-11059b151)

---

## 🙏 Acknowledgments

- **Skills Bootcamp:** Software Development Bootcamp in JavaScript @ Northcoders
- **Supabase** for backend infrastructure
- **Stripe** for secure payment processing
- **Unsplash** for event images
- **Google** for OAuth and Calendar integration
- **Emojipedia** for all the emojis
- **Netlify** for hosting platform

---