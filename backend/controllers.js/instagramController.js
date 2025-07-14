const axios = require('axios');
require('dotenv').config();

const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  REDIRECT_URI
} = process.env;

let longLivedToken = ''; // In production, store in DB

exports.getAuthUrl = (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`;
  res.json({ authUrl });
};

exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Received OAuth code:", code);

    // Exchange code for short-lived token
    const tokenRes = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: INSTAGRAM_APP_ID,
        redirect_uri: REDIRECT_URI,
        client_secret: INSTAGRAM_APP_SECRET,
        code
      }
    });

    const shortLivedToken = tokenRes.data.access_token;
    console.log("Short-lived token:", shortLivedToken);

    // Exchange short-lived token for long-lived token
    const longTokenRes = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        fb_exchange_token: shortLivedToken
      }
    });

    const longLivedToken = longTokenRes.data.access_token;
    console.log("Long-lived token:", longLivedToken);

    // Get user's managed Facebook Pages
    const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedToken}`);
    const pages = pagesRes.data.data;

    if (!pages || pages.length === 0) {
      return res.status(400).json({ error: "No Facebook Pages found for this user." });
    }

    // Loop through pages to find the one with Instagram linked
    let igUserId = null;
    let validPageId = null;

    for (const page of pages) {
      const pageId = page.id;

      try {
        const igRes = await axios.get(
          `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${longLivedToken}`
        );

        const igBusiness = igRes.data.instagram_business_account;

        if (igBusiness && igBusiness.id) {
          igUserId = igBusiness.id;
          validPageId = pageId;
          break;
        }
      } catch (innerErr) {
        console.warn(`Error checking page ${pageId}:`, innerErr.response?.data || innerErr.message);
      }
    }

    if (!igUserId) {
      return res.status(400).json({
        error: "No Instagram Business Account linked to any Facebook Page.",
        pagesChecked: pages.map(p => p.id)
      });
    }

    console.log("Selected IG User ID:", igUserId);
    res.redirect(`https://instagram-es2b.vercel.app/?access_token=${longLivedToken}&ig_user_id=${igUserId}`);

  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ error: "OAuth Failed", details: err.response?.data || err.message });
  }
};


exports.postToInstagram = async (req, res) => {
  try {
    const { accessToken, igUserId, imageUrl, caption } = req.body;

    const media = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
      image_url: imageUrl,
      caption,
      access_token: accessToken
    });

    const publish = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
      creation_id: media.data.id,
      access_token: accessToken
    });

    res.json({ success: true, publishId: publish.data.id });
  } catch (err) {
    console.error('Posting Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Instagram post failed' });
  }
};
