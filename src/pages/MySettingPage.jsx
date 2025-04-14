import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
} from '@mui/material';

export default function MySettingPage() {
  const theme = useTheme();

  const [school, setSchool] = useState("서울과기대");
  const [schoolEmail, setSchoolEmail] = useState("menten4859@seoultech.ac.kr");
  const [isSchoolEmailDisabled, setIsSchoolEmailDisabled] = useState(true);
  const [showVerificationBtn, setShowVerificationBtn] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // 추가된 상태
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const isSchoolRegistered = school !== "" && schoolEmail !== "";

  // 단순히 이메일 입력값 업데이트 + 에러, 성공 메시지 초기화
  const handleSchoolEmailChange = (e) => {
    setSchoolEmail(e.target.value);
    setEmailError("");
    setEmailSent(false);
  };

  // 등록 버튼 클릭 시 이메일 유효성 검사 후 처리
  const handleEmailRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolEmail)) {
      setEmailError("올바르지 않은 이메일 입니다.");
      return;
    }
    // 이메일이 올바르다면
    setEmailError("");
    setEmailSent(true);
    setShowVerificationInput(true);
  };

  // 인증 코드 확인 버튼 클릭 시 유효성 검사
  const handleVerificationConfirm = () => {
    // 예시로 올바른 인증 코드를 "123456"으로 가정합니다.
    if (verificationCode !== "123456") {
      setVerificationError("일치하지 않은 인증코드입니다.");
      return;
    }
    // 인증 성공 시 기존 상태 복구
    setSchool("서울과기대");
    setSchoolEmail("menten4859@seoultech.ac.kr");
    setVerificationCode("");
    setVerificationError("");
    setShowVerificationInput(false);
    setShowVerificationBtn(false);
    setIsSchoolEmailDisabled(true);
    setEmailSent(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        pt: 10,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 460, p: 4, backgroundColor: theme.palette.background.paper, borderRadius: 3 }}>
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
                value="abc@gmail.com"
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
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>닉네임</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
              <TextField
                fullWidth
                value="짱아깨비"
                variant="outlined"
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
                수정
              </Button>
            </Box>
          </Box>

          {/* 소환사 이름 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>소환사 이름</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
              <TextField
                fullWidth
                disabled
                value="짱아깨비#kr"
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: theme.palette.text.disabled,
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    border: `1px solid ${theme.palette.border.main}`,
                    borderRadius: '12px 0 0 12px',
                    backgroundColor: theme.palette.background.input,
                    '& fieldset': { borderColor: 'transparent' },
                    '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                  }
                }}
              />
              <Button
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
                해제
              </Button>
            </Box>
          </Box>

          {/* 학교 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>학교</Typography>
            <Box sx={{ display: 'flex', height: '56px' }}>
              <TextField
                fullWidth
                disabled
                value={school}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: theme.palette.text.disabled,
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    border: `1px solid ${theme.palette.border.main}`,
                    borderRadius: isSchoolRegistered ? '12px 0 0 12px' : '12px',
                    backgroundColor: theme.palette.background.input,
                    '& fieldset': { borderColor: 'transparent' },
                    '& input': { color: theme.palette.text.primary, padding: '12px 14px' }
                  }
                }}
              />
              {isSchoolRegistered && (
                <Button
                  onClick={() => {
                    // 학교, 이메일 초기화 및 입력 가능하도록 변경
                    setSchool("");
                    setSchoolEmail("");
                    setIsSchoolEmailDisabled(false);
                    setShowVerificationBtn(true);
                    setShowVerificationInput(false);
                    setEmailSent(false);
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
                  해제
                </Button>
              )}
            </Box>
          </Box>

          {/* 학교 이메일 + 등록 버튼 */}
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>학교 이메일</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', height: '56px' }}>
                <TextField
                  fullWidth
                  disabled={isSchoolEmailDisabled}
                  value={schoolEmail}
                  onChange={handleSchoolEmailChange}
                  variant="outlined"
                  error={!isSchoolEmailDisabled && Boolean(emailError)}
                  helperText={!isSchoolEmailDisabled ? emailError : ""}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: theme.palette.text.disabled,
                    },
                    '& .MuiOutlinedInput-root': {
                      height: '100%',
                      border: `1px solid ${theme.palette.border.main}`,
                      borderRadius: showVerificationBtn ? '12px 0 0 12px' : '12px',
                      backgroundColor: isSchoolEmailDisabled
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
              {emailSent && (
                <Typography variant="caption" sx={{ color: theme.palette.info.main, mt: 1 }}>
                  인증코드를 전송하였습니다.
                </Typography>
              )}
            </Box>
          </Box>

          {/* 인증 코드 입력 + 확인 버튼 */}
          {showVerificationInput && (
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
            <Button variant="contained" color="error" sx={{ mt: 1, borderRadius: 2 }}>
              회원 탈퇴
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}