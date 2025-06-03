// src/utils/timeUtils.js
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
        return '방금 전';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}일 전`;
    } else {
        // 일주일 이상은 날짜로 표시
        return past.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    }
};

export const calculateExpiryTime = (createdAt) => {
    const created = new Date(createdAt);
    const expiry = new Date(created.getTime() + 24 * 60 * 60 * 1000); // 24시간 후
    return expiry;
};

export const formatTimeUntilExpiry = (createdAt) => {
    const now = new Date();
    const expiry = calculateExpiryTime(createdAt);
    const timeDiff = expiry.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return "만료됨";
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}시간 후`;
    } else if (minutes > 0) {
        return `${minutes}분 후 만료`;
    } else {
        return "곧 만료";
    }
};

export const getExpiryColor = (updatedAt) => {
    const expiry = calculateExpiryTime(updatedAt);
    const now = new Date();
    const timeDiff = expiry.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return '#f44336'; // 만료됨
    }

    if (timeDiff <= 15 * 60 * 1000) {
        return '#ff9800'; // 15분 이하 경고
    }

    return '#42E6B5'; // 정상 상태
};

export const isExpired = (createdAt) => {
    const now = new Date();
    const expiry = calculateExpiryTime(createdAt);
    return now.getTime() > expiry.getTime();
};

