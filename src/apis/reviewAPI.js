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

    const sentEvaluations = [];

    // data는 배열이고, 각 요소는 { size, filteredBy, dtoList } 구조
    data.forEach(group => {
        // 각 그룹의 dtoList를 처리
        group.dtoList.forEach(item => {
            const transformedItem = transformEvaluationToFrontend(item);
            const acceptorPuuid = item.acceptor?.memberInfo?.riotAccount?.puuid;
            const requestorPuuid = item.requestor?.memberInfo?.riotAccount?.puuid;

            console.log('Item:', item.mypageId, 'Acceptor PUUID:', acceptorPuuid, 'Requestor PUUID:', requestorPuuid);

            // 내 puuid와 일치하는 경우, 상대방 정보를 보낸 평가에 추가
            let otherUser = null;

            if (acceptorPuuid === currentUserPuuid) {
                // 내가 acceptor면 상대방은 requestor
                otherUser = transformUserInfo(item.requestor);
            } else if (requestorPuuid === currentUserPuuid) {
                // 내가 requestor면 상대방은 acceptor
                otherUser = transformUserInfo(item.acceptor);
            }

            // 내가 관련된 매칭이면 보낸 평가에 상대방 정보 추가
            if (otherUser) {
                sentEvaluations.push({
                    ...transformedItem,
                    mode: 'sent',
                    otherUser: otherUser
                });
            }
        });
    });

    console.log('Sent Evaluations:', sentEvaluations);

    return {
        received: [], // 받은 평가는 빈 배열
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
