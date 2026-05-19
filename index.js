import express from "express";
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';


const app = express();
const port = 4000;

dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get('/', async (req, res) => {
  try {
    const playerIds = [
      { name: 'LeBron', id: 1966, fullName: 'LeBron James', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9sb3MtYW5nZWxlcy1sYWtlcnMtbGVicm9uLWphbWVzMjAyMS1taW4tLWlfdXJhMmx0LnBuZz9iZz01ODJDODMmdD1mYWNlYm9vaw==.png', altText: 'An illustrated headshot of LeBron James' },
      { name: 'Jokic', id: 3112335, fullName: 'Nikola Jokic', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZW52ZXItbnVnZ2V0cy1uaWtvbGEtam9raWMyMDI1LS0ydGg4ZWo0ei5wbmc_Ymc9RkZDNzJDJnQ9ZmFjZWJvb2s=.png', altText: 'An illustrated headshot of Nikola Jokic' },
      { name: 'SGA', id: 4278073, fullName: 'Shai Gilgeous-Alexander', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9va2xhaG9tYS1jaXR5LXRodW5kZXItc2hhaS1naWxnZW91cy1hbGV4YW5kZXIyMDIzLW1pbi0tM2JvZHloZGsucG5nP2JnPTAwNzJDRSZ0PWZhY2Vib29r.png', altText: 'An illustrated headshot of Shai Gilgeous-Alexander' },
      { name: 'Cade', id: 4432166, fullName: 'Cade Cunningham', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZXRyb2l0LXBpc3RvbnMtY2FkZS1jdW5uaW5naGFtMjAyMi1taW4tLW42bmtodmxvLnBuZz9iZz0xRDQyOEEmdD1mYWNlYm9vaw==.png', altText: 'An illustrated headshot of Cade Cunningham' },
      { name: 'Wemby', id: 5104157, fullName: 'Victor Wembenyama', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9zYW4tYW50b25pby1zcHVycy12aWN0b3Itd2VtYmFueWFtYS0yMDI2LS16c3dqbjh5bi5wbmc_Ymc9OEQ5MDkzJnQ9ZmFjZWJvb2s=.png', altText: 'An illustrated headshot of Victor Wembenyama' }
    ];

    const apiCalls = playerIds.map(player =>
      axios.request({
        method: 'GET',
        url: `https://nba-api-free-data.p.rapidapi.com/nba-player-gamelog?playerid=${player.id}`,
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
        }
      }).then(response => {
        const seasonTypes = response.data.response.gamelog.seasonTypes;
        const postseasonData = seasonTypes.find(season => season.displayName.includes("Postseason"));
        return {
          player: player.fullName,
          minutes: postseasonData?.summary.stats[0].stats[0] || 'N/A',
          points: postseasonData?.summary.stats[0].stats[13] || 'N/A',
          assists: postseasonData?.summary.stats[0].stats[8] || 'N/A',
          rebounds: postseasonData?.summary.stats[0].stats[7] || 'N/A',
          fgPercentage: postseasonData?.summary.stats[0].stats[2] || 'N/A',
          image: player.image,
          altText: player.altText
        };
      })
    );

    const allPlayerStats = await Promise.all(apiCalls);
    console.log(allPlayerStats);
    res.render("main.ejs", { allPlayerStats });
  } catch (error) {
    console.error('Error:', error.message);
    res.render("main.ejs", { error: error.message });
  }
});


app.get('/fetch-data', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://nba-api-free-data.p.rapidapi.com/nba-player-gamelog?playerid=1966',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const seasonTypes = response.data.response.gamelog.seasonTypes;

    const postseasonData = seasonTypes.find(
      season => season.displayName = "25-26 Postseason"
    );
    const minutes = postseasonData.summary.stats[0].stats[0]

    res.json(postseasonData || { error: 'No postseason data found' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
