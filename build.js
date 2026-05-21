import express from "express";
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const playerIds = [
  { name: 'SGA', id: 4278073, fullName: 'Shai Gilgeous-Alexander', eliminated: false, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9va2xhaG9tYS1jaXR5LXRodW5kZXItc2hhaS1naWxnZW91cy1hbGV4YW5kZXIyMDIzLW1pbi0tM2JvZHloZGsucG5nP2JnPTAwNzJDRSZ0PXR3aXR0ZXI=.png', altText: 'An illustrated headshot of Shai Gilgeous-Alexander', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Oklahoma-City-Thunder-Symbol.png' },
      { name: 'Wemby', id: 5104157, fullName: 'Victor Wembenyama', eliminated: false, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9zYW4tYW50b25pby1zcHVycy12aWN0b3Itd2VtYmFueWFtYTIwMjQtMDEtLWpqdDBkcjF3LnBuZz9iZz04RDkwOTMmdD10d2l0dGVy.png', altText: 'An illustrated headshot of Victor Wembenyama', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/San-Antonio-Spurs-Symbol.png' },
      { name: 'Spida', id: 3908809, fullName: 'Donovan Mitchell', eliminated: false, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9jbGV2ZWxhbmQtY2F2YWxpZXJzLWRvbm92YW4tbWl0Y2hlbGwyMDIyLW1pbi0tNXlvdWJ5dHMucG5nP2JnPTZGMjYzRCZ0PXR3aXR0ZXI=.png', altText: 'An illustrated headshot of Donovan Mitchell', teamLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cleveland_Cavaliers_logo.svg/1280px-Cleveland_Cavaliers_logo.svg.png' },
      { name: 'Brunson', id: 3934672, fullName: 'Jalen Brunson', eliminated: false, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9uZXcteW9yay1rbmlja3MtamFsZW4tYnJ1bnNvbi1taW4tLWE5ZXJuYjUxLnBuZz9iZz0wMDNEQTUmdD10d2l0dGVy.png', altText: 'An illustrated headshot of Jalen Brunson', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1280px-New_York_Knicks_logo.svg.png' },
      { name: 'Bron', id: 1966, fullName: 'LeBron James', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9sb3MtYW5nZWxlcy1sYWtlcnMtbGVicm9uLWphbWVzMjAyNi0xLS1wMjB6aDJqcS5wbmc_Ymc9NTgyQzgzJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of LeBron James', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/06/Los-Angeles-Lakers-Logo.png' },
      { name: 'Cade', id: 4432166, fullName: 'Cade Cunningham', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZXRyb2l0LXBpc3RvbnMtY2FkZS1jdW5uaW5naGFtMjAyMi1taW4tLW42bmtodmxvLnBuZz9iZz0xRDQyOEEmdD10d2l0dGVy.png', altText: 'An illustrated headshot of Cade Cunningham', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Detroit-Pistons-Logo-2017-Present.png' },
      { name: 'KD', id: 3202, fullName: 'Kevin Durant', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9ob3VzdG9uLXJvY2tldHMta2V2aW4tZHVyYW50LTAxLS1pb2xxZGRpNy5wbmc_Ymc9QkEwQzJGJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Kevin Durant', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Houston-Rockets-Symbol.png' },
      { name: 'Jokic', id: 3112335, fullName: 'Nikola Jokic', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9kZW52ZXItbnVnZ2V0cy1uaWtvbGEtam9raWMyMDI1LS0ydGg4ZWo0ei5wbmc_Ymc9RkZDNzJDJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Nikola Jokic', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Denver_Nuggets.svg/1280px-Denver_Nuggets.svg.png' },
      { name: 'Book', id: 3136193, fullName: 'Devin Booker', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9waG9lbml4LXN1bnMtZGV2aW4tYm9va2VyMjAyNS0taWtfNmJzY3UucG5nP2JnPUU2NjIyNiZ0PXR3aXR0ZXI=.png', altText: 'An illustrated headshot of Devin Booker', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Phoenix-Suns-Symbol.png' },
      { name: 'Ant', id: 4594268, fullName: 'Anthony Edwards', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9taW5uZXNvdGEtdGltYmVyd29sdmVzLWFudGhvbnktZWR3YXJkczIwMjUtLTlva2UtZmR5LnBuZz9iZz0yMTYwOTMmdD10d2l0dGVy.png', altText: 'An illustrated headshot of Anthony Edwards', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Minnesota-Timberwolves-logo.png' },
      { name: 'JB', id: 3917376, fullName: 'Jaylen Brown', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9ib3N0b24tY2VsdGljcy1qYXlsZW4tYnJvd24yMDI1LS1ud3hyZmg0Zy5wbmc_Ymc9MDA3QTMzJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Jaylen Brown', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Boston-Celtics-Logo-1996-present.png' },
      { name: 'Deni', id: 4683021, fullName: 'Deni Avdija', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9wb3J0bGFuZC10cmFpbC1ibGF6ZXJzLWRlbmktYXZkaWphLS13eHhmZDdhcC5wbmc_Ymc9QzgxMDJFJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Deni Avdija', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Portland-Trail-Blazers-Symbol.png' },
      { name: 'Embiid', id: 3059318, fullName: 'Joel Embiid', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9waGlsYWRlbHBoaWEtNzZlcnMtam9lbC1lbWJpaWQyMDE5LW1pbi0tcmU0bGgyNmIucG5nP2JnPTAwM0RBNSZ0PXR3aXR0ZXI=.png', altText: 'An illustrated headshot of Joel Embiid', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Philadelphia-76ers-logo.png' },
      { name: 'BI', id: 3913176, fullName: 'Brandon Ingram', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy90b3JvbnRvLXJhcHRvcnMtYnJhbmRvbi1pbmdyYW0yMDIyLTAxLS13Y3dobDhlei5wbmc_Ymc9QkEwQzJGJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Brandon Ingram', teamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Toronto_Raptors_logo.svg/250px-Toronto_Raptors_logo.svg.png' },
      { name: 'JJ', id: 4701230, fullName: 'Jalen Johnson', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9hdGxhbnRhLWhhd2tzLWphbGVuLWpvaG5zb24tbWluLS1pZC1jbXpleC5wbmc_Ymc9QzgxMDJFJnQ9dHdpdHRlcg==.png', altText: 'An illustrated headshot of Jalen Johnson', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Atlanta-Hawks-Symbol.png' },
      { name: 'Paolo', id: 4432573, fullName: 'Paolo Banchero', eliminated: true, image: 'https://cdn.statmuse.com/forge-v2/aHR0cHM6Ly9jZG4uc3RhdG11c2UuY29tL2ltZy9uYmEvcGxheWVycy9vcmxhbmRvLW1hZ2ljLXBhb2xvLWJhbmNoZXJvMjAyNS0tcGNpeGl4cHMucG5nP2JnPTAwNTBCNSZ0PXR3aXR0ZXI=.png', altText: 'An illustrated headshot of Paolo Banchero', teamLogo: 'https://logos-world.net/wp-content/uploads/2020/05/Orlando-Magic-Symbol.png' }
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
        minutes: postseasonData?.summary.stats[0].stats[0]  || 'N/A',
        points: postseasonData?.summary.stats[0].stats[13] || 'N/A',
        assists: postseasonData?.summary.stats[0].stats[8]  || 'N/A',
        rebounds: postseasonData?.summary.stats[0].stats[7]  || 'N/A',
        fgPercentage: postseasonData?.summary.stats[0].stats[2]  || 'N/A',
        eliminated: player.eliminated,
        image: player.image,
        altText: player.altText,
        logo: player.teamLogo
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