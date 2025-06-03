// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#12121A', // 본문과 동일한 배경색
                color: '#fff',
                mt: 'auto',
                py: { xs: 2, md: 3 },
            }}
        >
            {/* 구분선 */}
            <Container maxWidth="lg">
                <Divider sx={{ borderColor: '#3c3d4e', mb: { xs: 2, md: 3 } }} />
            </Container>

            <Container maxWidth="lg">
                {/* 첫 번째 줄: 문의사항과 GitHub */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#B7B7C9',
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textAlign: 'center',
                        lineHeight: 1.5
                    }}
                >
                    문의사항:
                    <Link
                        href="mailto:mentenseoul@gmail.com"
                        sx={{ color: '#B7B7C9', textDecoration: 'none', '&:hover': { color: '#fff' }, ml: 0.5 }}
                    >
                        mentenseoul@gmail.com
                    </Link>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <Link
                        href="https://github.com/Timo-GG"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: '#B7B7C9', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                    >
                        GitHub
                    </Link>
                </Typography>

                {/* 두 번째 줄: 저작권 */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#B7B7C9',
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textAlign: 'center',
                        lineHeight: 1.5
                    }}
                >
                    © 2025 TIMO.GG. All rights reserved.
                </Typography>

                {/* 세 번째 줄: 면책조항 */}
                <Typography
                    variant="caption"
                    sx={{
                        color: '#888',
                        display: 'block',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.4,
                        textAlign: 'center',
                        px: { xs: 1, sm: 0 }
                    }}
                >
                    TIMO.GG isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
                </Typography>
            </Container>
        </Box>
    );
}
