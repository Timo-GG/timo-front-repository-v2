import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Timo from '../assets/character.png';
import SocialButton from './SocialButton';

export default function LoginModal({ open, onClose, onSocialLogin }) {
  const theme = useTheme();

  // 소셜 로그인 버튼 클릭 시 호출되는 핸들러
  const handleSocialClick = (provider) => {
    // 백엔드 연동 전까지는 단순 시뮬레이션: 클릭하면 바로 '짱아깨비'로 로그인 처리
    // 실제로는 provider에 따라 다른 API 호출 로직을 넣을 수 있습니다.
    onSocialLogin({ displayName: '짱아깨비' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          width: { xs: '90%', sm: 400 },
          boxShadow: 24,
          outline: 'none',
          textAlign: 'center',
        }}
      >
        {/* 닫기 버튼 */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.text.primary,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 제목과 서브타이틀 */}
        <Typography variant="h5" fontWeight="bold" mb={1}>
          TIMOGG에 어서오세요
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          가입하고 유저들과 의견을 나누어보세요!
        </Typography>

        {/* 캐릭터 이미지: 가운데 정렬 및 비율 유지 */}
        <Box
          component="img"
          src={Timo}
          alt="timo"
          sx={{
            display: 'block',
            mx: 'auto',
            maxWidth: '60%',
            height: 'auto',
            mb: 3,
          }}
        />

        {/* 구분선과 텍스트 */}
        <Divider sx={{ mb: 2, borderColor: 'grey.800' }}>
          <Typography variant="caption" color="text.secondary">
            소셜 계정으로 로그인
          </Typography>
        </Divider>

        {/* 소셜 로그인 버튼들 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <SocialButton
            provider="naver"
            onClick={() => handleSocialClick('naver')}
          />
          <SocialButton
            provider="kakao"
            onClick={() => handleSocialClick('kakao')}
          />
          <SocialButton
            provider="discord"
            onClick={() => handleSocialClick('discord')}
          />
        </Box>
      </Box>
    </Modal>
  );
}
