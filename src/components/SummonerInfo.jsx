import React from 'react';
import {Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function SummonerInfo({
                                         name = '',
                                         tag = '',
                                         avatarUrl,
                                         school = '',
                                         copyable = false,
                                     }) {
    const handleCopy = () => {
        const fullTag = `${name}#${tag}`;
        navigator.clipboard.writeText(fullTag)
            .then(() => console.log('복사됨:', fullTag))
            .catch((err) => console.error('복사 실패:', err));
    };

    const encodedName = encodeURIComponent(name);
    const encodedTag = encodeURIComponent(tag.replace(/\s/g, ''));
    const opggUrl = `https://op.gg/ko/lol/summoners/kr/${encodedName}-${encodedTag}`;

    const isMobile = useMediaQuery('(max-width:768px)');
    const displaySchool = isMobile
        ? school.replace('서울과학기술대학교', '서울과기대')
        : school;

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Avatar src={avatarUrl} alt={name} sx={{width: 32, height: 32}}/>
            <Box sx={{lineHeight: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

                {/* ✅ 툴팁 추가된 링크 */}
                <Tooltip
                    title={
                        <Box sx={{px: 0.5, py: 0.5}}>OP.GG에서 자세히 보기</Box>
                    }
                    arrow
                >
                    <a
                        href={opggUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        <Typography
                            fontSize="0.95rem"
                            noWrap
                            sx={{
                                maxWidth: 100,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2,
                                '&:hover': {textDecoration: 'underline', color: '#42E6B5'},
                            }}
                        >
                            {name}
                        </Typography>
                    </a>
                </Tooltip>

                {/* 태그 + 학교 (텍스트만) */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                    <Typography
                        fontSize="0.8rem"
                        color="#B7B7C9"
                        sx={{lineHeight: 1.2, whiteSpace: 'nowrap'}}
                        noWrap
                    >
                        #{tag}{displaySchool ? ` | ${displaySchool}` : ''}

                    </Typography>

                    {copyable && (
                        <Tooltip title="복사" arrow>
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                sx={{p: 0.3, color: '#888', display: 'flex', alignItems: 'center'}}
                            >
                                <ContentCopyIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
