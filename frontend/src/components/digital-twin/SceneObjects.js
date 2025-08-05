import React from 'react';
import { Box, Sphere } from '@react-three/drei';

const SceneObjects = () => {
    return (
        <>
            {/* Example objects */}
            <Box position={[0, 2, 0]} args={[4, 4, 4]}>
                <meshStandardMaterial color="orange" />
            </Box>
            <Sphere position={[10, 5, 0]} args={[3, 32, 32]}>
                <meshStandardMaterial color="hotpink" />
            </Sphere>
        </>
    );
};

export default SceneObjects;