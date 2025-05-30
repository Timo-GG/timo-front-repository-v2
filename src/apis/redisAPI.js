// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

export const isExistMyBoard = async () => {
    const response = await axiosInstance.get('/matching/duo/exists', {
        withAuth: true,
    });
    console.log("isExist : ", response.data.data);
    return response.data.data;
}

export const refreshDuoBoards = async () => {
    const response = await axiosInstance.put('/matching/duo/refresh', {}, {
        withAuth: true,
    });
    return response.data;
}

/**
 * Redis에 저장된 모든 듀오 게시글 조회 (페이징)
 */
export const fetchAllDuoBoards = async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/matching/duo?page=${page}&size=${size}`);

    // 백엔드에서 PageResponse 객체를 반환
    const pageData = response.data.data;

    // content 배열을 변환
    const transformedContent = pageData.content
        .filter(item => item !== null && item !== undefined)
        .map((item) => {
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
                updatedAt: item.updatedAt,
                type: '듀오',
                champions: user.most3Champ || [],
                wins: 0,
                losses: 0,
            };
        });

    // 페이징 정보와 함께 반환
    return {
        content: transformedContent,
        page: pageData.page,
        size: pageData.size,
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages,
        first: pageData.first,
        last: pageData.last,
        hasNext: pageData.hasNext,
        hasPrevious: pageData.hasPrevious
    };
};

// 나머지 함수들은 동일...
export const createDuoBoard = async (dto) => {
    const response = await axiosInstance.post('/matching/duo', dto, {
        withAuth: true,
    });
    return response.data;
};

export const sendDuoRequest = async (dto) => {
    const response = await axiosInstance.post('/matching/mypage/duo', dto, {
        withAuth: true,
    });
    return response.data;
};

export const fetchReceivedRequests = async (acceptorId) => {
    const res = await axiosInstance.get(`/matching/mypage/acceptor/${acceptorId}`,
        {withAuth: true}
    );
    const data = res.data.data;
    return data.map(item => transformRequestorToFrontend(item));
};

export const fetchSentRequests = async (requestorId) => {
    const res = await axiosInstance.get(`/matching/mypage/requestor/${requestorId}`,
        {withAuth: true});
    const data = res.data.data;
    return data.map(item => transformAcceptorToFrontend(item));
};

// transform 함수들은 동일하게 유지...
const transformRequestorToFrontend = (item) => {
    const {requestor, mapCode, matchingCategory, myPageUUID} = item;
    const riot = requestor?.memberInfo?.riotAccount || {};
    const memberInfo = requestor?.memberInfo || {};
    const userInfo = requestor?.userInfo || {};
    return {
        id: myPageUUID,
        name: riot.gameName,
        tag: riot.tagLine,
        avatarUrl: riot.profileUrl,
        school: memberInfo.univName || '미인증',
        department: memberInfo.department || '',
        memo : item.requestorMemo,
        queueType:
            mapCode === 'RANK'
                ? '랭크'
                : mapCode === 'NORMAL'
                    ? '일반'
                    : '칼바람',
        message: userInfo.memo || '',
        position: (userInfo.myPosition || '').toLowerCase(),
        playStyle: (userInfo.myStyle || '').toLowerCase(),
        status: (userInfo.myStatus || '').toLowerCase(),
        mic: userInfo.myVoice === 'ENABLED' ? '사용함' : '사용 안함',
        gender: memberInfo.gender,
        mbti: memberInfo.mbti,
        tier: memberInfo.rankInfo?.tier || 'Unranked',
        leaguePoint: memberInfo.rankInfo?.lp || 0,
        rank: memberInfo.rankInfo?.rank || '',
        lookingForPosition: '',
        lookingForStyle: '',
        updatedAt: item.updatedAt,
        type: matchingCategory === 'DUO' ? '듀오' : '내전',
        champions: memberInfo.most3Champ || [],
        wins: memberInfo.rankInfo?.wins || 0,
        losses: memberInfo.rankInfo?.losses || 0,
    };
};

const transformAcceptorToFrontend = (item) => {
    const {acceptor, mapCode, matchingCategory, myPageUUID} = item;
    const riot = acceptor?.memberInfo?.riotAccount || {};
    const memberInfo = acceptor?.memberInfo || {};
    const userInfo = acceptor?.userInfo || {};

    return {
        id: myPageUUID,
        name: riot.gameName,
        tag: riot.tagLine,
        avatarUrl: riot.profileUrl,
        school: memberInfo.univName || '미인증',
        department: memberInfo.department || '',
        memo : item.acceptorMemo,
        queueType:
            mapCode === 'RANK'
                ? '랭크'
                : mapCode === 'NORMAL'
                    ? '일반'
                    : '칼바람',
        message: userInfo.memo || '',
        position: (userInfo.myPosition || '').toLowerCase(),
        playStyle: (userInfo.myStyle || '').toLowerCase(),
        status: (userInfo.myStatus || '').toLowerCase(),
        mic: userInfo.myVoice === 'ENABLED' ? '사용함' : '사용 안함',
        gender: memberInfo.gender,
        mbti: memberInfo.mbti,
        tier: memberInfo.rankInfo?.tier || 'Unranked',
        leaguePoint: memberInfo.rankInfo?.lp || 0,
        rank: memberInfo.rankInfo?.rank || '',
        lookingForPosition: '',
        lookingForStyle: '',
        updatedAt: item.updatedAt,
        type: matchingCategory === 'DUO' ? '듀오' : '내전',
        champions: memberInfo.most3Champ || [],
        wins: memberInfo.rankInfo?.wins || 0,
        losses: memberInfo.rankInfo?.losses || 0,
    };
};

export const acceptMatchingRequest = async (myPageUUID) => {
    const response = await axiosInstance.get(`/matching/event/accept/${myPageUUID}`, {
        withAuth: true,
    });
    return response.data;
};

export const rejectMatchingRequest = async (myPageUUID) => {
    const response = await axiosInstance.get(`/matching/event/reject/${myPageUUID}`, {
        withAuth: true,
    });
    return response.data;
};
