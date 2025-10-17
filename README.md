# Events Platform

A comprehensive community events management platform where staff can create events and community members can discover, purchase tickets, and manage their profiles. Built with modern web technologies and secure payment processing.

## 🚀 Live Demo

- **Frontend:** https://community-events1.netlify.app
- **Backend API:** https://events-platform-backend-w6su.onrender.com

### 🧪 Test Account 

You can try the platform with this test account:
- **Email:** `testuser@test.com`
- **Password:** `test123`

---

## ✨ Features

### Core Features (MVP)
- ✅ **Event Management** - Create, edit, and delete events (staff/admin only)
- ✅ **Event Sign-up** - Community members can sign up for events
- ✅ **Google Calendar Integration** - Add events directly to Google Calendar
- ✅ **Image Management** - Upload custom images or select from Unsplash
- ✅ **Authentication** - Secure login and registration with Supabase (Email & Google OAuth)
- ✅ **Payment Processing** - Integrated Stripe Checkout for paid events
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **User Profile** - Manage account settings and change password

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
- 📱 Fully responsive mobile design with hamburger menu
- 🔑 Password change functionality in user profile
- 🎯 Featured events on homepage

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Custom CSS with responsive design
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Hooks (useState, useEffect)

### Backend & Services
- **Backend:** Node.js + Express
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Payment Processing:** Stripe Checkout
- **APIs:** 
  - Unsplash API (event images)
  - Google Calendar API (calendar integration)
  - Stripe API (payment processing)
  - Supabase Auth API

### Deployment
- **Frontend:** Netlify (Auto-deploy from GitHub)
- **Backend:** Render (Auto-deploy from GitHub)
- **Database:** Supabase Cloud

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier)
- Unsplash API key (free)
- Stripe account (test mode for development)
- Google Cloud Console account (for OAuth)

### 1. Clone Repository
```bash
git clone https://github.com/Vanitk1/Events-platform.git
cd Events-platform
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
- **Google OAuth:** https://console.cloud.google.com/apis/credentials

### 5. Database Setup

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

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT USING (true);

CREATE POLICY "Staff and admins can create events"
  ON events FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin')
    )
  );

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

### 6. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   ```
   https://fapqehbjgqpikwsqtmmh.supabase.co
   https://community-events1.netlify.app
   http://localhost:5173
   ```
6. Add authorized redirect URIs:
   ```
   https://fapqehbjgqpikwsqtmmh.supabase.co/auth/v1/callback
   https://community-events1.netlify.app
   http://localhost:5173
   ```
7. Copy Client ID and Client Secret
8. Go to Supabase → Authentication → Providers → Google
9. Enable Google provider and add credentials

### 7. Run Development Servers

#### Terminal 1 - Backend Server:
```bash
cd backend
npm start
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
- **3D Secure:** `4000 0025 0000 3155`
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

---

## 🔐 Security

- **Authentication:** Supabase Auth with email/password & Google OAuth
- **Authorization:** Row Level Security (RLS) policies
  - Users can only edit/delete their own events
  - Anyone can view events
  - Authenticated users can sign up for events
  - Users can only view their own payments
  - Staff/Admin can create events
- **Payment Security:** Stripe Checkout with PCI compliance
- **Password Security:** Minimum 6 characters, hashed by Supabase
- **API Keys:** Stored in environment variables (not committed to Git)
- **HTTPS:** Enforced in production via Netlify and Render
- **CORS:** Configured for frontend-backend communication
- **SQL Injection Protection:** Parameterized queries via Supabase

---

## 🎨 Features Walkthrough

### For Event Creators (Staff/Admin)
1. **Sign Up/Login:** Create account with email or Google
2. **Request Staff Role:** Contact admin to upgrade from user to staff
3. **Create Event:** Navigate to "Create Event", fill form, upload/select image
4. **Set Pricing:** Choose between free or paid events (in GBP £)
5. **Manage Events:** View your events in "My Events" dashboard
6. **Edit/Delete:** Modify or remove events you created

### For Community Members
1. **Browse Events:** View all upcoming events on "Events" page
2. **Featured Events:** See highlighted events on homepage
3. **Event Details:** Click on event to see full details
4. **Authentication:** Sign up with email or Google account
5. **Purchase Tickets:** For paid events, complete secure Stripe checkout
6. **Sign Up (Free Events):** Click "Sign Up for Event" button
7. **Add to Calendar:** Click "Add to Google Calendar" to sync
8. **Payment Confirmation:** View success page after completing purchase
9. **Cancel Payment:** Return to event page if you cancel Stripe checkout
10. **Manage Profile:** Update password in profile settings
11. **View My Events:** See all events you've signed up for

---

## 📱 Mobile Features

- ✅ **Responsive navbar** with hamburger menu
- ✅ **Touch-optimized** buttons and inputs
- ✅ **Mobile-friendly** event cards and grids
- ✅ **Optimized** form layouts for small screens
- ✅ **Proper viewport** configuration for iOS and Android
- ✅ **Centered content** on all screen sizes

---

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Add environment variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_UNSPLASH_KEY
   VITE_STRIPE_PUBLIC_KEY
   VITE_API_BASE_URL=https://events-platform-backend-w6su.onrender.com/api
   ```
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 or higher
4. Add `netlify.toml` for client-side routing:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Backend (Render)
1. Connect GitHub repository to Render
2. Create new Web Service
3. Add environment variables:
   ```
   STRIPE_SECRET_KEY
   CLIENT_URL=https://community-events1.netlify.app
   SUPABASE_URL
   SUPABASE_SERVICE_KEY
   ```
4. Build settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:** Node
5. Wait for deployment (auto-deploys on git push)

### Production URLs
- **Frontend:** https://community-events1.netlify.app
- **Backend:** https://events-platform-backend-w6su.onrender.com

---

## 👨‍💻 Author

**Vanit Kashab**
- GitHub: [@Vanitk1](https://github.com/Vanitk1)
- LinkedIn: [vanit-k-11059b151](https://www.linkedin.com/in/vanit-k-11059b151)
- Email: vanitkashab@gmail.com

---

## 🙏 Acknowledgments

- **Skills Bootcamp:** Software Development Bootcamp in JavaScript @ Northcoders
- **Supabase** for backend infrastructure and authentication
- **Stripe** for secure payment processing
- **Unsplash** for beautiful event images
- **Google** for OAuth and Calendar integration
- **Netlify** for seamless frontend hosting
- **Render** for reliable backend hosting
- **React** & **Vite** for modern development experience
- **Emojipedia** for all the emojis 🎉

*Last updated: October 2024*
