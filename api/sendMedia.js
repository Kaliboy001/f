const fetch = require('node-fetch');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
  // Read the bot token from Vercel's environment variable
  const botToken = process.env.TOKEN;

  if (!botToken) {
    console.error('Bot token not configured.');
    return res.status(500).json({ ok: false, error: 'Bot token not configured.' });
  }

  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
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
    const caption = fields.caption || '⚡Join ➣ @Kali_Linux_BOTS';

    if (!chatId) {
      console.error('Chat ID is required, got:', chatId);
      return res.status(400).json({ ok: false, error: 'Chat ID is required.' });
    }

    try {
      // Handle photo if present
      if (files.photo) {
        if (!files.photo.filepath) {
          console.error('Photo filepath not found:', files.photo);
          return res.status(400).json({ ok: false, error: 'Photo filepath not found.' });
        }
        console.log('Processing photo, file size:', files.photo.size);
        if (files.photo.size > 20 * 1024 * 1024) { // 20 MB limit for Telegram photos
          console.error('Photo too large:', files.photo.size);
          return res.status(400).json({ ok: false, error: 'Photo too large (max 20 MB).' });
        }

        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', fs.createReadStream(files.photo.filepath), { filename: 'photo.jpg' });
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
        console.log('Photo sent successfully:', resultPhoto);
      }

      // Handle video if present
      if (files.video) {
        if (!files.video.filepath) {
          console.error('Video filepath not found:', files.video);
          return res.status(400).json({ ok: false, error: 'Video filepath not found.' });
        }
        console.log('Processing video, file size:', files.video.size);
        if (files.video.size > 50 * 1024 * 1024) { // 50 MB limit for Telegram videos
          console.error('Video too large:', files.video.size);
          return res.status(400).json({ ok: false, error: 'Video too large (max 50 MB).' });
        }

        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('video', fs.createReadStream(files.video.filepath), { filename: 'video.mp4' });
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
        console.log('Video sent successfully:', resultVideo);
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Error in sendMedia:', error);
      return res.status(500).json({ ok: false, error: 'Failed to send media: ' + error.message });
    }
  });
};
