const fetch = require('node-fetch');
const FormData = require('form-data');
const formidable = require('formidable');

module.exports = async (req, res) => {
  // Read the bot token from Vercel's environment variable
  const botToken = process.env.TOKEN;

  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'Bot token not configured.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // Parse the incoming FormData using formidable
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ ok: false, error: 'Failed to parse form data.' });
    }

    const chatId = fields.chat_id;
    const caption = fields.caption;

    if (!chatId) {
      return res.status(400).json({ ok: false, error: 'Chat ID is required.' });
    }

    try {
      // Handle photo if present
      if (files.photo) {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', require('fs').createReadStream(files.photo.path), { filename: 'photo.jpg' });
        formData.append('caption', caption);

        const responsePhoto = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: formData
        });
        const resultPhoto = await responsePhoto.json();

        if (!resultPhoto.ok) {
          console.error('Telegram API error (photo):', resultPhoto);
          return res.status(500).json({ ok: false, error: resultPhoto.description });
        }
      }

      // Handle video if present
      if (files.video) {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('video', require('fs').createReadStream(files.video.path), { filename: 'video.mp4' });
        formData.append('caption', caption);

        const responseVideo = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
          method: 'POST',
          body: formData
        });
        const resultVideo = await responseVideo.json();

        if (!resultVideo.ok) {
          console.error('Telegram API error (video):', resultVideo);
          return res.status(500).json({ ok: false, error: resultVideo.description });
        }
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Error in sendMedia:', error);
      return res.status(500).json({ ok: false, error: 'Failed to send media.' });
    }
  });
};
