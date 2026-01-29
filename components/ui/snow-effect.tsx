'use client';

import Snowfall from 'react-snowfall';

export function SnowEffect() {
    return (
        <Snowfall
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 10
            }}
            snowflakeCount={100}
            radius={[0.5, 2.0]}
            speed={[0.5, 1.5]}
            opacity={[0.4, 0.8]}
        />
    );
}
