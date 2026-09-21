// Laptop3D.tsx - FINAL version with auto-fit for any GLB size
// Fixes the wireframe/zoomed issue you saw

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Group, Box3, Vector3 } from 'three';

/* ============================================================
   PUT YOUR GLB HERE
   public/computer.glb -> "/computer.glb"
   public/models/computer.glb -> "/models/computer.glb"
   ============================================================ */
const GLB_PATH = "/models/computer.glb";

const useResponsive = () => {
  const [config, setConfig] = useState({
    cameraZ: 9.8,
    cameraY: 0.8,
    fov: 45,
    sensitivity: 0.01,
    dpr: [1, 2] as [number, number],
  });

  useEffect(() => {
    const updateConfig = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setConfig({ cameraZ: 4.5, cameraY: 0.5, fov: 55, sensitivity: 0.015, dpr: [1, 1.5] });
      } else if (w < 1024) {
        setConfig({ cameraZ: 4, cameraY: 0.6, fov: 50, sensitivity: 0.012, dpr: [1, 2] });
      } else {
        setConfig({ cameraZ: 3.5, cameraY: 0.8, fov: 45, sensitivity: 0.01, dpr: [1, 2] });
      }
    };
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);
  return config;
};

interface ModelProps {
  autoRotate?: boolean;
  userRotation?: { x: number; y: number };
}

const GLBModel = ({ autoRotate = true, userRotation = { x: 0, y: 0 } }: ModelProps) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(GLB_PATH);
  const autoRotateAngle = useRef(0);

  // Debug: log actual size of your GLB in console
  useEffect(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    console.log("YOUR GLB SIZE:", size); // check console to see how big it is
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (autoRotate) {
      autoRotateAngle.current += delta * 0.3;
      groupRef.current.rotation.y = autoRotateAngle.current; // full 360 spin like your old CSS
    } else {
      groupRef.current.rotation.x += (userRotation.x - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (userRotation.y - groupRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Bounds will auto-scale ANY glb to fit in view - this fixes your glitch */}
     // Line ~45 - make it fill the box
<Bounds fit clip observe margin={0.6}> // was 1.2, now 0.6 = BIGGER
  <Center>
    <primitive object={scene.clone()} scale={1.6} /> // add scale 1.6
  </Center>
</Bounds>
    </group>
  );
};

export const Laptop3D = () => {
  const { cameraZ, cameraY, fov, sensitivity, dpr } = useResponsive();
  const [userRotation, setUserRotation] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsInteracting(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteracting) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setUserRotation((prev) => ({
      x: Math.max(-0.5, Math.min(0.5, prev.x + dy * sensitivity)),
      y: prev.y + dx * sensitivity,
    }));
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsInteracting(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsInteracting(true);
        setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isInteracting || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startPos.x;
      const dy = e.touches[0].clientY - startPos.y;
      setUserRotation((prev) => ({
        x: Math.max(-0.5, Math.min(0.5, prev.x + dy * sensitivity)),
        y: prev.y + dx * sensitivity,
      }));
      setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };
    const onTouchEnd = () => setIsInteracting(false);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isInteracting, startPos, sensitivity]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Canvas
        camera={{ position: [0, cameraY, cameraZ], fov }}
        dpr={dpr}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Softer lights for realistic GLB */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#ffcc00" />

        <Suspense fallback={null}>
          <GLBModel autoRotate={!isInteracting} userRotation={userRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(GLB_PATH);
export default Laptop3D;
