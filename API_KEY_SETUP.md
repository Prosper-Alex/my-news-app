# NEWS_API_KEY Configuration Guide

## Problem Solved

The app was crashing during build/prerender with **"Missing NEWS_API_KEY environment variable"** because:

1. `lib/api.ts` called `fetchTopHeadlines()` during server-side rendering
2. This function immediately threw an error if `NEWS_API_KEY` was missing
3. The root page (`app/page.tsx`) called this function at build time, causing the build to fail

## Solution Implemented

### 1. **Safe API Key Access** (`lib/api.ts`)

- Changed from throwing an error to returning an empty array when `NEWS_API_KEY` is missing
- Added a warning log so developers know the API key isn't set
- This prevents build-time crashes

### 2. **Runtime Validation** (`app/api/news/route.ts`)

- Added proper `NEWS_API_KEY` validation at the API route level
- Returns a user-friendly error message with setup instructions
- Only checks the key when actual requests are made (runtime, not build time)

### 3. **Dynamic Rendering** (`app/page.tsx`)

- Added `export const dynamic = "force-dynamic"` to prevent static prerendering
- Wrapped the fetch call in try-catch for graceful error handling
- Passes empty array to HomePage if fetch fails, allowing the UI to render

### 4. **Fallback UI** (`components/ui/api-config-error.tsx`)

- New component displays a helpful error message when API isn't configured
- Shows step-by-step setup instructions
- Links directly to newsapi.org for getting a free API key
- Only shown to users when API configuration is genuinely missing

### 5. **Smart Error Detection** (`components/home/home-page.tsx`)

- Detects API configuration errors in the error state
- Shows the helpful `ApiConfigError` component instead of generic error
- Still shows "No results" for actual empty search results

### 6. **Environment Setup** (`.env.example`)

- Created template with clear instructions
- Explains how to get a free API key from newsapi.org
- Documents optional `NEWS_API_BASE_URL` override

## Setup Instructions for Users

### For Development:

```bash
# 1. Copy the example env file
cp .env.example .env.local

# 2. Get a free API key
# Visit: https://newsapi.org/account
# Sign up or log in
# Copy your API key

# 3. Add to .env.local
NEWS_API_KEY=paste_your_key_here

# 4. Restart dev server
pnpm dev
```

### For Production/Vercel:

1. Set `NEWS_API_KEY` in your deployment platform's environment variables
2. The app will work correctly at build time (thanks to dynamic rendering)
3. All requests will be validated at runtime

## Key Architecture Changes

### Before:

```
app/page.tsx → fetchTopHeadlines() → throws error immediately
  └─ Build crashes if NEWS_API_KEY missing
```

### After:

```
app/page.tsx → fetchTopHeadlines() → returns []
  └─ Returns empty array (safe at build time)
  └─ Client hook tries to fetch via /api/news at runtime
      └─ API route validates NEWS_API_KEY
      └─ Shows helpful error if missing
      └─ UI shows ApiConfigError with setup guide
```

## Testing the Setup

### With API Key:

```bash
NEWS_API_KEY=your_key pnpm dev
# ✅ News fetches normally
```

### Without API Key:

```bash
unset NEWS_API_KEY && pnpm dev
# ⚠️ Shows helpful error message with setup guide
# ✅ App doesn't crash
# ✅ Build succeeds
```

## Files Modified

1. **lib/api.ts** - Changed error throwing to graceful fallback
2. **app/api/news/route.ts** - Added runtime API key validation
3. **app/page.tsx** - Made dynamic + added error handling
4. **components/home/home-page.tsx** - Added ApiConfigError detection
5. **.env.example** - Created with setup instructions
6. **README.md** - Updated with better setup docs
7. **components/ui/api-config-error.tsx** - New fallback UI component

## Benefits

✅ **Build Safety**: App builds successfully even without API key  
✅ **Better UX**: Users get helpful errors instead of crashes  
✅ **Clear Setup**: Step-by-step instructions in the UI  
✅ **Security**: API key never exposed to browser  
✅ **Graceful Degradation**: Features work even during configuration phase

## Fallback Behavior

| Scenario                   | Behavior                                      |
| -------------------------- | --------------------------------------------- |
| API key missing at build   | Returns empty array, no crash                 |
| API key missing at runtime | Shows helpful error with setup guide          |
| API key set but expired    | Shows API rejection error                     |
| API rate limited (429)     | Shows retryable error with button             |
| Search with no results     | Shows "No results" message (not config error) |
| Network error              | Shows "Couldn't load" with retry button       |
