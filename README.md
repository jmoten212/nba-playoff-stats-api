<h1>NBA Playoffs Stat Tracker</h1>

Created a simple JS app built with Express and EJS that fetches NBA player stats from a Rapid API for the current 2026 playoffs and displays them as a static site


[View Project](https://jmoten212.github.io/nba-playoff-stats-api/) &emsp; | &emsp; [View Code](https://github.com/jmoten212/nba-playoff-stats-api)

<h3>Key Features</h3>
<ul>
  <li>Live API data fetching that pulls per-player playoff gamelogs from a Rapid API NBA endpoint simultaneously</li>
  <li>Stat transformation that converts raw API response arrays (indexed by position) into structured per-player objects for points, rebounds, assists, minutes and FG%</li>
  <li>A toggle slider that switches cards between total stats and per-game averages</li>
  <li>A static site build where <code>build.js</code> fetches live data at build time, renders the EJS template, and writes fully static <code>index.html</code> so that the project can be deployed to GitHub Pages without the need for a running server</li>
  <li>A direct link to the project's GitHub repository with tooltip UI</li>
</ul>

<h3>What I Learned</h3>
<ul>
  <li>How to better work with real-world API response shapes — digging into nested arrays to find the right data by index rather than by named key</li>
  <li>How to improve upon techniques for setting up simple Express servers with EJS templating</li>
  <li>How to use Rapid API for a project and access the desired endpoints from an API hosted there</li>
</ul>

<h3>Future Improvements</h3>
<ul>
  <li>Add unit and integration tests</li>
  <li>Add all players from each team and a way to search and request a specific player's stats</li>
  <li>Add a couple more variations of how the stats are displayed - table, charts, etc.</li>
  <li>Improve accessibility</li>
</ul>

<h3>Contact</h3>
<b>Name:</b> James Moten <br>
<b>Email:</b> jmoten212@gmail.com <br>
<b>LinkedIn:</b> https://www.linkedin.com/in/james-moten/ <br>
