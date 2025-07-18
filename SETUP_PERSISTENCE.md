# Setting up Persistent Storage for Community Feed

The app now supports Upstash Redis for free, persistent storage of the community feed.

## Quick Setup (5 minutes)

### 1. Create Upstash Account
1. Go to [upstash.com](https://upstash.com)
2. Sign up for a free account (GitHub login available)
3. No credit card required!

### 2. Create Redis Database
1. Click "Create Database"
2. Name: `defeatai-feed` (or any name)
3. Type: Regional
4. Region: Choose closest to your users
5. Click "Create"

### 3. Get Credentials
1. In your database dashboard, go to "REST API" section
2. Copy these values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 4. Add to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `defeatai` project
3. Go to "Settings" → "Environment Variables"
4. Add both variables:
   - Name: `UPSTASH_REDIS_REST_URL`
   - Value: (paste the URL from Upstash)
   - Environment: Production, Preview, Development
   
   - Name: `UPSTASH_REDIS_REST_TOKEN`
   - Value: (paste the token from Upstash)
   - Environment: Production, Preview, Development

### 5. Redeploy
```bash
vercel --prod --force
```

## That's it! 🎉

Your feed is now persistent and will survive:
- Server restarts
- New deployments
- Multiple instances

## Free Tier Limits
- 10,000 commands per day (more than enough!)
- 256MB storage
- No credit card required

## Local Development
The app works without Redis in development - it just won't persist data.