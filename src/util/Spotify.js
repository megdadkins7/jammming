const clientId = '81304cd5a319419a9bc81317438fbe25';
const redirectUri = 'http://localhost:3000/';

const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;

let accessToken;

let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    /*If the access token and expiration time are in the URL, implement the following:
			Set the access token value
			Set a variable for expiration time
			Set the access token to expire at the value for expiration time
			Clear the parameters from the URL, so the app doesn't 
			   try grabbing the access token after it has expired*/
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = spotifyUrl;
    }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();

    //You should use the /v1/search?type=TRACK endpoint when making your request.
    //https://developer.spotify.com/documentation/web-api/reference/

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('API request failed');
        }
      })
      .then(jsonResponse => {
        if (!jsonResponse.tracks) return [];
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          };
        });
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris || trackUris.length === 0) return;

    const userUrl = 'https://api.spotify.com/v1/me';

    let userId;
    let playlistId;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    fetch(userUrl, { headers: headers })
      .then(response => response.json())
      .then(jsonResponse => (userId = jsonResponse.id))
      .then(() => {
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
        fetch(createPlaylistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: name,
          }),
        })
          .then(response => response.json())
          .then(jsonResponse => (playlistId = jsonResponse.id))
          .then(() => {
            const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
            fetch(addPlaylistTracksUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                uris: trackUris,
              }),
            });
          });
      });
  },
};

export default Spotify;
