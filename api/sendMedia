const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Read the bot token from Vercel's environment variable
  const botToken = process.env.TOKEN;

  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'Bot token not configured.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // Parse the FormData from the request
  const chatId = req.body.chat_id;
  const caption = req.body.caption;

  if (!chatId) {
    return res.status(400).json({ ok: false, error: 'Chat ID is required.' });
  }

  try {
    // Handle photo upload
    if (req.body.photo) {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', req.body.photo);
      formData.append('caption', caption);

      const responsePhoto = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const resultPhoto = await responsePhoto.json();

      if (!resultPhoto.ok) {
        return res.status(500).json({ ok: false, error: resultPhoto.description });
      }
    }

    // Handle video upload
    if (req.body.video) {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('video', req.body.video);
      formData.append('caption', caption);

      const responseVideo = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
        method: 'POST',
        body: formData
      });
      const resultVideo = await responseVideo.json();

      if (!resultVideo.ok) {
        return res.status(500).json({ ok: false, error: resultVideo.description });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error in sendMedia:', error);
    return res.status(500).json({ ok: false, error: 'Failed to send media.' });
  }
};
