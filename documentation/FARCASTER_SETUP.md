# Farcaster Mini App Setup Guide

## Current Status

✅ **Completed:**
- App structure and components
- Proper loading pattern (splash screen → content → ready signal)
- Placeholder images (splash.png, icon.png, og-image.png)
- Manifest file at `.well-known/farcaster.json`
- Social sharing with compose cast
- Multicall optimization for fast data loading

⚠️ **Requires Action:**
- Sign manifest to enable "Add to Apps" feature
- Replace placeholder images with branded designs
- Implement dynamic OG images
- Set up webhook for notifications (optional)

## How to Sign Your Manifest

### Step 1: Deploy to Production Domain
The manifest must be signed for your production domain (not ngrok). The signed domain must match exactly where the manifest is hosted.

### Step 2: Sign the Manifest
1. Go to: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your production domain (e.g., `lendfriend.com` or `app.lendfriend.com`)
3. The tool will generate the `accountAssociation` object with:
   - `header` - Account type and key info
   - `payload` - Domain information (base64url encoded)
   - `signature` - Cryptographic signature

### Step 3: Update Manifest
Add the `accountAssociation` object to `/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "miniapp": {
    "version": "1",
    "name": "LendFriend",
    ...
  }
}
```

### Step 4: Enable "Add to Apps" Prompt
Uncomment the timer code in `/src/components/AddToAppsPrompt.tsx` (lines 24-28):

```typescript
const timer = setTimeout(() => {
  setShowPrompt(true);
}, 3000);

return () => clearTimeout(timer);
```

## Testing Your Mini App

### Preview Tool
Test your app before going live:
https://farcaster.xyz/~/developers/mini-apps/preview

Enter your app URL and verify:
- Splash screen appears
- Content loads properly
- Images display correctly
- Interactions work as expected

### Validation Checklist

From the [Farcaster Agents Checklist](https://miniapps.farcaster.xyz/docs/guides/agents-checklist):

- [ ] Manifest is accessible at `/.well-known/farcaster.json`
- [ ] Manifest has valid `accountAssociation` with signature
- [ ] Domain in manifest matches hosting domain exactly
- [ ] Splash image is 200x200px
- [ ] App icon exists
- [ ] Embed image is 3:2 aspect ratio
- [ ] Button title is max 32 characters
- [ ] App calls `sdk.actions.ready()` after initialization
- [ ] All required capabilities are listed

## Image Specifications

### Splash Screen
- **Size:** 200x200px recommended
- **Current:** `/public/splash.png` (placeholder)
- **Used in:** Manifest and metadata `splashImageUrl`

### App Icon
- **Size:** 200x200px recommended
- **Current:** `/public/icon.png` (placeholder)
- **Used in:** Manifest `iconUrl`, app catalog

### OG Image
- **Size:** 1200x630px (Open Graph standard)
- **Current:** `/public/og-image.png` (placeholder)
- **Used in:** Social previews when sharing

### Embed Image
- **Aspect:** 3:2 ratio (e.g., 1200x800px)
- **Current:** Placeholder from placehold.co
- **Used in:** Cast embeds for viral sharing

## Next Steps for Production

1. **Get Production Domain**
   - Deploy to permanent domain (not ngrok tunnel)
   - Ensure SSL certificate is valid

2. **Sign Manifest**
   - Use signing tool with production domain
   - Update manifest with `accountAssociation`

3. **Create Branded Images**
   - Design proper splash screen (200x200px)
   - Design app icon (200x200px)
   - Create OG image (1200x630px)
   - Replace placeholders in `/public/`

4. **Implement Dynamic OG**
   - Build API route at `/api/og/loan/[address]/route.tsx`
   - Use `@vercel/og` or `satori` for image generation
   - Show loan name, progress, supporters

5. **Optional: Set Up Notifications**
   - Create webhook endpoint at `/api/webhook`
   - Add `webhookUrl` to manifest
   - Handle notification token events
   - Send in-app notifications for loan updates

6. **Test & Launch**
   - Test in preview tool
   - Share test cast
   - Verify all functionality
   - Submit to Farcaster app directory

## Common Issues

### "Invalid domain manifest" Error
- Manifest is missing `accountAssociation`
- Domain in signature doesn't match hosting domain
- Manifest not accessible at `/.well-known/farcaster.json`

### Splash Screen Not Showing
- Image files don't exist at specified URLs
- Calling `ready()` too early (should wait for content)
- Wrong image dimensions

### "Page Unresponsive"
- Fixed with multicall optimization
- Ensure `ready()` is called after data loads
- Check for slow IPFS metadata fetches

## Resources

- **Manifest Signing:** https://farcaster.xyz/~/developers/mini-apps/manifest
- **Preview Tool:** https://farcaster.xyz/~/developers/mini-apps/preview
- **Agents Checklist:** https://miniapps.farcaster.xyz/docs/guides/agents-checklist
- **Loading Guide:** https://miniapps.farcaster.xyz/docs/guides/loading
- **Full Docs:** https://miniapps.farcaster.xyz/docs

## Current App URLs

- **Development:** https://far-micro.ngrok.dev (ngrok tunnel)
- **Manifest:** https://far-micro.ngrok.dev/.well-known/farcaster.json
- **Splash:** https://far-micro.ngrok.dev/splash.png
- **Icon:** https://far-micro.ngrok.dev/icon.png
- **OG Image:** https://far-micro.ngrok.dev/og-image.png

**Note:** ngrok URLs are temporary. Deploy to production domain before signing manifest.
