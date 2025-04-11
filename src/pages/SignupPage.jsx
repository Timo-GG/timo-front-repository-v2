import React, { useState } from 'react';
import { useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMyInfo } from '../apis/authAPI'; // API 호출 함수
import { requestUnivVerification, verifyUnivCode, checkUniv } from '../apis/univAPI';
import useAuthStore from '../storage/useAuthStore';
import { verifyAccount } from '../apis/accountAPI';



export default function SignupPage() {
    const { setUserData } = useAuthStore(); // ✅ Zustand에서 setUserData 가져옴

    const theme = useTheme();
    const navigate = useNavigate();

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
    const [nicknameStatus, setNicknameStatus] = useState(""); // 예: 사용 가능 여부
    const [universityStatus, setUniversityStatus] = useState("");
    const [isUniversityValid, setIsUniversityValid] = useState(false);
    const [isUniversityLocked, setIsUniversityLocked] = useState(false); // 대학교 확인 후 lock
    const [isSummonerVerified, setIsSummonerVerified] = useState(false);
    const [summonerStatusMsg, setSummonerStatusMsg] = useState('');

    const handleEmailRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(schoolEmail)) {
            setEmailError("올바르지 않은 이메일 입니다.");
            return;
        }

        try {
            await requestUnivVerification({
                univName: university,
                univEmail: schoolEmail,
            });
            setEmailError('');
            setEmailSent(true);
            setShowVerificationInput(true);
        } catch (err) {
            setEmailError('학교명 또는 이메일이 올바르지 않습니다.');
            console.error('이메일 인증 요청 실패:', err);
        }
    };

    const handleVerificationConfirm = async () => {
        try {
            await verifyUnivCode(verificationCode, {
                univName: university,
                univEmail: schoolEmail,
            });
            navigate('/profile-setup', {
                state: {
                    nickname,
                    summonerName,
                    university,
                    schoolEmail,
                    oauthEmail
                }
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
            } else {
                setSummonerStatusMsg('소환사 정보를 찾을 수 없습니다.');
            }
        } catch (e) {
            setSummonerStatusMsg('검증 중 오류가 발생했습니다.');
        }
    };


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getMyInfo();
                const profile = res.data.memberProfile;
                setNickname(profile.nickname);     // 로컬 상태
                setOauthEmail(profile.email);      // 로컬 상태
                setUserData(res.data);             // ✅ Zustand에 userData 저장
            } catch (err) {
                console.error('유저 정보 불러오기 실패:', err);
            }
        };

        fetchUserInfo();
    }, []);

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
            <Typography variant="h5" fontWeight="bold">
                회원가입
            </Typography>

            {/* 이메일 */}
            <Box>
                <Typography color="text.secondary" mb={1}>이메일</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
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
                                height: '100%',
                                borderRadius: '12px',
                                backgroundColor: theme.palette.background.inputDisabled,
                                '& fieldset': { borderColor: 'transparent' },
                                '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                            }
                        }}
                    />
                </Box>
            </Box>

            {/* 닉네임 */}
            <Box>
                <Typography color="text.secondary" mb={1}>닉네임</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        autoComplete='off'
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setNicknameStatus(""); // 상태 초기화
                        }}
                        variant="outlined"
                        placeholder="닉네임 입력"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '100%',
                                borderRadius: '12px 0 0 12px',
                                backgroundColor: theme.palette.background.input,
                                border: `1px solid ${theme.palette.border.main}`,
                                '& fieldset': { borderColor: 'transparent' },
                                '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                            }
                        }}
                    />
                    <Button
                        onClick={() => {
                            // 실제 닉네임 중복 체크 API 호출 예정
                            if (nickname === "짱아깨비") {
                                setNicknameStatus("이미 존재하는 닉네임입니다.");
                            } else {
                                setNicknameStatus("사용 가능한 닉네임입니다.");
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
                            minWidth: '80px'
                        }}
                    >
                        확인
                    </Button>
                </Box>

                {nicknameStatus && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 1,
                            color: nicknameStatus.includes("이미") ? theme.palette.error.main : theme.palette.info.main,
                        }}
                    >
                        {nicknameStatus}
                    </Typography>
                )}
            </Box>


            {/* 소환사 이름 */}
            <Box>
                <Typography color="text.secondary" mb={1}>소환사 이름</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        autoComplete='off'
                        value={summonerName}
                        onChange={(e) => {
                            setSummonerName(e.target.value);
                            setIsSummonerVerified(false); // 수정 시 재검증 유도
                            setSummonerStatusMsg('');
                        }}
                        disabled={isSummonerVerified}
                        variant="outlined"
                        placeholder="짱아깨비#KR1"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '100%',
                                borderRadius: '12px 0 0 12px',
                                backgroundColor: theme.palette.background.input,
                                border: `1px solid ${theme.palette.border.main}`,
                                '& fieldset': { borderColor: 'transparent' },
                                '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                            }
                        }}
                    />
                    <Button
                        onClick={() => {
                            if (isSummonerVerified) {
                                setIsSummonerVerified(false);
                                setSummonerName('');
                                setSummonerStatusMsg('');
                                return;
                            }
                            handleSummonerVerify();
                        }}
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
                <Typography color="text.secondary" mb={1}>대학교</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        autoComplete='off'
                        value={university}
                        onChange={(e) => {
                            setUniversity(e.target.value);
                            setUniversityStatus("");
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
                                '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                            }
                        }}
                    />
                    <Button
                        onClick={async () => {
                            if (isUniversityLocked) {
                                // ✅ 해제 로직
                                setIsUniversityLocked(false);
                                setUniversity("");
                                setUniversityStatus("");
                                setIsUniversityValid(false);
                                setSchoolEmail("");
                                setEmailError('');
                                setEmailSent(false);
                                setShowVerificationInput(false);
                                return;
                            }

                            try {
                                const res = await checkUniv({ univName: university });
                                if (res.success) {
                                    setUniversityStatus("존재하는 대학교입니다.");
                                    setIsUniversityValid(true);
                                    setIsUniversityLocked(true); // ✅ 입력 잠금
                                } else {
                                    setUniversityStatus("존재하지 않는 대학교입니다.");
                                    setIsUniversityValid(false);
                                }
                            } catch (error) {
                                console.error("대학교 확인 실패:", error);
                                setUniversityStatus("대학교 확인 중 오류가 발생했습니다.");
                                setIsUniversityValid(false);
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
                            minWidth: '80px'
                        }}
                    >
                        {isUniversityLocked ? "해제" : "확인"}
                    </Button>
                </Box>

                {universityStatus && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 1,
                            color: universityStatus.includes("존재하지") ? theme.palette.error.main : theme.palette.info.main,
                        }}
                    >
                        {universityStatus}
                    </Typography>
                )}
            </Box>


            {/* 학교 이메일 */}
            <Box>
                <Typography color="text.secondary" mb={1}>학교 이메일</Typography>
                <Box sx={{ display: 'flex', height: '56px' }}>
                    <TextField
                        fullWidth
                        autoComplete='off'
                        value={schoolEmail}
                        onChange={(e) => {
                            setSchoolEmail(e.target.value); // ✅ 수정
                            setEmailError('');
                            setEmailSent(false);
                        }}
                        disabled={!isUniversityValid} // ✅ 대학교 미인증 시 비활성화
                        variant="outlined"
                        placeholder="학교 이메일 입력"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '100%',
                                borderRadius: '12px 0 0 12px',
                                backgroundColor: theme.palette.background.input,
                                border: `1px solid ${theme.palette.border.main}`,
                                '& fieldset': { borderColor: 'transparent' },
                                '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                            }
                        }}
                    />
                    <Button
                        onClick={handleEmailRegister}
                        disabled={!isUniversityValid} // ✅ 대학교 미인증 시 등록 버튼도 비활성화
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
                </Box>

                {/* 상태 메시지: 에러 또는 성공 메시지 하나만 보여주고 높이 고정 */}
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




            {/* 인증코드 */}
            {showVerificationInput && (
                <Box>
                    <Typography color="text.secondary" mb={1}>인증 코드</Typography>
                    <Box sx={{ display: 'flex', height: '56px' }}>
                        <TextField
                            fullWidth
                            autoComplete='off'
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value);
                                setVerificationError('');
                            }}
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
                                    '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
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
                            다음
                        </Button>
                    </Box>
                </Box>
            )}
            <Button
                fullWidth
                sx={{
                    bgcolor: '#2A2B31',
                    color: '#fff',
                    fontWeight: 'bold',
                    height: 44,
                    fontSize: '1rem'
                }}
                onClick={() => navigate('/profile-setup', {
                    state: {
                        nickname,
                        summonerName,
                        university,
                        schoolEmail: '',
                        oauthEmail,
                    }
                })}
            >
                다음
            </Button>
        </Box>
    );
}
