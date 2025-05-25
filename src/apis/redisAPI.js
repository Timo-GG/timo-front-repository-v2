// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

/**
 * Redis에 저장된 모든 듀오 게시글 조회
 */
export const fetchAllDuoBoards = async () => {
    const response = await axiosInstance.get('/matching/duo');

    // 실제 게시글 배열은 response.data.data 에 위치
    const boards = response.data.data;

    return boards.map((item) => {
        const user = item.memberInfo;
        const riot = user.riotAccount || {};
        const userInfo = item.userInfo || {};
        const duoInfo = item.duoInfo || {};

        return {
            id: item.boardUUID,

            name: riot.gameName,
            tag: riot.tagLine,
            avatarUrl: riot.profileUrl,

            school: user.univName || '미인증',
            department: user.department || '',

            queueType:
                item.mapCode === 'RANK'
                    ? '랭크'
                    : item.mapCode === 'NORMAL'
                        ? '일반'
                        : '칼바람',

            message: item.memo,

            position: userInfo.myPosition?.toLowerCase() || '',
            playStyle: userInfo.myStyle?.toLowerCase() || '',
            status: userInfo.myStatus?.toLowerCase() || '',
            mic: userInfo.myVoice === 'ENABLED' ? '사용함' : '사용 안함',

            gender: user.gender,
            mbti: user.mbti,

            tier: user.rankInfo.tier || 'Unranked',
            leaguePoint: user.rankInfo.lp || 0,
            rank: user.rankInfo.rank || '',

            lookingForPosition: duoInfo.opponentPosition?.toLowerCase() || '',
            lookingForStyle: duoInfo.opponentStyle?.toLowerCase() || '',

            createdAt: new Date().toISOString(),

            type: '듀오',
            champions: user.most3Champ || [],

            wins: 0,
            losses: 0,
        };
    });
};

/**
 * Redis에 듀오 등록
 */
export const createDuoBoard = async (dto) => {
    const response = await axiosInstance.post('/matching/duo', dto, {
        withAuth: true,
    });
    return response.data;
};

/**
 * Redis에 듀오 신청
 */
export const sendDuoRequest = async (dto) => {
    const response = await axiosInstance.post('/matching/mypage/duo', dto, {
        withAuth: true,
    });
    return response.data;
};