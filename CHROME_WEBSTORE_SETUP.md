# Chrome Web Store API Setup Guide

## Overview

This guide explains how to set up Chrome Web Store API access for automated extension publishing.

## Prerequisites

- Google Cloud Console access
- Chrome Web Store Developer Account
- Extension already published on Chrome Web Store

## Step 1: Enable Chrome Web Store API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Navigate to **APIs & Services > Library**
4. Search for "Chrome Web Store API"
5. Click on it and press **Enable**

## Step 2: Create OAuth2 Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure the OAuth consent screen if prompted
4. Choose **Web application** as the application type
5. Add authorized redirect URIs:
   - `http://localhost:8080`
   - `https://oauth2.googleapis.com/token`
6. Click **Create**
7. Note down the **Client ID** and **Client Secret**

## Step 3: Generate Refresh Token

### Option A: Using Google OAuth2 Playground (Recommended)

1. Go to [Google OAuth2 Playground](https://developers.google.com/oauthplayground/)
2. Click the settings icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your **Client ID** and **Client Secret**
5. Close settings
6. In the left panel, find and select:
   - **Chrome Web Store API v1**
   - **https://www.googleapis.com/auth/chromewebstore**
7. Click **Authorize APIs**
8. Sign in with your Google account
9. Click **Exchange authorization code for tokens**
10. Copy the **Refresh token**

### Option B: Using curl (Advanced)

```bash
# Step 1: Get authorization code
AUTH_URL="https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:8080&scope=https://www.googleapis.com/auth/chromewebstore&response_type=code&access_type=offline"

echo "Open this URL in your browser:"
echo "$AUTH_URL"

# Step 2: Exchange code for tokens
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:8080" \
  "https://oauth2.googleapis.com/token"
```

## Step 4: Get Extension ID

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Find your extension
3. Copy the **Extension ID** from the URL or extension details

## Step 5: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your repository > **Settings** > **Secrets and variables** > **Actions**
2. Add the following secrets:
   - `CHROME_CLIENT_ID`: Your OAuth2 Client ID
   - `CHROME_CLIENT_SECRET`: Your OAuth2 Client Secret
   - `CHROME_REFRESH_TOKEN`: Your Refresh Token

## Step 6: Update Workflow Configuration

Ensure your workflow uses the correct Extension ID:

```yaml
env:
  EXTENSION_ID: your-extension-id-here
```

## Troubleshooting

### 403 Forbidden Error

- Verify all OAuth2 credentials are correct
- Ensure Chrome Web Store API is enabled
- Check that Extension ID matches your published extension
- Verify your Chrome Web Store Developer Account is active

### Invalid Credentials

- Refresh tokens can expire - generate a new one
- Ensure OAuth2 client has the correct scopes
- Verify redirect URIs are properly configured

### API Not Enabled

- Go to Google Cloud Console > APIs & Services > Library
- Search for "Chrome Web Store API" and enable it

## Security Notes

- Never commit OAuth2 credentials to version control
- Use GitHub Secrets for all sensitive information
- Regularly rotate refresh tokens
- Monitor API usage in Google Cloud Console

## References

- [Chrome Web Store API Documentation](https://developer.chrome.com/docs/webstore/api/)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
