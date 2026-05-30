// src/App.js
import React, { useEffect, useState } from 'react';

// Utilisez des variables d'environnement React pour pointer vers le bon backend selon l'environnement
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Récupération du token depuis l'URL après la redirection du backend
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      setToken(accessToken);
      // Nettoyer l'URL pour la sécurité et l'UX
      window.history.pushState({}, null, '/');
    }
  }, []);

  const handleLogin = () => {
    // Redirige vers la route de login du backend
    window.location.href = `${BACKEND_URL}/login`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">NexoraLink</h1>
      
      {!token ? (
        <button 
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Se connecter avec Spotify
        </button>
      ) : (
        <div>
          <p className="text-green-400">Connecté avec succès !</p>
          {/* Composants de lecteur audio et de recherche ici */}
        </div>
      )}
    </div>
  );
}

export default App;