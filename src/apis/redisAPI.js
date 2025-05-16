// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

/**
 * Redis에 저장된 모든 듀오 게시글 조회
 */
export const fetchAllDuoBoards = async () => {
    const response = await axiosInstance.get('/matching/duo', {
    });

    return response.data.map((item) => {
        const user = item.responseUserDto;
        const riot = user.riotAccount || {};
        const info = user.userInfo || {};
        const history = user.compactPlayerHistory?.rankInfo || {};
        const duo = user.duoInfo || {};
        const univ = user.certifiedUnivInfo || {};

        return {
            id: item.boardUUID,
            name: riot.accountName,
            tag: riot.accountTag,
            school: univ.univName || '미인증',
            department: univ.department || '',
            avatarUrl: riot.profileUrl,
            queueType:
                item.duoMapCode === 'RANK'
                    ? '랭크'
                    : item.duoMapCode === 'NORMAL'
                        ? '일반'
                        : '칼바람',
            message: item.memo,
            playStyle: info.myStyle?.toLowerCase() || '',
            status: info.myStatus?.toLowerCase() || '',
            mic: info.myVoice === 'ENABLED' ? '사용함' : '사용 안함',
            gender: user.gender,
            mbti: user.mbti,
            tier: history.tier || 'Unranked',
            leaguePoint: history.lp || 0,
            rank: history.rank || '',
            position: info.myPosition?.toLowerCase() || '',
            lookingForPosition: duo.opponentPosition?.toLowerCase() || '',
            createdAt: new Date().toISOString(),
            type: '듀오',
            wins: 0,
            losses: 0,
            champions: user.compactPlayerHistory?.most3Champ || [],
            last10Match: user.compactPlayerHistory?.last10Match || []
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
 *
 * @param {string} boardUUID          - 신청할 게시글 UUID
 * @param {object} duoRequestorDto    - UserDTO.RequestDuo 형태의 요청자 DTO
 * @returns 신청 결과 데이터
 */
export const sendDuoRequest = async (boardUUID, duoRequestorDto) => {
    const payload = {
        boardUUID,
        duoRequestorDto,
    };
    const response = await axiosInstance.post('/matching/myPage', payload, {
        withAuth: true,
    });
    return response.data;
};