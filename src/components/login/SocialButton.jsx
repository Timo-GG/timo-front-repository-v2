/** 소셜 로그인 버튼 */

import React from 'react';
import { Button, Box, useTheme } from '@mui/material';
import KakaoLogo from '../assets/social/kakao-logo.svg?react';
import NaverLogo from '../assets/social/naver-logo.svg?react';
import DiscordLogo from '../assets/social/discord-logo.svg?react';

export default function SocialButton({ provider, onClick }) {
  const theme = useTheme();

  // 각 소셜 로고 이미지 반환
  const getLogo = () => {
    switch (provider) {
      case 'naver':
        return (
          <Box
            component="img"
            src={NaverLogo}
            alt="naver"
            sx={{ width: 48, height: 48 }}
          />
        );
      case 'kakao':
        return (
          <Box
            component="img"
            src={KakaoLogo}
            alt="kakao"
            sx={{ width: 48, height: 48 }}
          />
        );
      case 'discord':
        return (
          <Box
            component="img"
            src={DiscordLogo}
            alt="discord"
            sx={{ width: 48, height: 48 }}
          />
        );
      default:
        return null;
    }
  };

  // 만약 브랜드 컬러를 그대로 쓰고 싶다면 아래 함수를 사용하세요.
  // const getBgColor = () => {
  //   switch (provider) {
  //     case 'naver':
  //       return '#03C75A';
  //     case 'kakao':
  //       return '#FEE500';
  //     case 'discord':
  //       return '#5865F2';
  //     default:
  //       return theme.palette.background.paper;
  //   }
  // };

  // 여기서는 모달 배경과 어울리도록 통일된 색상 사용
  const bgColor = theme.palette.background.paper;

  return (
    <Button
      variant="contained"
      disableElevation
      onClick={onClick}
      sx={{
        minWidth: 0,
        width: 52,
        height: 52,
        borderRadius: '50%',
        p: 0,
        backgroundColor: bgColor,
        transition: 'opacity 0.3s',
        '&:hover': {
          opacity: 0.8,
          backgroundColor: bgColor,
        },
      }}
    >
      {getLogo()}
    </Button>
  );
}
