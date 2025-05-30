import axiosInstance from './axiosInstance';

/**
 * 평가 페이지 조회 - 모든 평가 데이터
 */
export const fetchEvaluationData = async (currentUserPuuid) => {
    const response = await axiosInstance.get('/matching/db/review', {
        withAuth: true,
    });
    const data = response.data.data;

    const sentEvaluations = [];

    data.forEach(group => {
        group.dtoList.forEach(item => {
            const transformedItem = transformEvaluationToFrontend(item);
            const acceptorPuuid = item.acceptor?.memberInfo?.riotAccount?.puuid;
            const requestorPuuid = item.requestor?.memberInfo?.riotAccount?.puuid;
            console.log("item : ", item);

            let otherUser = null;
            if (acceptorPuuid === currentUserPuuid) {
                otherUser = transformUserInfo(item.requestor, item.requestorId, item.mypageId);
            } else if (requestorPuuid === currentUserPuuid) {
                otherUser = transformUserInfo(item.acceptor, item.acceptorId, item.mypageId);
            } else {
                console.log('내가 관련되지 않은 매칭');
            }

            if (otherUser) {
                sentEvaluations.push({
                    ...transformedItem,
                    mode: 'sent',
                    otherUser: otherUser
                });
            }
        });
    });

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

const transformUserInfo = (userObj, otherUserid, mypageId) => {
    if (!userObj) return {};
    console.log("oterrUserid", otherUserid);
    const riot = userObj.memberInfo?.riotAccount || {};
    const memberInfo = userObj.memberInfo || {};
    const userInfo = userObj.userInfo || {};
    return {
        memberId: otherUserid, // ✅ 여기 추가
        mypageId: mypageId,
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
    const response = await axiosInstance.post('/reviews', evaluationData, {
        withAuth: true,
    });
    return response.data;
};
