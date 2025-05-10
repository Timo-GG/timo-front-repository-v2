// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

/**
 * Redis에 저장된 모든 듀오 게시글 조회
 */
export const fetchAllDuoBoards = async () => {
    const response = await axiosInstance.get('/matching/duo', {
        withAuth: true,
    });

    return response.data.map((item) => ({
        id: item.boardUUID,
        name: item.responseUserDto.riotAccount.accountName,
        tag: item.responseUserDto.riotAccount.accountTag,
        school: item.responseUserDto.certifiedUnivInfo.univName,
        department: item.responseUserDto.certifiedUnivInfo.department,
        avatarUrl: item.responseUserDto.riotAccount.profileUrl,
        queueType:
            item.duoMapCode === 'RANK'
                ? '랭크'
                : item.duoMapCode === 'NORMAL'
                    ? '일반'
                    : '칼바람',
        message: item.memo,
        playStyle: item.responseUserDto.userInfo.myStyle.toLowerCase(),
        status: item.responseUserDto.userInfo.myStatus.toLowerCase(),
        mic: item.responseUserDto.userInfo.myVoice === 'ENABLED' ? '사용함' : '사용 안함',
        gender: item.responseUserDto.gender,
        mbti: item.responseUserDto.mbti,
        tier: item.responseUserDto.compactPlayerHistory.rankInfo.tier,
        score: item.responseUserDto.compactPlayerHistory.rankInfo.rank,
        position: item.responseUserDto.userInfo.myPosition.toLowerCase(),
        lookingForPosition: item.responseUserDto.duoInfo.opponentPosition.toLowerCase(),
        createdAt: new Date().toISOString(),
        type: '듀오',
        wins: 0,
        losses: 0,
        champions: item.responseUserDto.compactPlayerHistory.most3Champ,
        last10Match: item.responseUserDto.compactPlayerHistory.last10Match
    }));
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