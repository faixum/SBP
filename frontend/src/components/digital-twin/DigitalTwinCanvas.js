import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Button } from '../ui/Button'; // Assuming you have a Button component

const DigitalTwinCanvas = ({ modelPath }) => {
    const canvasRef = useRef(null);
    const scene = useRef(new THREE.Scene());
    const camera = useRef(null);
    const renderer = useRef(null);
    const controls = useRef(null);
    const model = useRef(null);

    useEffect(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;

        // Renderer
        renderer.current = new THREE.WebGLRenderer({ canvas: currentCanvas, antialias: true });
        renderer.current.setSize(currentCanvas.clientWidth, currentCanvas.clientHeight);
        renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.shadowMap.enabled = true; // Enable shadows

        // Camera
        camera.current = new THREE.PerspectiveCamera(75, currentCanvas.clientWidth / currentCanvas.clientHeight, 0.1, 1000);
        camera.current.position.set(5, 5, 5);

        // Controls
        controls.current = new OrbitControls(camera.current, renderer.current.domElement);
        controls.current.enableDamping = true; // Smooth camera movement

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.current.add(directionalLight);

        // Load 3D Model
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            model.current = gltf.scene;
            model.current.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            scene.current.add(model.current);

            // Optional: Fit camera to model after loading
            const box = new THREE.Box3().setFromObject(model.current);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.current.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5; // Add some buffer
            camera.current.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
            controls.current.target = center;
            controls.current.update();


        }, undefined, (error) => {
            console.error('An error occurred loading the model:', error);
        });

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.current.update();
            renderer.current.render(scene.current, camera.current);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (currentCanvas) {
                camera.current.aspect = currentCanvas.clientWidth / currentCanvas.clientHeight;
                camera.current.updateProjectionMatrix();
                renderer.current.setSize(currentCanvas.clientWidth, currentCanvas.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderer.current) {
                renderer.current.dispose();
            }
            if (controls.current) {
                controls.current.dispose();
            }
            if (model.current) {
                 scene.current.remove(model.current);
            }
             // Clean up lights and geometry if necessary
             scene.current.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });

        };
    }, [modelPath]);

    // Example button actions (can be implemented to interact with the model)
    const highlightComponent = () => {
        console.log('Highlighting a component...');
        // Logic to interact with the loaded model, e.g., change material color
    };

    const showTelemetry = () => {
        console.log('Showing telemetry data...');
        // Logic to display overlays or change model based on data
    };


    return (
        <div className="w-full h-full relative">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
            {/* Example controls overlay */}
            <div className="absolute top-4 left-4 space-x-2 z-10">
                <Button size="sm" onClick={highlightComponent}>Highlight Component</Button>
                <Button size="sm" variant="outline" onClick={showTelemetry}>Show Telemetry</Button>
            </div>
        </div>
    );
};

export default DigitalTwinCanvas;