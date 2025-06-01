import React from 'react';
import { Box, Avatar } from '@mui/material';

const POSITION_LIST = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];

const getPositionImage = (position) => `/assets/position/${position}.png`;

export default function PositionFilterBar({
    positionFilter,
    onPositionClick,
    selectedColor = '#424254',
    unselectedColor = '#2c2c3a',
    iconSize = 26,
    iconInvert = true
}) {
    return (
        <Box sx={{ display: 'flex', height: 48 }}>
            {POSITION_LIST.map((pos, index) => {
                const isSelected = positionFilter === pos;
                return (
                    <Box
                        key={pos}
                        onClick={() => onPositionClick(pos)}
                        sx={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? selectedColor : unselectedColor,
                            border: '1px solid #424254',
                            borderLeft: index > 0 ? '1px solid #424254' : 'none',
                            ...(index === 0 && {
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10
                            }),
                            ...(index === POSITION_LIST.length - 1 && {
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10
                            }),
                            transition: 'background-color 0.2s',
                        }}
                    >
                        <Avatar
                            src={getPositionImage(pos)}
                            variant="square"
                            sx={{
                                width: iconSize,
                                height: iconSize,
                                backgroundColor: 'transparent',
                                filter: isSelected && iconInvert ? 'brightness(0) invert(1)' : 'none'
                            }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}
