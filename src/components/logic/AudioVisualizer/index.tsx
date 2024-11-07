import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AudioVisualizer: React.FC<{ src: string }> = ({ src }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    
    return (
        <div>
            <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
        </div>
    );
};

export default AudioVisualizer;