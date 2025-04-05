export const getChampionImageUrl = (championName) => {
  if (!championName) return null;
  return `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${championName}.png`;
};