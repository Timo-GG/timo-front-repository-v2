import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    requestUnivVerification,
    verifyUnivCode,
    checkUniv,
    updateUnivAccount,
} from '../apis/univAPI';
import { getMyInfo } from '../apis/authAPI';
import { verifyAccount, updateUsername } from '../apis/accountAPI';
import useAuthStore from '../storage/useAuthStore';

export default function SignupPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        userData,
        setUserData,
        setEmailVerified,
        setSummonerVerified,
    } = useAuthStore();

    const [username, setUsername] = useState('');
    const [summonerName, setSummonerName] = useState('');
    const [oauthEmail, setOauthEmail] = useState('');

    const [univName, setUnivName] = useState('');
    const [univEmail, setUnivEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [isUnivLocked, setIsUnivLocked] = useState(false);
    const [isUnivValid, setIsUnivValid] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);

    const [univStatusMsg, setUnivStatusMsg] = useState('');
    const [emailError, setEmailError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [summonerVerified, setSummonerVerifiedLocal] = useState(false);
    const [summonerStatusMsg, setSummonerStatusMsg] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getMyInfo();
                const data = res.data;
                setUserData(data);
                setOauthEmail(data.email || '');
                setUsername(data.username || '');

                if (data.riotAccount?.accountName && data.riotAccount?.accountTag) {
                    setSummonerName(`${data.riotAccount.accountName}#${data.riotAccount.accountTag}`);
                    setSummonerVerifiedLocal(true);
                }

                if (data.certifiedUnivInfo?.univCertifiedEmail) {
                    setUnivName(data.certifiedUnivInfo.univName);
                    setUnivEmail(data.certifiedUnivInfo.univCertifiedEmail);
                    setIsUnivLocked(true);
                    setIsUnivValid(true);
                }
            } catch (err) {
                console.error(err);
            }
        };
        init();
    }, []);

    const handleUniversityCheck = async () => {
        if (isUnivLocked) {
            setIsUnivLocked(false);
            setIsUnivValid(false);
            setUnivName('');
            setUnivEmail('');
            setUnivStatusMsg('');
            setEmailSent(false);
            setShowVerificationInput(false);
            return;
        }

        try {
            const res = await checkUniv({ univName });
            if (!res.success) {
                setUnivStatusMsg('존재하지 않는 대학교입니다.');
                setIsUnivValid(false);
                return;
            }

            setUnivStatusMsg('존재하는 대학교입니다.');
            setIsUnivLocked(true);
            setIsUnivValid(true);
        } catch (err) {
            setUnivStatusMsg('대학교 확인 중 오류가 발생했습니다.');
        }
    };

    const handleEmailRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(univEmail)) {
            setEmailError('올바르지 않은 이메일입니다.');
            return;
        }

        try {
            await requestUnivVerification({
                univName,
                univEmail,
            });
            setEmailSent(true);
            setShowVerificationInput(true);
        } catch (err) {
            setEmailError('학교명 또는 이메일이 올바르지 않습니다.');
        }
    };

    const handleVerificationConfirm = async () => {
        try {
            await verifyUnivCode(verificationCode, {
                univName,
                univEmail,
            });

            await updateUnivAccount({
                univName,
                univEmail,
            });

            setUserData({
                ...userData,
                certifiedUnivInfo: {
                    univName,
                    univCertifiedEmail: univEmail,
                },
            });

            setEmailVerified(true);
            setShowVerificationInput(false);
            setEmailSent(false);
            alert('학교 계정 인증 완료!');
        } catch (err) {
            const msg = err.response?.data?.message || '인증 실패';
            setVerificationError(msg);
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
                setSummonerVerifiedLocal(true);
                setSummonerVerified(true);
            } else {
                setSummonerStatusMsg('소환사 정보를 찾을 수 없습니다.');
            }
        } catch (err) {
            setSummonerStatusMsg(err.response?.data?.message || '인증 중 오류 발생');
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: 5,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 460,
                mx: 'auto',
                gap: 3,
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                회원가입
            </Typography>

            {/* 이메일 */}
            <TextField
                label="이메일"
                value={oauthEmail}
                disabled
                fullWidth
                sx={{ backgroundColor: theme.palette.background.inputDisabled }}
            />

            {/* 닉네임 */}
            <TextField
                label="닉네임"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
            />

            {/* 소환사 이름 */}
            <Box>
                <TextField
                    label="소환사 이름 (짱아깨비#KR1)"
                    fullWidth
                    value={summonerName}
                    disabled={summonerVerified}
                    onChange={(e) => setSummonerName(e.target.value)}
                />
                <Button onClick={handleSummonerVerify}>
                    {summonerVerified ? '해제' : '확인'}
                </Button>
                {summonerStatusMsg && (
                    <Typography variant="caption">{summonerStatusMsg}</Typography>
                )}
            </Box>

            {/* 대학교 */}
            <Box>
                <TextField
                    label="대학교명"
                    value={univName}
                    disabled={isUnivLocked}
                    onChange={(e) => setUnivName(e.target.value)}
                    fullWidth
                />
                <Button onClick={handleUniversityCheck}>
                    {isUnivLocked ? '해제' : '확인'}
                </Button>
                {univStatusMsg && (
                    <Typography variant="caption">{univStatusMsg}</Typography>
                )}
            </Box>

            {/* 학교 이메일 */}
            <Box>
                <TextField
                    label="학교 이메일"
                    value={univEmail}
                    disabled={!isUnivValid}
                    onChange={(e) => setUnivEmail(e.target.value)}
                    fullWidth
                    error={Boolean(emailError)}
                    helperText={emailError}
                />
                <Button onClick={handleEmailRegister} disabled={!isUnivValid}>
                    등록
                </Button>
                {emailSent && (
                    <Typography variant="caption" color="info.main">
                        인증코드를 전송하였습니다.
                    </Typography>
                )}
            </Box>

            {/* 인증코드 */}
            {showVerificationInput && (
                <Box>
                    <TextField
                        label="인증코드"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        fullWidth
                        error={Boolean(verificationError)}
                        helperText={verificationError}
                    />
                    <Button onClick={handleVerificationConfirm}>확인</Button>
                </Box>
            )}
        </Box>
    );
}
