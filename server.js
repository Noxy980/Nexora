// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration CORS sécurisée
const allowedOrigins = [
  'http://localhost:3000',
  'https://nexoralink.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
}));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; // ex: https://votre-backend.onrender.com/callback
const FRONTEND_URL = process.env.FRONTEND_URL; // ex: https://nexoralink.netlify.app

// 1. Redirection vers l'authentification Spotify
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    }));
});

// 2. Callback Spotify et récupération du Token
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      }
    });

    const { access_token, refresh_token } = response.data;
    
    // Redirection vers le frontend avec les tokens (en production, préférez des cookies HttpOnly pour plus de sécurité)
    res.redirect(`${FRONTEND_URL}/?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error.message);
    res.redirect(`${FRONTEND_URL}/?error=invalid_token`);
  }
});

// 3. Endpoint fictif pour le flux audio (La logique de contournement est omise)
app.get('/api/stream/:trackId', (req, res) => {
    // Logique standard de récupération de flux autorisée à insérer ici
    res.status(501).send("Logique de streaming à implémenter selon les ToS.");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
