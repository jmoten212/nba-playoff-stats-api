import express from "express";
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const playerIds = [
  { name: 'LeBron', id: 1966, fullName: 'LeBron James', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9sb3MtYW5nZWxlcy1sYWtlcnMtbGVicm9uLWphbWVzMjAyMS1taW4tLWlfdXJhMmx0LnBuZz9iZz01ODJDODMmdD1mYWNlYm9vaw==.png', altText: 'An animated headshot of LeBron James' },
  { name: 'Jokic', id: 3112335, fullName: 'Nikola Jokic', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZW52ZXItbnVnZ2V0cy1uaWtvbGEtam9raWMyMDI1LS0ydGg4ZWo0ei5wbmc_Ymc9RkZDNzJDJnQ9ZmFjZWJvb2s=.png', altText: 'An animated headshot of Nikola Jokic' },
  { name: 'SGA', id: 4278073, fullName: 'Shai Gilgeous-Alexander', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9va2xhaG9tYS1jaXR5LXRodW5kZXItc2hhaS1naWxnZW91cy1hbGV4YW5kZXIyMDIzLW1pbi0tM2JvZHloZGsucG5nP2JnPTAwNzJDRSZ0PWZhY2Vib29r.png', altText: 'An animated headshot of Shai Gilgeous-Alexander' },
  { name: 'Cade', id: 4432166, fullName: 'Cade Cunningham', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZXRyb2l0LXBpc3RvbnMtY2FkZS1jdW5uaW5naGFtMjAyMi1taW4tLW42bmtodmxvLnBuZz9iZz0xRDQyOEEmdD1mYWNlYm9vaw==.png', altText: 'An animated headshot of Cade Cunningham' },
  { name: 'Wemby', id: 5104157, fullName: 'Victor Wembenyama', image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9zYW4tYW50b25pby1zcHVycy12aWN0b3Itd2VtYmFueWFtYS0yMDI2LS16c3dqbjh5bi5wbmc_Ymc9OEQ5MDkzJnQ9ZmFjZWJvb2s=.png', altText: 'An animated headshot of Victor Wembenyama' }
];

async function fetchAllPlayerStats() {
  const apiCalls = playerIds.map(player =>
    axios.request({
      method: 'GET',
      url: `https://nba-api-free-data.p.rapidapi.com/nba-player-gamelog?playerid=${player.id}`,
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com',
      },
    }).then(response => {
      const seasonTypes = response.data.response.gamelog.seasonTypes;
      const postseasonData = seasonTypes.find(season => season.displayName.includes("Postseason"));
      return {
        player: player.fullName,
        minutes:      postseasonData?.summary.stats[0].stats[0]  || 'N/A',
        points:       postseasonData?.summary.stats[0].stats[13] || 'N/A',
        assists:      postseasonData?.summary.stats[0].stats[8]  || 'N/A',
        rebounds:     postseasonData?.summary.stats[0].stats[7]  || 'N/A',
        fgPercentage: postseasonData?.summary.stats[0].stats[2]  || 'N/A',
        image:        player.image,
        altText:      player.altText,
      };
    })
  );

  return Promise.all(apiCalls);
}

async function build() {
  if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
  fs.mkdirSync('./dist');

  if (fs.existsSync('./public')) {
    fs.cpSync('./public', './dist', { recursive: true });
    console.log('Copied static assets');
  }

  try {
    console.log('Fetching player stats from API...');
    const allPlayerStats = await fetchAllPlayerStats();
    console.log('Data fetched successfully:', allPlayerStats);

    const html = await ejs.renderFile('./views/main.ejs', { allPlayerStats }, {
      views: ['./views'],
    });

    fs.writeFileSync('./dist/index.html', html);
    console.log('Rendered main.ejs → dist/index.html');

  } catch (error) {
    console.error('Error fetching data:', error.message);
    const html = await ejs.renderFile('./views/main.ejs', { error: error.message }, {
      views: ['./views'],
    });
    fs.writeFileSync('./dist/index.html', html);
  }

  console.log('\nBuild complete!');
}

build();