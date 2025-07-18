# Setting up Vercel KV for Persistent Feed

To make the community feed persistent, follow these steps:

## 1. Enable Vercel KV

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `defeatai` project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "KV" (Redis-compatible)
6. Choose a name (e.g., "defeatai-feed")
7. Select your preferred region
8. Click "Create"

## 2. Connect KV to your project

1. After creating the database, click "Connect Project"
2. Select your `defeatai` project
3. Choose the environments (Production, Preview, Development)
4. Click "Connect"

## 3. Environment Variables

Vercel will automatically add these environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## 4. Redeploy

After connecting KV, redeploy your project:
```bash
vercel --prod --force
```

## 5. Verify

Your feed should now persist across deployments and server restarts!

## Local Development

For local development without KV, the app will gracefully fall back to non-persistent mode.