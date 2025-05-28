import axiosInstance from './axiosInstance';

/**
 * 평가 페이지 조회 - 모든 평가 데이터
 */
export const fetchEvaluationData = async (currentUserPuuid) => {
    const response = await axiosInstance.get('/matching/review', {
        withAuth: true,
    });
    const data = response.data.data;
    console.log('API Response:', data);
    console.log('Current User PUUID:', currentUserPuuid);
    console.log('Current User PUUID Type:', typeof currentUserPuuid);

    const sentEvaluations = [];

    data.forEach(group => {
        group.dtoList.forEach(item => {
            const transformedItem = transformEvaluationToFrontend(item);
            const acceptorPuuid = item.acceptor?.memberInfo?.riotAccount?.puuid;
            const requestorPuuid = item.requestor?.memberInfo?.riotAccount?.puuid;

            console.log('=== 매칭 아이템 분석 ===');
            console.log('Item ID:', item.mypageId);
            console.log('Acceptor PUUID:', acceptorPuuid);
            console.log('Requestor PUUID:', requestorPuuid);
            console.log('Current User PUUID:', currentUserPuuid);
            console.log('Acceptor 일치:', acceptorPuuid === currentUserPuuid);
            console.log('Requestor 일치:', requestorPuuid === currentUserPuuid);

            let otherUser = null;

            if (acceptorPuuid === currentUserPuuid) {
                console.log('내가 acceptor - 상대방은 requestor');
                otherUser = transformUserInfo(item.requestor);
            } else if (requestorPuuid === currentUserPuuid) {
                console.log('내가 requestor - 상대방은 acceptor');
                otherUser = transformUserInfo(item.acceptor);
            } else {
                console.log('내가 관련되지 않은 매칭');
            }

            if (otherUser) {
                console.log('보낸 평가에 추가:', otherUser);
                sentEvaluations.push({
                    ...transformedItem,
                    mode: 'sent',
                    otherUser: otherUser
                });
            }
        });
    });

    console.log('최종 Sent Evaluations:', sentEvaluations);

    return {
        received: [],
        sent: sentEvaluations
    };
};

const transformEvaluationToFrontend = (item) => {
    const { mypageId, mapCode, matchingCategory, matchingStatus } = item;

    return {
        id: mypageId,
        map: mapCode === 'RANK' ? '랭크' : mapCode === 'NORMAL' ? '일반' : '칼바람',
        type: matchingCategory === 'DUO' ? '듀오' : '내전',
        status: matchingStatus,
        createdAt: new Date().toLocaleDateString('ko-KR'),
        reviewStatus: matchingStatus === 'COMPLETED' ? 'completed' : 'pending',
    };
};

const transformUserInfo = (userObj) => {
    if (!userObj) return {};

    const riot = userObj.memberInfo?.riotAccount || {};
    const memberInfo = userObj.memberInfo || {};
    const userInfo = userObj.userInfo || {};

    return {
        name: riot.gameName || '알 수 없음',
        tag: riot.tagLine || '',
        avatarUrl: riot.profileUrl || '',
        school: userObj.univName || '미인증',
        department: userObj.department || '미설정',
        position: (userInfo.myPosition || 'NOTHING').toLowerCase(),
        tier: memberInfo.rankInfo?.tier || 'UNRANKED',
        leaguePoint: memberInfo.rankInfo?.lp || 0,
        rank: memberInfo.rankInfo?.rank || '',
        champions: memberInfo.most3Champ || [],
        wins: memberInfo.rankInfo?.wins || 0,
        losses: memberInfo.rankInfo?.losses || 0,
    };
};

/**
 * 평가 작성/수정
 */
export const submitEvaluation = async (evaluationData) => {
    const response = await axiosInstance.post('/evaluation/submit', evaluationData, {
        withAuth: true,
    });
    return response.data;
};
