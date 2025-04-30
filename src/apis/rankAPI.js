import axiosInstance from './axiosInstance';

export const fetchRankingList = async () => {
    const response = await axiosInstance.get('/ranking/top', {withAuth: true});
    return response.data.data.map((item, index) => ({
        ranking: index + 1,
        name: item.gameName,
        avatarUrl: item.profileIconUrl || '/assets/default.png',
        tag: item.tagLine,
        position: item.position?.toLowerCase() || 'unknown',
        tier: item.tier.toLowerCase() || 'unknown',
        score: item.score,
        rank: item.rank,
        lp: item.lp,
        university: item.university,
        department: item.department,
        champions: item.mostChampions,
        mbti: item.mbti,
        gender: item.gender,
        message: item.memo || '',
        time: '방금 전',
        wins: item.wins,
        losses: item.losses,
    }));
};

export const fetchRankingByUniversity = async (university, limit = 10) => {
    const response = await axiosInstance.get('/ranking/top/univ', {
        params: { university, limit },
        withAuth: true,
    });
    return response.data.data.map((item, index) => ({
        ranking: index + 1,
        name: item.gameName,
        avatarUrl: item.profileIconUrl || '/assets/default.png',
        tag: item.tagLine,
        position: item.position?.toLowerCase() || 'unknown',
        tier: item.tier.toLowerCase() || 'unknown',
        score: item.score,
        rank: item.rank,
        lp: item.lp,
        university: item.university,
        department: item.department,
        champions: item.mostChampions,
        mbti: item.mbti,
        gender: item.gender,
        message: item.memo || '',
        time: '방금 전',
        wins: item.wins,
        losses: item.losses,
    }));
};

export const updateRankingInfo = async (dto) => {
    await axiosInstance.post('/ranking/update', dto, { withAuth: true });
};

export async function fetchMyRankingInfo() {
    const response = await axiosInstance.get('/ranking/me', {withAuth: true});
    return response.data.data;
}

export const deleteMyRanking = () => {
    return axiosInstance.delete(
        '/ranking',    // baseURL에 /api/v1 가 이미 붙어 있다고 가정
        {
            withAuth: true,
        }
    );
};