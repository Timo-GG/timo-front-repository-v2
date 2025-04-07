const winMatch = {
    result: '승리',
    resultColor: '#3F6E8C',
    kda: '5 / 0 / 9',
    champion: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/Akali.png',
    level: 18,
    items: [
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3157.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3089.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3020.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3152.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3135.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/4645.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/3363.png'
    ],
    spells: [
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/spell/SummonerFlash.png',
        'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/spell/SummonerTeleport.png'
    ],
    perks: [
        'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Precision.png',
        'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Domination.png'
    ],
    time: '20:31',
    queueType: '솔로 랭크',
    date: '2개월 전',
    tags: ['더블킬', 'MVP']
};

const loseMatch = {
    ...winMatch,
    result: '패배',
    resultColor: '#8C4949'
};

const matches = [
    winMatch,
    loseMatch,
    { ...loseMatch, items: [...winMatch.items, 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/1058.png'] },
    winMatch,
    { ...loseMatch, items: [...winMatch.items.slice(0, 5)] },
    { ...winMatch, items: [...winMatch.items, 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/1058.png', 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/item/1011.png'] },
    winMatch,
    loseMatch,
    winMatch,
    loseMatch,
];

export default matches;
