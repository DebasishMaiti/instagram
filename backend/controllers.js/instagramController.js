const axios = require('axios');
require('dotenv').config();

const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  REDIRECT_URI
} = process.env;

let longLivedToken = ''; 

exports.getAuthUrl = (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`;
  res.json({ authUrl });
};

exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: INSTAGRAM_APP_ID,
        redirect_uri: REDIRECT_URI,
        client_secret: INSTAGRAM_APP_SECRET,
        code
      }
    });

    const shortLivedToken = tokenRes.data.access_token;

    const longTokenRes = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        fb_exchange_token: shortLivedToken
      }
    });

    longLivedToken = longTokenRes.data.access_token;

    const pages = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedToken}`);
    const pageId = pages.data.data[0].id;

    const ig = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${longLivedToken}`);
    const igUserId = ig.data.instagram_business_account.id;

    res.redirect(`https://instagram-jade-mu.vercel.app/?access_token=${longLivedToken}&ig_user_id=${igUserId}`);
  } catch (err) {
    console.error('OAuth Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'OAuth Failed' });
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