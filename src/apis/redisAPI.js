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
        school: '알 수 없음', // 추후 백엔드 확장
        department: '알 수 없음',
        avatarUrl: '/assets/default.png',
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
        gender: '알 수 없음',
        mbti: item.responseUserDto.mbti || '알 수 없음',
        tier: 'unranked', // 추후 확장
        score: 0,
        position: item.responseUserDto.userInfo.myPosition.toLowerCase(),
        lookingForPosition: item.responseUserDto.duoInfo.opponentPosition.toLowerCase(),
        createdAt: new Date().toISOString(), // 실제 값 필요 시 백엔드 추가
        type: '듀오',
        wins: 0,
        losses: 0,
        champions: [],
    }));
};
