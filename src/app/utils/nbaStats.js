export function findPostseasonSummary(seasonTypes = []) {
  return seasonTypes.find((season) =>
    typeof season?.displayName === 'string' && season.displayName.includes('Postseason')
  ) || null;
}

export function countEventGames(postseasonData) {
  if (!postseasonData || !Array.isArray(postseasonData.categories)) {
    return 0;
  }

  return postseasonData.categories.reduce((count, category) => {
    if (category?.type === 'event' && Array.isArray(category.events)) {
      return count + category.events.length;
    }

    return count;
  }, 0);
}

export function getStatValue(postseasonData, index, fallback = 'N/A') {
  const stats = postseasonData?.summary?.stats?.[0]?.stats ?? [];
  const value = stats[index];

  return value ?? fallback;
}

export function calculateAverage(total, games) {
  if (total === 'N/A' || total === null || total === undefined || games === 0 || !Number.isFinite(Number(total))) {
    return 'N/A';
  }

  return (Math.round((Number(total) / games) * 10) / 10).toFixed(1);
}

export function buildPlayerStatSummary(player, postseasonData) {
  const totalEvents = countEventGames(postseasonData);

  const totalMinutes = getStatValue(postseasonData, 0, 'N/A');
  const totalPoints = getStatValue(postseasonData, 13, 'N/A');
  const totalAssists = getStatValue(postseasonData, 8, 'N/A');
  const totalRebounds = getStatValue(postseasonData, 7, 'N/A');

  return {
    player: player.fullName,
    games: totalEvents,
    totalMinutes,
    avgMinutes: calculateAverage(totalMinutes, totalEvents),
    totalPoints,
    avgPoints: calculateAverage(totalPoints, totalEvents),
    totalAssists,
    avgAssists: calculateAverage(totalAssists, totalEvents),
    totalRebounds,
    avgRebounds: calculateAverage(totalRebounds, totalEvents),
    fgPercentage: getStatValue(postseasonData, 2, 'N/A'),
    eliminated: player.eliminated,
    image: player.image,
    altText: player.altText,
    logo: player.teamLogo,
    logoAlt: player.logoAlt,
  };
}
