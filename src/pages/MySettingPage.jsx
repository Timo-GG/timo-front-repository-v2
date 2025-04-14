import React, { useState, useEffect } from 'react';
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
import { updateUsername, verifyAccount, resetRiotAccount } from '../apis/accountAPI';
import { checkUniv } from '../apis/univAPI';
import {
  requestUnivVerification,
  verifyUnivCode,
  updateUnivAccount,
} from '../apis/univAPI';
export default function MySettingPage() {
  const theme = useTheme();
  const { userData, setUserData } = useAuthStore();
  const [username, setUsername] = useState("");
  const [riotAccountInput, setRiotAccountInput] = useState("");
  const [univName, setUnivName] = useState(""); // 기본값
  const [univEmail, setUnivEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [isUnivEmailDisabled, setIsUnivEmailDisabled] = useState(true);
  const [showVerificationBtn, setShowVerificationBtn] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // 메시지/에러
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isSummonerVerified, setIsSummonerVerified] = useState(false);
  const [summonerStatusMsg, setSummonerStatusMsg] = useState("");
  const [isUnivEmailVerified, setIsUnivEmailVerified] = useState(false);
  const [univStatusMsg, setUnivStatusMsg] = useState("");
  const [isUnivLocked, setIsUnivLocked] = useState(false);
  const [isUnivValid, setIsUnivValid] = useState(false);

  const handleSummonerVerifyOrReset = async () => {
    if (userData.riotAccount) {
      try {
        const res = await resetRiotAccount(); // POST /riot/reset
        setUserData((prev) => ({
          ...prev,
          riotAccount: null,
        }));
        setRiotAccountInput('');
        setIsSummonerVerified(false);
        setSummonerStatusMsg('소환사 계정이 초기화되었습니다.');
      } catch (e) {
        setSummonerStatusMsg('해제 중 오류가 발생했습니다.');
      }
      return;
    }

    const [accountName, accountTag] = riotAccountInput.split('#');
    if (!accountName || !accountTag) {
      setSummonerStatusMsg("형식이 올바르지 않습니다. 예: 짱아깨비#KR1");
      return;
    }

    try {
      const res = await verifyAccount({ accountName, tagLine: accountTag });
      if (res.success) {
        setUserData({
          ...userData,
          riotAccount: {
            accountName,
            accountTag,
            puuid: res.data.puuid,
          },
        });
        setIsSummonerVerified(true);
        setSummonerStatusMsg('✔️ 소환사 이름 인증 완료');
      } else {
        setSummonerStatusMsg('소환사 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "소환사 인증 중 오류가 발생했습니다.";
      setSummonerStatusMsg(msg);
    }
  };
  const handleWithdraw = () => {
    setIsWithdrawDialogOpen(false);
    // 실제 탈퇴 API 연동 필요
    alert("탈퇴가 완료되었습니다.");
  };

  const handleUnivReset = async () => {
    try {
      await updateUnivAccount({
        univName: null,
        univEmail: null,
      });

      setUserData((prev) => ({
        ...prev,
        certifiedUnivInfo: null,
      }));

      setUnivName("");
      setUnivEmail("");
      setDepartment("");
      setIsUnivEmailDisabled(false);
      setShowVerificationBtn(true);
      setShowVerificationInput(false);
      setEmailError("");
      setEmailSent(false);
      setVerificationError("");
      setIsUnivEmailVerified(false); // 학교 인증 여부도 초기화
    } catch (err) {
      console.error("학교 정보 초기화 실패:", err);
      alert("학교 정보 초기화 중 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");

      if (userData.riotAccount) {
        const { accountName, accountTag } = userData.riotAccount;
        setRiotAccountInput(`${accountName}#${accountTag}`);
      }


      if (userData.certifiedUnivInfo) {
        setUnivName(userData.certifiedUnivInfo.univName || ""); // 이제 포함됨
        setUnivEmail(userData.certifiedUnivInfo.univCertifiedEmail || "");
        setDepartment(userData.certifiedUnivInfo.department || "");
        setIsUnivEmailDisabled(true);
        setShowVerificationBtn(false);
      } else {
        setUnivName(""); // 기본값
        setUnivEmail("");
        setDepartment("");
        setIsUnivEmailDisabled(false);
        setShowVerificationBtn(true);
      }

    }
  }, [userData]);



  // 단순히 이메일 입력값 업데이트 + 에러, 성공 메시지 초기화
  const handleSchoolEmailChange = (e) => {
    setUnivEmail(e.target.value);
    setEmailError("");
    setEmailSent(false);
  };


  // 등록 버튼 클릭 시 이메일 유효성 검사 후 처리
  const handleEmailRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(univEmail)) {
      setEmailError("올바르지 않은 이메일 입니다.");
      return;
    }

    try {
      await requestUnivVerification({
        univName,
        univEmail,
      });
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
        univName,
        univEmail,
      });

      const res = await updateUnivAccount({
        univName,
        univEmail,
      });

      setUserData({
        ...userData,
        certifiedUnivInfo: {
          univName,
          univCertifiedEmail: univEmail,
          department: res.data.department, // 혹은 입력받은 department
        },
      });
      setShowVerificationInput(false); // <- 이거도 같이
      setEmailSent(false); // <- 이거도 같이
      alert("학교 계정 인증 완료");
    } catch (err) {
      const msg = err.response?.data?.message || '인증 실패';
      setVerificationError(msg);
    }
  };

  const handleUniversityCheck = async () => {
    if (isUnivEmailDisabled) return;

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
      setShowVerificationBtn(true); // 등록 버튼 활성화
    } catch (err) {
      setUnivStatusMsg('대학교 확인 중 오류가 발생했습니다.');
      setIsUnivValid(false);
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
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 460, p: 4, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="text.primary">
          내 계정
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 이메일 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>이메일</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography color="text.secondary" >닉네임</Typography>
            <Box sx={{ display: 'flex' }}>
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
                    setUsernameMessage("닉네임이 성공적으로 변경되었습니다!");
                    setUsernameError("");
                    setUserData({ ...userData, username });
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
            <Typography color="text.secondary" sx={{ mb: 1 }}>소환사 이름</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
              <TextField
                fullWidth
                placeholder="ex) 짱아깨비#KR"
                value={riotAccountInput}
                disabled={Boolean(userData.riotAccount)}
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
                onClick={handleSummonerVerifyOrReset}
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
                {userData.riotAccount ? '해제' : '등록'}
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

          {/* 학교 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>학교</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
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
                    '& fieldset': { borderColor: 'transparent' },
                    '& input': {
                      color: theme.palette.text.primary,
                      padding: '12px 14px',
                    },
                  },
                }}
              />
              <Button
                onClick={isUnivEmailDisabled ? handleUnivReset : handleUniversityCheck}
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
              <Typography variant="caption" sx={{ mt: 1, color: univStatusMsg.includes("존재") ? theme.palette.info.main : theme.palette.error.main }}>
                {univStatusMsg}
              </Typography>
            )}
          </Box>


          {/* 학교 이메일 + 등록 버튼 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>학교 이메일</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', height: '56px' }}>
                <TextField
                  fullWidth
                  disabled={isUnivEmailDisabled}
                  value={univEmail}
                  onChange={handleSchoolEmailChange}
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
                <Typography variant="caption" sx={{ color: theme.palette.info.main, mt: 1 }}>
                  인증코드를 전송하였습니다.
                </Typography>
              )}
            </Box>
          </Box>

          {/* 인증 코드 입력 + 확인 버튼 */}
          {showVerificationInput && !isUnivEmailVerified && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography color="text.secondary" sx={{ mb: 1 }}>인증 코드</Typography>
              <Box sx={{ display: 'flex', height: '56px' }}>
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
                  확인
                </Button>
              </Box>
            </Box>
          )}

          {/* 계정 삭제 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>계정 삭제</Typography>
            <Button variant="contained" color="error" sx={{ borderRadius: 1, fontSize: '0.rem' }}
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
