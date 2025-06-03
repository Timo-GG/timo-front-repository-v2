import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    useTheme,
} from '@mui/material';
import WithdrawConfirmDialog from '../components/WithdrawConfirmDialog';
import useAuthStore from '../storage/useAuthStore';
import {updateUsername, verifyAccount, resetRiotAccount, registerRanking} from '../apis/accountAPI';
import {checkUniv, requestUnivVerification, verifyUnivCode, updateUnivAccount} from '../apis/univAPI';
import {getMyInfo} from '../apis/authAPI';
import {deleteMyRanking} from '../apis/rankAPI';

export default function MySettingPage() {
    const theme = useTheme();
    const {userData, setUserData} = useAuthStore();

    // ━━━━━━━━━━━ 기본 프로필 관련 상태 ━━━━━━━━━━━
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');

    // ━━━━━━━━━━━ 소환사(롤 계정) 인증 관련 상태 ━━━━━━━━━━━
    const [riotAccountInput, setRiotAccountInput] = useState('');
    const [isSummonerVerified, setIsSummonerVerified] = useState(false);
    const [summonerStatusMsg, setSummonerStatusMsg] = useState('');

    // ━━━━━━━━━━━ 학교명 확인 관련 상태 ━━━━━━━━━━━
    const [univName, setUnivName] = useState('');
    const [univNameError, setUnivNameError] = useState(''); // 필요하면 에러 메시지 표시
    const [isUnivNameValid, setIsUnivNameValid] = useState(false);
    const [isUnivNameLocked, setIsUnivNameLocked] = useState(false);
    const [univNameStatus, setUnivNameStatus] = useState('');

    // ━━━━━━━━━━━ 학교 이메일 인증 관련 상태 ━━━━━━━━━━━
    const [univEmail, setUnivEmail] = useState('');
    const [isUnivEmailSent, setIsUnivEmailSent] = useState(false);
    const [showUnivCodeInput, setShowUnivCodeInput] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailError, setEmailError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isUnivEmailVerified, setIsUnivEmailVerified] = useState(false);

    // ━━━━━━━━━━━ 계정 탈퇴 다이얼로그 ━━━━━━━━━━━
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

    // ━━━━━━━━━━━ userData 로부터 초기값 세팅 ━━━━━━━━━━━
    useEffect(() => {
        if (!userData) return;

        // 1) 닉네임
        setUsername(userData.username || '');

        // 2) 소환사(롤) 계정이 이미 등록돼 있으면 input 락, 메시지 세팅
        if (userData.riotAccount) {
            const {accountName, accountTag} = userData.riotAccount;
            setRiotAccountInput(`${accountName}#${accountTag}`);
            setIsSummonerVerified(true);
        }

        // 3) 인증된 학교 정보가 있으면, 학교명·이메일 모두 락, 확인 메시지 세팅
        if (userData.certifiedUnivInfo) {
            const {univName: savedName, univCertifiedEmail: savedEmail} = userData.certifiedUnivInfo;
            setUnivName(savedName);
            setUnivEmail(savedEmail);
            setIsUnivNameValid(true);
            setIsUnivNameLocked(true);
            setIsUnivEmailVerified(true);
            setIsUnivEmailSent(false);
            setShowUnivCodeInput(false);
            setUnivNameStatus('✔️ 이미 인증된 대학교입니다.');
        } else {
            // 인증된 학교 정보가 없으면 모두 초기 상태
            setIsUnivNameValid(false);
            setIsUnivNameLocked(false);
            setIsUnivEmailVerified(false);
            setIsUnivEmailSent(false);
            setShowUnivCodeInput(false);
            setUnivNameStatus('');
            setUnivEmail('');
        }
    }, [userData]);

    // ━━━━━━━━━━━ 소환사(롤 계정) 등록/해제 핸들러 ━━━━━━━━━━━
    async function handleSummonerRegister() {
        setSummonerStatusMsg('');
        const [accountName, accountTag] = riotAccountInput.split('#');
        if (!accountName || !accountTag) {
            setSummonerStatusMsg('형식이 올바르지 않습니다. 예: 짱아깨비#KR1');
            return;
        }
        try {
            const res = await verifyAccount({accountName, tagLine: accountTag});
            if (!res.success) {
                setSummonerStatusMsg('소환사 정보를 찾을 수 없습니다.');
                return;
            }
            // 인증 성공 → 내 정보 갱신
            const { data: profile } = await getMyInfo();
            setUserData(profile);
            setIsSummonerVerified(true);
            setSummonerStatusMsg('✔️ 소환사 인증 완료');

            // 이미 학교 인증된 상태라면, 푸유아이디가 있으면 랭킹 등록
            if (profile.certifiedUnivInfo) {
                try {
                    const puuid = profile.riotAccount.puuid;
                    await registerRanking(puuid);
                } catch (e) {
                    console.error('⚠️ 랭킹 등록 실패', e);
                }
            }
        } catch (error) {
            // “이미 사용중인 소환사 계정입니다.” 등 서버 메시지를 그대로 보여주기
            const apiMsg =
                error.response?.data?.message ||
                '소환사 인증 중 오류가 발생했습니다.';
            setSummonerStatusMsg(apiMsg);
        }
    }

    async function handleSummonerReset() {
        setSummonerStatusMsg('');
        try {
            await resetRiotAccount();
            try {
                await deleteMyRanking();
            } catch (e) {
                console.error('⚠️ 랭킹 삭제 실패', e);
            }
            const { data: profile } = await getMyInfo();
            setUserData(profile);
            setRiotAccountInput('');
            setIsSummonerVerified(false);
            setSummonerStatusMsg('소환사 인증이 취소되었습니다.');
        } catch (error) {
            console.error('소환사 해제 중 오류:', error);
            setSummonerStatusMsg('소환사 해제 중 오류가 발생했습니다.');
        }
    }

    // ━━━━━━━━━━━ 학교명 확인/해제 핸들러 ━━━━━━━━━━━
    async function handleUniversityCheck() {
        // 이미 “학교명 인증 완료” 상태라면 → 해제
        if (isUnivNameLocked) {
            try {
                // 백엔드에 학교명 null 처리
                await updateUnivAccount({univName: null, univEmail: null});
                // UI 초기화
                setIsUnivNameLocked(false);
                setIsUnivNameValid(false);
                setUnivName('');
                setUnivEmail('');
                setIsUnivEmailSent(false);
                setShowUnivCodeInput(false);
                setIsUnivEmailVerified(false);
                setUnivNameStatus('');

                // 프로필 다시 가져오기
                const { data: profile } = await getMyInfo();
                setUserData(profile);
            } catch (error) {
                console.error('대학교 해제 실패:', error);
                setUnivNameStatus('대학교 해제 중 오류가 발생했습니다.');
            }
            return;
        }

        // 학교명 입력 후 “확인” 버튼 눌렀을 때
        setUnivNameStatus('');
        if (!univName.trim()) {
            setUnivNameStatus('학교명을 입력해주세요.');
            return;
        }
        try {
            const res = await checkUniv({univName});
            if (res.success) {
                setIsUnivNameValid(true);
                setIsUnivNameLocked(true);
                setUnivNameStatus('✔️ 존재하는 대학교입니다.');
            } else {
                setUnivNameStatus('존재하지 않는 대학교입니다.');
            }
        } catch {
            setUnivNameStatus('대학교 확인 중 오류가 발생했습니다.');
        }
    }

    // ━━━━━━━━━━━ 학교 이메일 등록/해제 핸들러 ━━━━━━━━━━━
    async function handleEmailRegister() {
        // 이미 이메일 인증된 상태라면 → 해제
        if (isUnivEmailVerified) {
            try {
                await updateUnivAccount({univName: null, univEmail: null});
                // UI 초기화
                setIsUnivEmailVerified(false);
                setUnivEmail('');
                setEmailError('');
                setIsUnivEmailSent(false);
                setShowUnivCodeInput(false);
                setVerificationCode('');
                setUnivNameStatus(''); // 잠시 초기화
                // 프로필 다시 가져오기
                const { data: profile } = await getMyInfo();
                setUserData(profile);
            } catch (error) {
                console.error('학교 이메일 해제 실패:', error);
                setEmailError('학교 이메일 해제 중 오류가 발생했습니다.');
            }
            return;
        }

        // 이메일 형식 체크
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(univEmail)) {
            setEmailError('올바른 이메일을 입력해주세요.');
            return;
        }
        setEmailError('');

        try {
            const res = await requestUnivVerification({univName, univEmail});
            if (res.success) {
                // 서버가 정상적으로 인증코드 전송해 줬으면
                setIsUnivEmailSent(true);
                setShowUnivCodeInput(true);
            } else if (res.errorCode === 903) {
                // 이미 인증되어 있는 이메일이라면 → 바로 update
                await updateUnivAccount({univName, univEmail});
                setIsUnivEmailVerified(true);
                setShowUnivCodeInput(false);
                // 프로필 동기화
                const { data: profile } = await getMyInfo();
                setUserData(profile);
                setUnivNameStatus('✔️ 이미 인증이 완료된 학교 이메일입니다.');
            } else if (res.errorCode === 902) {
                setEmailError('이미 사용중인 학교 이메일입니다.');
            } else {
                setEmailError('학교명 또는 이메일이 올바르지 않습니다.');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                const msg = error.response.data?.message || '요청 처리 중 오류가 발생했습니다.';
                setEmailError(msg);
            } else {
                setEmailError('네트워크 오류가 발생했습니다.');
            }
        }
    }

    // ━━━━━━━━━━━ 인증 코드 확인 핸들러 ━━━━━━━━━━━
    async function handleVerificationConfirm() {
        setVerificationError('');
        try {
            await verifyUnivCode(verificationCode, {univName, univEmail});
            await updateUnivAccount({univName, univEmail});
            setIsUnivEmailVerified(true);
            setShowUnivCodeInput(false);
            setIsUnivEmailSent(false);
            setEmailError('');
            // 프로필 동기화
            const { data: profile } = await getMyInfo();
            setUserData(profile);
            setUnivNameStatus('✔️ 학교 이메일 인증 완료');
        } catch {
            setVerificationError('인증 코드가 올바르지 않거나 만료되었습니다.');
        }
    }

    // ━━━━━━━━━━━ 회원 탈퇴 핸들러 ━━━━━━━━━━━
    const handleWithdraw = () => {
        setIsWithdrawDialogOpen(false);
        alert('탈퇴가 완료되었습니다.');
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: 5,
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 460,
                    p: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={4} color="text.primary">
                    내 계정 설정
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* ───────────────────────────────── 이메일(로그인) 출력 ───────────────────────────────── */}
                    <Box>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>이메일</Typography>
                        <TextField
                            fullWidth
                            disabled
                            value={userData?.email || ''}
                            variant="outlined"
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: theme.palette.text.disabled,
                                },
                                '& .MuiOutlinedInput-root': {
                                    height: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: theme.palette.background.inputDisabled,
                                }
                            }}
                        />
                    </Box>

                    {/* ───────────────────────────────── 닉네임 ───────────────────────────────── */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography color="text.secondary">닉네임</Typography>
                        <Box sx={{ display: 'flex', height: '56px' }}>
                            <TextField
                                fullWidth
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setUsernameError('');
                                    setUsernameMessage('');
                                }}
                                error={Boolean(usernameError)}
                                helperText={''} // 별도 Typography로 표현
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: theme.palette.background.input,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        '& fieldset': { borderColor: 'transparent' },
                                        '& input': {
                                            color: theme.palette.text.primary,
                                            padding: '12px 14px',
                                        },
                                    },
                                }}
                            />
                            <Button
                                onClick={async () => {
                                    try {
                                        await updateUsername(username);
                                        setUsernameMessage('닉네임이 성공적으로 변경되었습니다!');
                                        setUsernameError('');
                                        setUserData({ ...userData, username });
                                    } catch {
                                        setUsernameError('이미 사용 중인 닉네임입니다.');
                                        setUsernameMessage('');
                                    }
                                }}
                                sx={{
                                    height: '100%',
                                    borderRadius: '0 12px 12px 0',
                                    backgroundColor: theme.palette.background.input,
                                    color: theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.border.main}`,
                                    borderLeft: 'none',
                                    px: 3,
                                    minWidth: '80px',
                                }}
                            >
                                수정
                            </Button>
                        </Box>
                        {(usernameMessage || usernameError) && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: usernameError ? theme.palette.error.main : theme.palette.success.main,
                                    minHeight: '20px',
                                    pl: 1,
                                }}
                            >
                                {usernameError || usernameMessage}
                            </Typography>
                        )}
                    </Box>

                    {/* ───────────────────────────────── 소환사 이름 ───────────────────────────────── */}
                    <Box>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>소환사 이름</Typography>
                        <Box sx={{ display: 'flex', height: '56px' }}>
                            <TextField
                                fullWidth
                                placeholder="ex) 짱아깨비#KR"
                                value={riotAccountInput}
                                disabled={isSummonerVerified}
                                onChange={(e) => {
                                    setRiotAccountInput(e.target.value);
                                    setSummonerStatusMsg('');
                                }}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: theme.palette.background.input,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        '& fieldset': { borderColor: 'transparent' },
                                        '& input': { color: theme.palette.text.primary, padding: '12px 14px' },
                                    },
                                }}
                            />
                            <Button
                                onClick={isSummonerVerified ? handleSummonerReset : handleSummonerRegister}
                                sx={{
                                    height: '100%',
                                    borderRadius: '0 12px 12px 0',
                                    backgroundColor: theme.palette.background.input,
                                    color: theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.border.main}`,
                                    borderLeft: 'none',
                                    px: 3,
                                    minWidth: '80px',
                                }}
                            >
                                {isSummonerVerified ? '해제' : '등록'}
                            </Button>
                        </Box>
                        {summonerStatusMsg && (
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    color: summonerStatusMsg.includes('✔️')
                                        ? theme.palette.success.main
                                        : theme.palette.error.main,
                                }}
                            >
                                {summonerStatusMsg}
                            </Typography>
                        )}
                    </Box>

                    {/* ───────────────────────────────── 학교명 확인 ───────────────────────────────── */}
                    <Box>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>학교명</Typography>
                        <Box sx={{ display: 'flex', height: '56px' }}>
                            <TextField
                                fullWidth
                                placeholder="서울과학기술대학교"
                                value={univName}
                                onChange={(e) => {
                                    setUnivName(e.target.value);
                                    setUnivNameStatus('');
                                }}
                                disabled={isUnivNameLocked}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: theme.palette.background.input,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        '& fieldset': { borderColor: 'transparent' },
                                        '& input': { color: theme.palette.text.primary, padding: '12px 14px' },
                                    },
                                }}
                            />
                            <Button
                                onClick={handleUniversityCheck}
                                sx={{
                                    height: '100%',
                                    borderRadius: '0 12px 12px 0',
                                    backgroundColor: theme.palette.background.input,
                                    color: theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.border.main}`,
                                    borderLeft: 'none',
                                    px: 3,
                                    minWidth: '80px',
                                }}
                            >
                                {isUnivNameLocked ? '해제' : '확인'}
                            </Button>
                        </Box>
                        {univNameStatus && (
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    color: univNameStatus.includes('존재하지')
                                        ? theme.palette.error.main
                                        : theme.palette.success.main,
                                }}
                            >
                                {univNameStatus}
                            </Typography>
                        )}
                    </Box>

                    {/* ───────────────────────────────── 학교 이메일 입력 ───────────────────────────────── */}
                    {isUnivNameValid && !isUnivEmailVerified && (
                        <Box>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>학교 이메일</Typography>
                            <Box sx={{ display: 'flex', height: '56px' }}>
                                <TextField
                                    fullWidth
                                    placeholder="예) hong@seoultech.ac.kr"
                                    value={univEmail}
                                    onChange={(e) => {
                                        setUnivEmail(e.target.value);
                                        setEmailError('');
                                        setIsUnivEmailSent(false);
                                        setShowUnivCodeInput(false);
                                        setVerificationError('');
                                    }}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            borderRadius: showUnivCodeInput ? '12px 0 0 12px' : '12px',
                                            backgroundColor: theme.palette.background.input,
                                            border: `1px solid ${theme.palette.border.main}`,
                                            '& fieldset': { borderColor: 'transparent' },
                                            '& input': { color: theme.palette.text.primary, padding: '12px 14px' },
                                        },
                                    }}
                                    error={Boolean(emailError)}
                                    helperText={emailError}
                                />
                                <Button
                                    onClick={handleEmailRegister}
                                    disabled={!isUnivNameValid}
                                    sx={{
                                        height: '100%',
                                        borderRadius: '0 12px 12px 0',
                                        backgroundColor: theme.palette.background.input,
                                        color: theme.palette.text.secondary,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        borderLeft: 'none',
                                        px: 3,
                                        minWidth: '80px',
                                    }}
                                >
                                    등록
                                </Button>
                            </Box>
                            {isUnivEmailSent && (
                                <Typography variant="caption" color={theme.palette.info.main} sx={{ mt: 1 }}>
                                    인증 코드를 전송했습니다.
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* ───────────────────────────────── 인증 코드 입력 ───────────────────────────────── */}
                    {showUnivCodeInput && !isUnivEmailVerified && (
                        <Box sx={{ mt: 2 }}>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>인증 코드</Typography>
                            <Box sx={{ display: 'flex', height: '56px' }}>
                                <TextField
                                    fullWidth
                                    placeholder="인증 코드를 입력하세요"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        setVerificationCode(e.target.value);
                                        setVerificationError('');
                                    }}
                                    variant="outlined"
                                    error={Boolean(verificationError)}
                                    helperText={verificationError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            borderRadius: '12px 0 0 12px',
                                            backgroundColor: theme.palette.background.input,
                                            border: `1px solid ${theme.palette.border.main}`,
                                            '& fieldset': { borderColor: 'transparent' },
                                            '& input': { color: theme.palette.text.primary, padding: '12px 14px' },
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleVerificationConfirm}
                                    sx={{
                                        height: '100%',
                                        borderRadius: '0 12px 12px 0',
                                        backgroundColor: theme.palette.background.input,
                                        color: theme.palette.text.secondary,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        borderLeft: 'none',
                                        px: 3,
                                        minWidth: '80px',
                                    }}
                                >
                                    확인
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* ───────────────────────────────── 계정 삭제 ───────────────────────────────── */}
                    <Box>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>계정 삭제</Typography>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ borderRadius: 1 }}
                            onClick={() => setIsWithdrawDialogOpen(true)}
                        >
                            회원 탈퇴
                        </Button>
                    </Box>
                </Box>

            </Paper>

            <WithdrawConfirmDialog
                open={isWithdrawDialogOpen}
                onClose={() => setIsWithdrawDialogOpen(false)}
                onConfirm={handleWithdraw}
            />
        </Box>
    );
}
