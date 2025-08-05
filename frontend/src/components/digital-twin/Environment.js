import React from 'react';
import { useThree } from '@react-three/fiber';
import { Sky, Environment as DreiEnvironment } from '@react-three/drei';

const Environment = () => {
    const { scene } = useThree();

    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[200, 200, 100]} angle={0.15} penumbra={1} castShadow intensity={0.8} />
            <directionalLight position={[100, 300, 100]} intensity={0.8} castShadow />
            
            {/* Sky and Environment map for reflections */}
            <Sky sunPosition={[100, 20, 100]} />
            <DreiEnvironment preset="sunset" background={false} />
        </>
    );
};

export default Environment;