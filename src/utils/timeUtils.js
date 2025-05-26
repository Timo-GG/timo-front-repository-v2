// src/utils/timeUtils.js
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
        return '방금전';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}분전`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}시간전`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}일전`;
    } else {
        // 일주일 이상은 날짜로 표시
        return past.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    }
};

// 실시간 업데이트를 위한 Hook
export const useRelativeTime = (timestamp, updateInterval = 60000) => {
    const [relativeTime, setRelativeTime] = useState(formatRelativeTime(timestamp));

    useEffect(() => {
        const updateTime = () => {
            setRelativeTime(formatRelativeTime(timestamp));
        };

        updateTime(); // 초기 설정
        const interval = setInterval(updateTime, updateInterval);

        return () => clearInterval(interval);
    }, [timestamp, updateInterval]);

    return relativeTime;
};
