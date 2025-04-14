import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUsername } from '../apis/accountAPI';
import {
    requestUnivVerification,
    verifyUnivCode,
    checkUniv,
    updateUnivAccount,
} from '../apis/univAPI';
import { getMyInfo } from '../apis/authAPI';
import { verifyAccount } from '../apis/accountAPI';
import useAuthStore from '../storage/useAuthStore';

export default function SignupPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { setUserData, setEmailVerified, setSummonerVerified } = useAuthStore();

    const [oauthEmail, setOauthEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [summonerName, setSummonerName] = useState('');
    const [university, setUniversity] = useState('');
    const [schoolEmail, setSchoolEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [emailError, setEmailError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [universityStatus, setUniversityStatus] = useState('');
    const [isUniversityValid, setIsUniversityValid] = useState(false);
    const [isUniversityLocked, setIsUniversityLocked] = useState(false);
    const [isSummonerVerified, setIsSummonerVerified] = useState(false);
    const [summonerStatusMsg, setSummonerStatusMsg] = useState('');

    const [nicknameStatus, setNicknameStatus] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getMyInfo();
                const profile = res.data;
                setUserData(profile);
                setOauthEmail(profile.email || '');
                setNickname(profile.username || '');

                const riot = profile.riotAccount;
                if (riot?.accountName && riot?.accountTag) {
                    setSummonerName(`${riot.accountName}#${riot.accountTag}`);
                    setIsSummonerVerified(true);
                }

                const univ = profile.certifiedUnivInfo;
                if (univ?.univCertifiedEmail) {
                    setUniversity(univ.univName);
                    setSchoolEmail(univ.univCertifiedEmail);
                    setIsUniversityLocked(true);
                    setIsUniversityValid(true);
                }
            } catch (err) {
                console.error('유저 정보 불러오기 실패:', err);
            }
        };
        fetchUserInfo();
    }, []);

    const handleUniversityCheck = async () => {
        if (isUniversityLocked) {
            setIsUniversityLocked(false);
            setUniversity('');
            setUniversityStatus('');
            setIsUniversityValid(false);
            setSchoolEmail('');
            setEmailError('');
            setEmailSent(false);
            setShowVerificationInput(false);
            return;
        }

        try {
            const res = await checkUniv({ univName: university });
            if (res.success) {
                setUniversityStatus('존재하는 대학교입니다.');
                setIsUniversityValid(true);
                setIsUniversityLocked(true);

            } else {
                setUniversityStatus('존재하지 않는 대학교입니다.');
                setIsUniversityValid(false);
            }
        } catch (e) {
            setUniversityStatus('대학교 확인 중 오류가 발생했습니다.');
            setIsUniversityValid(false);
        }
    };

    const handleEmailRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(schoolEmail)) {
            setEmailError('올바르지 않은 이메일 입니다.');
            return;
        }

        try {
            await requestUnivVerification({ univName: university, univEmail: schoolEmail });
            setEmailError('');
            setEmailSent(true);
            setShowVerificationInput(true);
        } catch (err) {
            setEmailError('학교명 또는 이메일이 올바르지 않습니다.');
        }
    };

    const handleVerificationConfirm = async () => {
        try {
            await verifyUnivCode(verificationCode, {
                univName: university,
                univEmail: schoolEmail,
            });

            await updateUnivAccount({ univName: university, univEmail: schoolEmail });
            setEmailVerified(true);
            setShowVerificationInput(false);
            setEmailSent(false);
            setUserData((prev) => ({
                ...prev,
                certifiedUnivInfo: {
                    univName: university,
                    univCertifiedEmail: schoolEmail,
                },
            }));
            navigate('/profile-setup', {
                state: { nickname, summonerName, university, schoolEmail, oauthEmail },
            });
        } catch (err) {
            setVerificationError('인증코드가 올바르지 않거나 만료되었습니다.');
        }
    };

    const handleSummonerVerify = async () => {
        const [name, tag] = summonerName.split('#');
        if (!name || !tag) {
            setSummonerStatusMsg('형식이 올바르지 않습니다. 예: 짱아깨비#KR1');
            return;
        }

        try {
            const res = await verifyAccount({ accountName: name, tagLine: tag });
            if (res.success) {
                setSummonerStatusMsg('✔️ 소환사 이름 인증 완료');
                setIsSummonerVerified(true);
                setSummonerVerified(true);

                setUserData((prev) => ({
                    ...prev,
                    riotAccount: {
                        accountName: name,
                        accountTag: tag,
                        puuid: res.data.puuid,
                    },
                }));
            } else {
                setSummonerStatusMsg('소환사 정보를 찾을 수 없습니다.');
            }
        } catch (e) {
            setSummonerStatusMsg('검증 중 오류가 발생했습니다.');
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: 6,
                px: 2,
                maxWidth: 460,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Typography variant="h5" fontWeight="bold">회원가입</Typography>

            {/* 이메일 */}
            <Box>
                <Typography color="text.secondary" mb={1}>이메일</Typography>
                <TextField
                    fullWidth
                    disabled
                    value={oauthEmail}
                    variant="outlined"
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: theme.palette.text.disabled,
                        },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: theme.palette.background.inputDisabled,
                        }
                    }}
                />
            </Box>

            {/* 닉네임 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography color="text.secondary">닉네임</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setNicknameError('');
                            setNicknameStatus('');
                        }}
                        variant="outlined"
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
                                await updateUsername(nickname);
                                const res = await getMyInfo(); // 닉네임 수정 후 다시 유저 정보 조회
                                setUserData(res.data); // Zustand에 유저 정보 갱신
                                setNicknameStatus('닉네임이 성공적으로 변경되었습니다.');
                                setNicknameError('');
                            } catch (err) {
                                console.log(err);
                                setNicknameError('이미 사용 중인 닉네임입니다.');
                                setNicknameStatus('');
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
                {(nicknameStatus || nicknameError) && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: nicknameError
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                            pl: 1,
                        }}
                    >
                        {nicknameError || nicknameStatus}
                    </Typography>
                )}
            </Box>


            {/* 소환사 이름 */}
            <Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>소환사 이름</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        placeholder="짱아깨비#KR1"
                        value={summonerName}
                        disabled={isSummonerVerified}
                        onChange={(e) => {
                            setSummonerName(e.target.value);
                            setIsSummonerVerified(false);
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
                        onClick={handleSummonerVerify}
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
                        {isSummonerVerified ? '해제' : '확인'}
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

            {/* 대학교 */}
            <Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>대학교</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        value={university}
                        onChange={(e) => {
                            setUniversity(e.target.value);
                            setUniversityStatus('');
                        }}
                        disabled={isUniversityLocked}
                        variant="outlined"
                        placeholder="서울과학기술대학교"
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
                        {isUniversityLocked ? '해제' : '확인'}
                    </Button>
                </Box>
                {universityStatus && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 1,
                            color: universityStatus.includes('존재하지')
                                ? theme.palette.error.main
                                : theme.palette.info.main,
                        }}
                    >
                        {universityStatus}
                    </Typography>
                )}
            </Box>

            {/* 학교 이메일 */}
            <Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>학교 이메일</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        value={schoolEmail}
                        onChange={(e) => {
                            setSchoolEmail(e.target.value);
                            setEmailError('');
                            setEmailSent(false);
                        }}
                        disabled={!isUniversityValid}
                        variant="outlined"
                        placeholder="학교 이메일 입력"
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
                        onClick={handleEmailRegister}
                        disabled={!isUniversityValid}
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
                <Box sx={{ minHeight: 20, mt: 1 }}>
                    {emailError && (
                        <Typography variant="caption" color={theme.palette.error.main}>
                            {emailError}
                        </Typography>
                    )}
                    {!emailError && emailSent && (
                        <Typography variant="caption" color={theme.palette.info.main}>
                            인증코드를 전송하였습니다.
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* 인증 코드 */}
            {showVerificationInput && (
                <Box>
                    <Typography color="text.secondary" mb={1}>인증 코드</Typography>
                    <Box sx={{ display: 'flex', height: '56px' }}>
                        <TextField
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value);
                                setVerificationError('');
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
                                    '& fieldset': { borderColor: 'transparent' },
                                    '& input': { color: theme.palette.text.primary, padding: '12px 14px' },
                                },
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
                            다음
                        </Button>
                    </Box>
                </Box>
            )}
            <Box>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold',
                        mt: 4,
                    }}
                    onClick={() =>
                        navigate('/profile-setup', {
                            state: {
                                nickname,
                                summonerName,
                                university,
                                schoolEmail,
                                oauthEmail,
                            },
                        })
                    }
                >
                    다음
                </Button>
            </Box>
        </Box>
    );
}