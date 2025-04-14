import React, { useState } from 'react';
import { Button } from '@mui/material';

export default function NotificationPermissionButton({ onAllowed }) {
    const [permissionGranted, setPermissionGranted] = useState(false);

    const handleClick = async () => {
        try {
            const testAudio = new Audio("src/assets/sound/notify.mp3");
            await testAudio.play(); // 브라우저 자동재생 제한 해제

            setPermissionGranted(true);
            if (onAllowed) onAllowed(); // 알림 허용 콜백 실행
            console.log('✅ 알림 사운드 재생 권한 허용됨');
        } catch (err) {
            console.warn('❌ 재생 실패:', err);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            disabled={permissionGranted}
        >
            {permissionGranted ? '알림 허용됨 ✅' : '🔔 알림 사운드 허용'}
        </Button>
    );
}