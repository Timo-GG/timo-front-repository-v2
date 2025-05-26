// src/apis/redisAPI.js
import axiosInstance from './axiosInstance';

/**
 * Redis에 저장된 모든 듀오 게시글 조회
 */
export const fetchAllDuoBoards = async () => {
    const response = await axiosInstance.get('/matching/duo');

    // 실제 게시글 배열은 response.data.data 에 위치
    const boards = response.data.data;

    return boards
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

/**
 * MyPage 조회 - 받은 요청
 */
export const
    fetchReceivedRequests = async (acceptorId) => {
        const res = await axiosInstance.get(`/matching/mypage/acceptor/${acceptorId}`,
            {withAuth: true}
        );
        const data = res.data.data;

        return data.map(item => transformRequestorToFrontend(item));
    };

/**
 * MyPage 조회 - 보낸 요청
 */
export const fetchSentRequests = async (requestorId) => {
    const res = await axiosInstance.get(`/matching/mypage/requestor/${requestorId}`,
        {withAuth: true});
    const data = res.data.data;

    return data.map(item => transformAcceptorToFrontend(item));
};

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

        lookingForPosition: '', // optional: 상대방 포지션 관련 정보 없으면 빈 문자열
        lookingForStyle: '',

        createdAt: new Date().toISOString(),
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

        lookingForPosition: '', // optional: 상대방 포지션 관련 정보 없으면 빈 문자열
        lookingForStyle: '',

        createdAt: new Date().toISOString(),
        type: matchingCategory === 'DUO' ? '듀오' : '내전',
        champions: memberInfo.most3Champ || [],

        wins: memberInfo.rankInfo?.wins || 0,
        losses: memberInfo.rankInfo?.losses || 0,
    };
};

/**
 * 매칭 요청 수락
 */
export const acceptMatchingRequest = async (myPageUUID) => {
    const response = await axiosInstance.get(`/matching/event/accept/${myPageUUID}`, {
        withAuth: true,
    });
    return response.data;
};

/**
 * 매칭 요청 거절
 */
export const rejectMatchingRequest = async (myPageUUID) => {
    const response = await axiosInstance.get(`/matching/event/reject/${myPageUUID}`, {
        withAuth: true,
    });
    return response.data;
};