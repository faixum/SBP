import React from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

const TerminalLayout = () => {
    const terminalLength = 500;
    const terminalWidth = 200;
    const berthDepth = 50;
    const waterDepth = 30;

    return (
        <group>
            {/* Land Area (Quay) */}
            <Box args={[terminalLength, 1, terminalWidth - berthDepth]} position={[0, 0, -(berthDepth / 2)]} receiveShadow>
                <meshStandardMaterial color="#6B7280" /> {/* Dark Grey */}
            </Box>

            {/* Berth Area */}
             <Box args={[terminalLength, 1, berthDepth]} position={[0, 0, terminalWidth / 2 - berthDepth / 2]} receiveShadow>
                <meshStandardMaterial color="#9CA3AF" /> {/* Light Grey */}
            </Box>

            {/* Water */}
            <Box args={[terminalLength, waterDepth, 300]} position={[0, -waterDepth / 2 - 0.5, terminalWidth / 2 + berthDepth + 50]} receiveShadow>
                <meshStandardMaterial color="#3B82F6" transparent opacity={0.8} /> {/* Blue */}
            </Box>

             {/* Small detail boxes along the quay */}
            {[...Array(10)].map((_, i) => (
                <Box key={i} args={[5, 2, 5]} position={[-terminalLength / 2 + 25 + (i * 50), 0.5, -(berthDepth / 2) + (terminalWidth - berthDepth) / 2 - 10]}>
                     <meshStandardMaterial color="#D1D5DB" />
                </Box>
            ))}
        </group>
    );
};

export default TerminalLayout;