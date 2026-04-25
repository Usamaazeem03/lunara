# Avatar Upload System Setup Guide

Complete guide to enable avatar image functionality with Google login integration and Supabase storage.

## What's Implemented ✅

### Features

- **Upload profile photos** - Users can upload JPEG, PNG, WebP, or GIF images (max 5MB)
- **Google profile pictures** - Automatically shows Google profile photo if user logs in via Google
- **Email/Password avatars** - Users can upload custom profile photos for email/password accounts
- **Fast storage** - Images stored in Supabase Storage with public URLs
- **Database tracking** - Avatar URLs saved to `profiles.avatar_img` column

### Files Created

1. **`/src/services/avatarService.js`** - Avatar upload and management service
2. **`/src/Shared/ProfileModal.jsx`** - Updated with real avatar functionality

### Files Modified

1. **`/src/hooks/useAuth.js`** - Added avatar fetching and Google profile picture support
2. **`/src/Shared/ProfileModal.jsx`** - Added upload form and real avatar display

---

## Supabase Setup (Required Steps)

### Step 1: Add `avatar_img` Column to `profiles` Table

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Add avatar_img column to profiles table
ALTER TABLE public.profiles
ADD COLUMN avatar_img TEXT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.avatar_img IS
'Public URL of user''s avatar image stored in Supabase Storage';
```

### Step 2: Create Storage Bucket for Avatars

1. Go to **Supabase Dashboard** → **Storage**
2. Click **Create a new bucket**
3. Set bucket name: `avatars`
4. Make it **Public** (check "Public bucket" box)
5. Click **Create bucket**

### Step 3: Set Storage Bucket Policies

In the **Storage** section, select the `avatars` bucket:

1. Click on **Policies** tab
2. Create new policy for **SELECT** (Public Read):
   ```
   Name: Allow public read access
   Who can access: Public users
   Using expression: true
   ```
3. Create new policy for **INSERT** (Authenticated Upload):
   ```
   Name: Allow authenticated users to upload
   Who can insert: Authenticated users
   With permission: (storage.foldername(name) = concat(auth.uid()))
   ```

OR use simplified policies:

```sql
-- Public read access
CREATE POLICY "Public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatars
CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK
(
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 4: Verify Environment Variables

Open `.env` and verify you have:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

If missing, get them from **Supabase Dashboard** → **Settings** → **API**.

---

## How It Works

### Data Flow

```
User logs in via Google
  ↓
useAuth.js detects: user.app_metadata.provider = "google"
  ↓
Gets Google picture: user.user_metadata.picture
  ↓
Profile component displays Google picture

User logs in via Email/Password
  ↓
Can upload avatar in ProfileModal
  ↓
avatarService.uploadAvatar() handles:
  ├─ Validate file (JPEG, PNG, WebP, GIF, max 5MB)
  ├─ Upload to Supabase Storage /avatars/public/{userId}_{timestamp}.{ext}
  ├─ Get public URL
  ├─ Save URL to profiles.avatar_img
  └─ Return success/error
  ↓
Page refreshes → Shows new avatar
```

### Database Schema

```sql
-- profiles table gets new column:
avatar_img TEXT NULL → Stores public URL of avatar image

Example:
avatar_img = 'https://xyz.supabase.co/storage/v1/object/public/avatars/public/user-id_1649999999.jpg'
```

### Storage Structure

```
avatars/ (bucket)
└── public/ (folder)
    ├── user-id-1_1649999999.jpg
    ├── user-id-1_1649999998.png
    ├── user-id-2_1649999990.webp
    └── ...
```

---

## Testing the Feature

### Test Google Login Avatar

1. Go to login page
2. Click "Sign in with Google"
3. Login with a Google account
4. Dashboard loads → ProfileModal shows Google profile picture
5. Click profile → Avatar displays on left side with "✓ Google Login" badge

### Test Email/Password Avatar Upload

1. Go to login page
2. Click "Sign in with Email/Password"
3. Login with email account
4. Click profile → ProfileModal opens
5. Click "Upload Photo" button
6. Select JPEG, PNG, WebP, or GIF image (max 5MB)
7. Wait for "Profile photo updated successfully!"
8. Page refreshes → New avatar displays

### Test Error Handling

1. Try uploading file > 5MB → Error: "File size must be less than 5MB"
2. Try uploading PDF → Error: "Only JPEG, PNG, WebP, and GIF images are allowed"
3. Try uploading while offline → Error message displays gracefully

---

## Component Integration

### ProfileModal Props

```jsx
<ProfileModal
  profile={userProfile} // User's profile data with avatarUrl
  onClose={closeHandler} // Close modal handler
  onLogout={logoutHandler} // Logout handler
  brand="LUNARA" // Company brand name
  salonUrl={ownerSalonUrl} // For owners: their salon URL
/>
```

### useAuth Hook Returns

```jsx
const {
  user, // Supabase auth user (includes Google metadata)
  profile, // User profile from DB (includes avatar_img)
  uploadAvatar, // Function to upload avatar
  loading, // Loading state
} = useAuth();

// Profile object now includes:
profile.avatar_img; // URL of uploaded avatar
profile.avatarUrl; // Computed: Google pic OR uploaded avatar (in ProfileModal)
```

---

## API Reference

### `uploadAvatar(userId, file)`

Uploads avatar image to Supabase Storage and saves URL to database.

**Parameters:**

- `userId` (string, required) - User's ID from auth
- `file` (File, required) - Image file from input

**Returns:**

```js
{
  filename: "user-id_1649999999.jpg",
  publicUrl: "https://xyz.supabase.co/storage/v1/object/public/avatars/public/user-id_1649999999.jpg"
}
```

**Throws:**

- "File size must be less than 5MB"
- "Only JPEG, PNG, WebP, and GIF images are allowed"
- Network/storage errors

**Example:**

```jsx
const { uploadAvatar } = useAuth();

const handleUpload = async (file) => {
  try {
    const result = await uploadAvatar(user.id, file);
    console.log("Avatar URL:", result.publicUrl);
  } catch (error) {
    console.error(error.message);
  }
};
```

---

## Production Checklist

- [ ] Run SQL migration to add `avatar_img` column
- [ ] Create `avatars` bucket in Supabase Storage
- [ ] Set bucket policies (public read, authenticated write)
- [ ] Test Google login shows profile picture
- [ ] Test email login allows avatar upload
- [ ] Test file validation (size, type)
- [ ] Test error messages display correctly
- [ ] Verify profile picture persists after logout/login
- [ ] Check avatar URLs are HTTPS (for production)
- [ ] Monitor storage usage in Supabase dashboard
- [ ] Test on mobile devices (upload works)
- [ ] Verify CORS settings allow avatar display

---

## Troubleshooting

### Avatar not showing after upload

**Solution:** Clear browser cache and refresh page. Avatar stored in Supabase, page refresh triggers refetch from database.

### Upload button disabled/greyed out

**Solution:** Check user is authenticated. Upload only available after login.

### "File size must be less than 5MB" but file is smaller

**Solution:** Verify file type. Some browsers report different file sizes. Try different image.

### Avatar shows as broken image (404)

**Solution:**

1. Check bucket is public: Supabase → Storage → avatars → Public ✓
2. Check policy allows SELECT: Policies tab should have public read rule
3. Verify URL is HTTPS in production

### Google picture not appearing

**Solution:**

1. Verify Google login is set up in Supabase
2. Check `user.user_metadata.picture` exists in browser console
3. Ensure browser doesn't block external images (Google images)

---

## Performance Notes

- **Images cached** - Supabase CDN caches images for 3600 seconds (1 hour)
- **Downloads fast** - Images stored in public bucket, no auth needed
- **Storage efficient** - Old avatar versions kept but new upload overwrites
- **Bandwidth savings** - Google pictures loaded directly from Google, not stored twice

---

## Security Notes

- **File validation** - Server-side validation in avatarService.js
- **User isolation** - Each user's avatars in separate storage paths
- **Public storage** - Avatars intentionally public (user profiles visible)
- **No sensitive data** - Avatar_img column is just a URL string
- **CORS enabled** - Supabase CDN allows cross-origin image loading

---

## Future Enhancements

Potential features to add later:

- [ ] Crop/resize image before upload (client-side)
- [ ] Avatar placeholder/default image if none uploaded
- [ ] Avatar history/versions (keep old avatars)
- [ ] CDN optimization (WebP conversion, responsive sizes)
- [ ] Avatar frame borders/filters (like Instagram)
- [ ] Profile cover photo (banner image)

---

## Support

For issues with Supabase:

- **Docs:** https://supabase.com/docs/guides/storage/managing-files
- **Storage guide:** https://supabase.com/docs/guides/storage

For React/Vite issues:

- **useAuth hook:** Check `/src/hooks/useAuth.js`
- **Avatar service:** Check `/src/services/avatarService.js`
- **ProfileModal:** Check `/src/Shared/ProfileModal.jsx`

---

**Last Updated:** April 12, 2026
