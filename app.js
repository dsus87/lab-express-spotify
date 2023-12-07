require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const axios = require("axios"); // make calls/requests to external APIs

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


// Our routes go here:


// homepage route
app.get('/', (req, res) => {
  res.render('index');
});


// Artist search route
app.get('/artist-search', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log('Search artists:', data.body);
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch(err => {
      console.error('Error searching artists:', err);
      res.send('Error occurred while searching for artists');
    });
});

// Artist album route

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log('Artist albums', data.body);
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => {
      console.error('Error fetching artist albums:', err);
      res.send('Error occurred while fetching albums');
    });
});

// Tracks Route

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log('Album tracks', data.body);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => {
      console.error('Error fetching album tracks:', err);
      res.send('Error occurred while fetching tracks');
    });
});