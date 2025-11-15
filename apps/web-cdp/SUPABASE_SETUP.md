# Supabase Setup for Farcaster Profile Editing

This guide will help you set up Supabase to store Farcaster signer UUIDs for persistent profile editing.

## Why Supabase?

When users create a Farcaster account, Neynar gives us a `signer_uuid` - the "permission slip" to update their profile. We need to store this somewhere permanent so it works:
- Across browser sessions
- On different devices
- Even after clearing cache

Supabase gives us a simple, free database to store these "permission slips."

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest)

---

## Step 2: Create a New Project (3 minutes)

1. Click "New Project"
2. Fill in:
   - **Name**: `lendfriend-farcaster` (or whatever you want)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine
3. Click "Create new project"
4. Wait 2-3 minutes while it sets up

---

## Step 3: Run Database Schema (2 minutes)

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Copy the entire contents of `/supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

This creates the `farcaster_accounts` table.

---

## Step 4: Get Your API Keys (1 minute)

1. In Supabase dashboard, click **"Settings"** (gear icon) in left sidebar
2. Click **"API"** under "Configuration"
3. You'll see two important values:

**Copy these:**
- **Project URL** - looks like `https://xxx.supabase.co`
- **service_role key** - long string starting with `eyJ...`
  - **Important**: Use the `service_role` key, NOT the `anon` key
  - Click "Reveal" next to `service_role` to see it

---

## Step 5: Add Environment Variables (1 minute)

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

Replace with YOUR actual values from Step 4.

**Security Note:**
- `NEXT_PUBLIC_SUPABASE_URL` is public (OK to expose)
- `SUPABASE_SERVICE_KEY` is SECRET (never commit to git, never expose in frontend)

---

## Step 6: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

---

## Step 7: Test It! (2 minutes)

1. Go to http://localhost:3004
2. Create a new Farcaster account (or use existing)
3. Check server logs - you should see:
   ```
   [Farcaster] ✓ Saved to database
   ```
4. Go to Supabase dashboard → **"Table Editor"** → `farcaster_accounts`
5. You should see your account info!

---

## Verify It's Working

### Test 1: Create Account
- Create a Farcaster account in your app
- Server logs should show: `[Farcaster] ✓ Saved to database`
- Supabase table should have 1 row

### Test 2: Retrieve Signer
- Refresh the page
- Go to Account Settings
- Click "Edit Profile"
- Should work WITHOUT clicking "Enable Profile Editing"
- Server logs: `[Farcaster] ✓ Retrieved signer from database`

### Test 3: Cross-Browser
- Open your app in a different browser
- Log in with same wallet
- Go to Account Settings → Edit Profile
- Should work immediately (signer loaded from database)

---

## Troubleshooting

### Error: "Missing Supabase configuration"
- Check `.env.local` has both variables
- Restart dev server after adding env vars

### Error: "relation 'farcaster_accounts' does not exist"
- You didn't run the SQL schema
- Go back to Step 3

### Error: "row-level security policy"
- Check the schema has the `service_role` policy
- Make sure you're using `SUPABASE_SERVICE_KEY` not anon key

### Database saves but retrieval fails
- Check the `wallet_address` is lowercase in database
- Our code converts to lowercase: `walletAddress.toLowerCase()`

### Want to see what's in the database?
1. Supabase Dashboard → Table Editor
2. Click `farcaster_accounts`
3. See all stored accounts

---

## What Gets Stored?

```
wallet_address: "0x9ad8...3998"  (your wallet)
fid: 1471595                     (Farcaster ID)
username: "andrewag"             (Farcaster username)
signer_uuid: "89ebe982-..."      (the "permission slip")
signer_status: "approved"        (status)
created_at: "2025-11-14..."      (when created)
```

**Privacy Note**: Only your wallet address and public Farcaster info is stored. No private keys, no passwords.

---

## Security Best Practices

✅ **DO:**
- Use `SUPABASE_SERVICE_KEY` in API routes only (server-side)
- Add `.env.local` to `.gitignore`
- Enable Row Level Security (already done in schema)

❌ **DON'T:**
- Commit `SUPABASE_SERVICE_KEY` to git
- Use `service_role` key in frontend code
- Share your database password

---

## Cost

**Free tier includes:**
- 500 MB database
- 1 GB file storage
- 50 MB database size
- Unlimited API requests

For this use case (storing signer UUIDs), free tier is more than enough. Even with 10,000 users, you'll only use ~1 MB.

---

## Next Steps

Once Supabase is set up:
- ✅ Profile editing works persistently
- ✅ No more localStorage issues
- ✅ Works across devices
- ✅ Users never see "Enable Profile Editing" button

That's it! Your Farcaster profile editing is now production-ready.

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check server logs for detailed error messages
