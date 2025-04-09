/** 마이페이지 Tab */

import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

export default function TabHeader({
    tab,
    onTabChange,
    firstLabel = '보낸 요청',
    secondLabel = '받은 요청',
    thirdLabel = '채팅',
}) {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#2B2C3C',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    p: 1
                }}
            >
                <Tabs
                    value={tab}
                    onChange={onTabChange}
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
                >
                    <Tab
                        label={firstLabel}
                        sx={{
                            fontSize: "1.1rem",
                            color: tab === 0 ? '#ffffff' : '#7F7F91',
                            fontWeight: tab === 0 ? 'bold' : 'normal',
                        }}
                    />
                    <Tab
                        label={secondLabel}
                        sx={{
                            fontSize: "1.1rem",
                            color: tab === 1 ? '#ffffff' : '#7F7F91',
                            fontWeight: tab === 1 ? 'bold' : 'normal',
                        }}
                    />
                    <Tab
                        label={thirdLabel}
                        sx={{
                            fontSize: "1.1rem",
                            color: tab === 2 ? '#ffffff' : '#7F7F91',
                            fontWeight: tab === 2 ? 'bold' : 'normal',
                        }}
                    />
                </Tabs>
            </Box>
            <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%' }} />
        </>
    );
}
