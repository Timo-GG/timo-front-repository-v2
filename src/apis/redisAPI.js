// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

/**
 * 끌어올리기 로직
 */
export const isExistMyBoard = async () => {
    const response = await axiosInstance.get('/matching/duo/exists', {
        withAuth: true,
    });
    console.log("isExist : ", response.data.data);
    return response.data.data;
}
export const isExistMyScimBoard = async () => {
    const response = await axiosInstance.get('/matching/scrim/exists', {
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
export const refreshScrimBoard = async () => {
    const response = await axiosInstance.put('/matching/scrim/refresh', {}, {
        withAuth: true,
    });
    return response.data;
};

/**
 * [DELETE] 게시글 삭제 로직
 */
export const deleteMyDuoBoard = async () => {
    const response = await axiosInstance.delete('/matching/duo/my', {
        withAuth: true,
    });
    return response.data;
};
export const deleteMyScrimBoard = async () => {
    const response = await axiosInstance.delete('/matching/scrim/my', {
        withAuth: true,
    });
    return response.data;
};

/**
 * [Read] 게시글 조회
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
export const fetchAllScrimBoards = async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/matching/scrim?page=${page}&size=${size}`);

    const pageData = response.data.data;

    const transformedContent = pageData.content
        .filter(item => item !== null && item !== undefined)
        .map((item) => {
            const member = item.memberInfo;
            const riot = member?.riotAccount || {};
            const partyInfo = item.partyInfo || [];

            return {
                id: item.boardUUID,
                name: riot.gameName,
                tag: riot.tagLine,
                avatarUrl: riot.profileUrl,
                school: member.univName || '미인증',
                department: member.department || '',
                queueType:
                    item.mapCode === 'RIFT'
                        ? '소환사 협곡'
                        : '칼바람 나락',
                message: item.memo,
                headCount: item.headCount || 5,
                updatedAt: item.updatedAt,
                type: '내전',
                party: partyInfo.map(p => ({
                    gameName: p.gameName,
                    tagLine: p.tagLine,
                    profileUrl: p.profileUrl || '/default.png',
                    myPosition: p.myPosition?.toLowerCase() || 'nothing',
                    tier: p.rankInfo?.tier || 'unranked',
                    rank: p.rankInfo?.rank || '',
                    lp: p.rankInfo?.lp || 0,
                    wins: p.rankInfo?.wins || 0,
                    losses: p.rankInfo?.losses || 0,
                    champions: p.most3Champ || []
                }))
            };
        });

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
export const fetchUnivScrimBoards = async (page = 0, size = 10, univName) => {
    const response = await axiosInstance.get(`/matching/scrim/my/${univName}?page=${page}&size=${size}`);
    const pageData = response.data.data;

    const transformedContent = pageData.content
        .filter(item => item !== null && item !== undefined)
        .map((item) => {
            const member = item.memberInfo;
            const riot = member?.riotAccount || {};
            const partyInfo = item.partyInfo || [];

            return {
                id: item.boardUUID,
                name: riot.gameName,
                tag: riot.tagLine,
                avatarUrl: riot.profileUrl,
                school: member.univName || '미인증',
                department: member.department || '',
                queueType:
                    item.mapCode === 'RIFT'
                        ? '소환사 협곡'
                        : '칼바람 나락',
                message: item.memo,
                headCount: item.headCount || 5,
                updatedAt: item.updatedAt,
                type: '내전',
                party: partyInfo.map(p => ({
                    gameName: p.gameName,
                    tagLine: p.tagLine,
                    profileUrl: p.profileUrl || '/default.png',
                    myPosition: p.myPosition?.toLowerCase() || 'nothing',
                    tier: p.rankInfo?.tier || 'unranked',
                    rank: p.rankInfo?.rank || '',
                    lp: p.rankInfo?.lp || 0,
                    wins: p.rankInfo?.wins || 0,
                    losses: p.rankInfo?.losses || 0,
                    champions: p.most3Champ || []
                }))
            };
        });

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

/**
 * [CREATE] 게시글 등록
 */
export const createDuoBoard = async (dto) => {
    const response = await axiosInstance.post('/matching/duo', dto, {
        withAuth: true,
    });
    return response.data;
};
export const createScrimBoard = async (dto) => {
    const response = await axiosInstance.post('/matching/scrim', dto, {
        withAuth: true,
    });
    return response.data;
};

/**
 * [CREATE] 듀오/내전 신청
 */
export const sendDuoRequest = async (dto) => {
    const response = await axiosInstance.post('/matching/mypage/duo', dto, {
        withAuth: true,
    });
    return response.data;
};

/**
 * [READ] 요청 조회
 */
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

/**
 * Convenience Method
 */
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

/**
 * [READ] 요청 처리
 */
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