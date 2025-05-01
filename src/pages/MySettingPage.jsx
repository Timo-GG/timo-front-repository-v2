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
import {checkUniv} from '../apis/univAPI';
import {
    requestUnivVerification,
    verifyUnivCode,
    updateUnivAccount,
} from '../apis/univAPI';
import {getMyInfo} from '../apis/authAPI';
import {deleteMyRanking} from '../apis/rankAPI';

export default function MySettingPage() {
    const theme = useTheme();
    const {userData, setUserData} = useAuthStore();

    const [username, setUsername] = useState('');
    const [riotAccountInput, setRiotAccountInput] = useState('');
    const [univName, setUnivName] = useState('');
    const [univEmail, setUnivEmail] = useState('');
    const [department, setDepartment] = useState('');

    const [isUnivEmailDisabled, setIsUnivEmailDisabled] = useState(true);
    const [showVerificationBtn, setShowVerificationBtn] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);

    const [verificationCode, setVerificationCode] = useState('');

    const [emailError, setEmailError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const [usernameMessage, setUsernameMessage] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
    const [isSummonerVerified, setIsSummonerVerified] = useState(false);
    const [summonerStatusMsg, setSummonerStatusMsg] = useState('');

    const [isUnivEmailVerified, setIsUnivEmailVerified] = useState(false);
    const [univStatusMsg, setUnivStatusMsg] = useState('');
    const [isUnivLocked, setIsUnivLocked] = useState(false);

    // initialize from userData
    useEffect(() => {
        if (!userData) return;
        setUsername(userData.username || '');

        if (userData.riotAccount) {
            const {accountName, accountTag} = userData.riotAccount;
            setRiotAccountInput(`${accountName}#${accountTag}`);
            setIsSummonerVerified(true);
        }

        if (userData.certifiedUnivInfo) {
            const {univName, univCertifiedEmail, department} = userData.certifiedUnivInfo;
            setUnivName(univName);
            setUnivEmail(univCertifiedEmail);
            setDepartment(department);
            setIsUnivEmailDisabled(true);
            setShowVerificationBtn(true);
            setShowVerificationInput(false);
            setIsUnivEmailVerified(true);
            setUnivStatusMsg('');
            setIsUnivLocked(true);
        } else {
            setIsUnivEmailDisabled(false);
            setShowVerificationBtn(true);
            setIsUnivEmailVerified(false);
            setUnivStatusMsg('');
            setIsUnivLocked(false);
        }
    }, [userData]);

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
            // 프로필 갱신
            const {data: profile} = await getMyInfo();
            setUserData(profile);
            setIsSummonerVerified(true);
            setSummonerStatusMsg('✔️ 소환사 이름 인증 완료');

            if (profile.certifiedUnivInfo) {
                try {
                    await registerRanking(profile.riotAccount.puuid);
                } catch (e) {
                    console.error('⚠️ 랭킹 등록 실패', e);
                }
            }
        } catch {
            setSummonerStatusMsg('소환사 인증 중 오류가 발생했습니다.');
        }
    }

    async function handleSummonerReset() {
        setSummonerStatusMsg('');
        try {
            await resetRiotAccount();
            try {
                const delRes = await deleteMyRanking();
                console.log('← 랭킹 삭제 응답:', delRes);
            } catch (e) {
                console.error('⚠️ 레디스 랭킹 삭제 실패', e);
            }
            const {data: {data: profile}} = await getMyInfo();
            setUserData(profile);                  // 로컬 프로필 갱신
            setRiotAccountInput('');
            setIsSummonerVerified(false);
            setSummonerStatusMsg('소환사 계정이 해제되었습니다.');
        } catch {
            setSummonerStatusMsg('소환사 해제 중 오류가 발생했습니다.');
        }
    }

    // handle univ name check / reset
    const handleUniversityCheck = async () => {
        if (isUnivEmailDisabled) {
            // reset
            try {
                await updateUnivAccount({univName: null, univEmail: null});

                if (userData?.riotAccount?.puuid) {
                    await deleteMyRanking();
                }

                // 전체 프로필 새로고침
                const refreshed = await getMyInfo();
                setUserData(refreshed.data.data);
                setUnivName('');
                setUnivEmail('');
                setDepartment('');
                setIsUnivEmailDisabled(false);
                setShowVerificationBtn(true);
                setShowVerificationInput(false);
                setEmailError('');
                setEmailSent(false);
                setVerificationError('');
                setIsUnivEmailVerified(false);
                setUnivStatusMsg('');
                setIsUnivLocked(false);
            } catch {
                alert('학교 정보 해제 중 오류가 발생했습니다.');
            }
            return;
        }

        // check existence
        try {
            const res = await checkUniv({univName});
            if (!res.success) {
                setUnivStatusMsg('존재하지 않는 대학교입니다.');
                return;
            }
            setUnivStatusMsg('존재하는 대학교입니다.');
            setIsUnivEmailDisabled(false);
            setShowVerificationBtn(true);
            setIsUnivLocked(true);
        } catch {
            setUnivStatusMsg('대학교 확인 중 오류가 발생했습니다.');
        }
    };

    // handle school email code send
    const handleEmailRegister = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(univEmail)) {
            setEmailError('올바르지 않은 이메일 입니다.');
            return;
        }
        try {
            const res = await requestUnivVerification({univName, univEmail});
            console.log("res : ", res);

            // ✅ 응답은 성공적으로 왔지만 인증 완료된 상태라면

            if (res.success === false && res.errorCode === 903) {
                // 이미 인증된 경우: 바로 업데이트
                try {
                    const updated = await updateUnivAccount({univName, univEmail});
                    const refreshed = await getMyInfo();
                    const profile = refreshed.data;
                    console.log('profile', profile);
                    setUserData(profile);
                    setShowVerificationInput(false);
                    setEmailSent(false);
                    setIsUnivEmailVerified(true);
                    alert('이미 인증이 완료된 학교 계정입니다.');

                    // 등록된 소환사가 있다면 랭킹 등록
                    const puuid = profile.riotAccount?.puuid;
                    console.log('puuid : ', puuid);
                    if (puuid) await registerRanking(puuid);
                } catch {
                    setEmailError('인증 상태 동기화 중 오류가 발생했습니다.');
                }
            } else if (res.success === true) {
                // 정상적인 인증 요청
                setEmailError('');
                setEmailSent(true);
                setShowVerificationInput(true);
            } else {
                // 예외적인 응답 처리
                setEmailError('학교명 또는 이메일이 올바르지 않습니다.');
            }
        } catch (err) {
            setEmailError('네트워크 오류가 발생했습니다.');
        }
    };


    // handle code confirm
    const handleVerificationConfirm = async () => {
        try {
            await verifyUnivCode(verificationCode, {univName, univEmail});
            await updateUnivAccount({univName, univEmail});

            // refresh profile
            const refreshed = await getMyInfo();
            const profile = refreshed.data.data;
            setUserData(profile);
            setShowVerificationInput(false);
            setEmailSent(false);
            setIsUnivEmailVerified(true);

            if (profile.riotAccount) {
                try {
                    await registerRanking(profile.riotAccount.puuid);
                } catch (e) {
                    console.error('⚠️ 랭킹 등록 실패', e);
                }
            }
        } catch {
            setVerificationError('인증코드가 올바르지 않거나 만료되었습니다.');
        }
    };

    // handle withdraw
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
            <Paper elevation={3} sx={{
                width: '100%',
                maxWidth: 460,
                p: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2
            }}>
                <Typography variant="h5" fontWeight="bold" mb={4} color="text.primary">
                    내 계정
                </Typography>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    {/* 이메일 */}
                    <Box>
                        <Typography color="text.secondary" sx={{mb: 1}}>이메일</Typography>
                        <Box sx={{display: 'flex', height: '56px'}}>
                            <TextField
                                fullWidth
                                disabled
                                value={userData?.email || ""}
                                variant="outlined"
                                sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor: theme.palette.text.disabled,
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '12px',
                                        backgroundColor: theme.palette.background.inputDisabled,
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* 닉네임 */}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Typography color="text.secondary">닉네임</Typography>
                        <Box sx={{display: 'flex'}}>
                            <TextField
                                fullWidth
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setUsernameError("");
                                    setUsernameMessage("");
                                }}
                                error={Boolean(usernameError)}
                                helperText="" // 여기에 helperText 넣지 않고 아래 Typography로 따로 처리
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '56px',
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: theme.palette.background.input,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        '& fieldset': {borderColor: 'transparent'},
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
                                        setUsernameMessage("닉네임이 성공적으로 변경되었습니다!");
                                        setUsernameError("");
                                        setUserData({...userData, username});
                                    } catch (err) {
                                        setUsernameError("이미 사용 중인 닉네임입니다.");
                                        setUsernameMessage("");
                                    }
                                }}
                                sx={{
                                    height: '56px',
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
                                    color: usernameError ? theme.palette.error.main : theme.palette.text.secondary,
                                    minHeight: '20px',
                                    pl: 1,
                                }}
                            >
                                {usernameError || usernameMessage}
                            </Typography>
                        )}
                    </Box>


                    {/* 소환사 이름 */}
                    <Box>
                        <Typography color="text.secondary" sx={{mb: 1}}>소환사 이름</Typography>
                        <Box sx={{display: 'flex', height: '56px'}}>
                            <TextField
                                fullWidth
                                placeholder="ex) 짱아깨비#KR"
                                value={riotAccountInput}
                                onChange={e => {
                                    setRiotAccountInput(e.target.value);
                                    setSummonerStatusMsg('');
                                }}
                                disabled={Boolean(userData?.riotAccount)}                     // 계정이 있으면 입력 비활성화
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: theme.palette.background.input,
                                        border: `1px solid ${theme.palette.border.main}`,
                                        '& fieldset': {borderColor: 'transparent'},
                                        '& input': {color: theme.palette.text.primary, padding: '12px 14px'},
                                    },
                                }}
                            />

                            {userData?.riotAccount
                                ? (
                                    <Button
                                        onClick={handleSummonerReset}
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
                                        해제
                                    </Button>
                                )
                                : (
                                    <Button
                                        onClick={handleSummonerRegister}
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
                                )
                            }
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

                    {/* 학교 */}
                    <Box>
                        <Typography color="text.secondary" sx={{mb: 1}}>학교</Typography>
                        <Box sx={{display: 'flex', height: '56px'}}>
                            <TextField
                                fullWidth
                                value={univName}
                                onChange={(e) => setUnivName(e.target.value)}
                                disabled={isUnivEmailDisabled} // 등록 후 비활성화
                                variant="outlined"
                                placeholder="학교명을 입력하세요"
                                sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor: theme.palette.text.disabled,
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        border: `1px solid ${theme.palette.border.main}`,
                                        borderRadius: '12px 0 0 12px',
                                        backgroundColor: isUnivLocked
                                            ? theme.palette.background.input
                                            : theme.palette.background.input,
                                        '& fieldset': {borderColor: 'transparent'},
                                        '& input': {
                                            color: theme.palette.text.primary,
                                            padding: '12px 14px',
                                        },
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
                                {isUnivEmailDisabled ? '해제' : '등록'}
                            </Button>
                        </Box>
                        {univStatusMsg && !isUnivEmailVerified && (
                            <Typography variant="caption" sx={{
                                mt: 1,
                                color: univStatusMsg.includes("존재") ? theme.palette.info.main : theme.palette.error.main
                            }}>
                                {univStatusMsg}
                            </Typography>
                        )}
                    </Box>


                    {/* 학교 이메일 + 등록 버튼 */}
                    <Box>
                        <Typography color="text.secondary" sx={{mb: 1}}>학교 이메일</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <Box sx={{display: 'flex', height: '56px'}}>
                                <TextField
                                    fullWidth
                                    disabled={isUnivEmailDisabled}
                                    value={univEmail}
                                    onChange={e => {
                                        setUnivEmail(e.target.value);
                                        setEmailError('');
                                        setEmailSent(false);
                                    }}
                                    variant="outlined"
                                    error={!isUnivEmailDisabled && Boolean(emailError)}
                                    helperText={!isUnivEmailDisabled ? emailError : ""}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: theme.palette.text.disabled,
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            border: `1px solid ${theme.palette.border.main}`,
                                            borderRadius: showVerificationBtn ? '12px 0 0 12px' : '12px',
                                            backgroundColor: isUnivEmailDisabled
                                                ? theme.palette.background.inputDisabled
                                                : theme.palette.background.input,
                                        },
                                    }}
                                />
                                {showVerificationBtn && (
                                    <Button
                                        onClick={handleEmailRegister}
                                        sx={{
                                            height: '100%',
                                            borderRadius: '0 12px 12px 0',
                                            backgroundColor: theme.palette.background.input,
                                            color: theme.palette.text.secondary,
                                            border: `1px solid ${theme.palette.border.main}`,
                                            borderLeft: 'none',
                                            px: 3,
                                            minWidth: '80px'
                                        }}
                                    >
                                        등록
                                    </Button>
                                )}
                            </Box>
                            {emailSent && !isUnivEmailVerified && (
                                <Typography variant="caption" sx={{color: theme.palette.info.main, mt: 1}}>
                                    인증코드를 전송하였습니다.
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* 인증 코드 입력 + 확인 버튼 */}
                    {showVerificationInput && !isUnivEmailVerified && (
                        <Box sx={{mt: 2, display: 'flex', flexDirection: 'column'}}>
                            <Typography color="text.secondary" sx={{mb: 1}}>인증 코드</Typography>
                            <Box sx={{display: 'flex', height: '56px'}}>
                                <TextField
                                    fullWidth
                                    value={verificationCode}
                                    onChange={(e) => {
                                        setVerificationCode(e.target.value);
                                        setVerificationError("");
                                    }}
                                    variant="outlined"
                                    placeholder="인증 코드를 입력하세요"
                                    error={Boolean(verificationError)}
                                    helperText={verificationError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            borderRadius: '12px 0 0 12px',
                                            backgroundColor: theme.palette.background.input,
                                            border: `1px solid ${theme.palette.border.main}`,
                                            '& fieldset': {borderColor: 'transparent'},
                                            '& input': {color: theme.palette.text.primary, padding: '12px 14px'}
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
                                        minWidth: '80px'
                                    }}
                                >
                                    확인
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* 계정 삭제 */}
                    <Box>
                        <Typography color="text.secondary" sx={{mb: 1}}>계정 삭제</Typography>
                        <Button variant="contained" color="error" sx={{borderRadius: 1, fontSize: '0.rem'}}
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