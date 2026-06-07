// Laptop3D.tsx
// Premium minimal laptop 3D component for engineering student portfolio
// Built with react-three-fiber — fully responsive, lightweight, and animated.

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial } from 'three';


/* ============================================================
   1) RESPONSIVE HOOK
   Detects viewport size and returns camera/sensitivity values
   tailored for mobile, tablet, and desktop.
   ============================================================ */
const useResponsive = () => {
  const [config, setConfig] = useState({
    cameraZ: 4.5,
    cameraY: 1.2,
    fov: 45,
    sensitivity: 0.01,
    dpr: [1, 2] as [number, number],
  });

  useEffect(() => {
    const updateConfig = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile — pull camera back, wider FOV, lower DPR cap
        setConfig({
          cameraZ: 5.5,
          cameraY: 1.0,
          fov: 55,
          sensitivity: 0.015,
          dpr: [1, 1.5],
        });
      } else if (w < 1024) {
        // Tablet
        setConfig({
          cameraZ: 5.0,
          cameraY: 1.1,
          fov: 50,
          sensitivity: 0.012,
          dpr: [1, 2],
        });
      } else {
        // Desktop
        setConfig({
          cameraZ: 4.5,
          cameraY: 1.2,
          fov: 45,
          sensitivity: 0.01,
          dpr: [1, 2],
        });
      }
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
};

/* ============================================================
   2) LAPTOP MODEL
   The 3D laptop itself — base, keyboard, trackpad, hinged lid,
   screen UI, and ambient glow. All grouped for clean rotation.
   ============================================================ */
interface LaptopModelProps {
  autoRotate?: boolean;
  userRotation?: { x: number; y: number };
}

const LaptopModel = ({
  autoRotate = true,
  userRotation = { x: 0, y: 0 },
}: LaptopModelProps) => {
  const groupRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Mesh>(null);
  const logoRef = useRef<Mesh>(null);

  // Tracks autorotation phase
  const autoRotateAngle = useRef(0);
  // Tracks lid opening animation progress (0 = closed, 1 = fully open)
  const openProgress = useRef(0);

  // Memoize shared materials to avoid re-creating each frame
  const materials = useMemo(
    () => ({
      chassis: new MeshStandardMaterial({
        color: '#1a1a1f',
        metalness: 0.85,
        roughness: 0.35,
      }),
      chassisLight: new MeshStandardMaterial({
        color: '#2a2a30',
        metalness: 0.9,
        roughness: 0.25,
      }),
      key: new MeshStandardMaterial({
        color: '#16161a',
        metalness: 0.4,
        roughness: 0.6,
      }),
      darkPlastic: new MeshStandardMaterial({
        color: '#0a0a0d',
        metalness: 0.3,
        roughness: 0.8,
      }),
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    // ----- Lid opening intro animation (runs once at mount) -----
    if (openProgress.current < 1) {
      openProgress.current = Math.min(1, openProgress.current + delta * 0.6);
    }
    if (lidRef.current) {
      // Lid goes from closed (-π/2) → open (~ -π/2.2 ≈ 110°)
      const closed = -Math.PI / 2;
      const open = -Math.PI / 2.2;
      // easeOutCubic for natural deceleration
      const t = 1 - Math.pow(1 - openProgress.current, 3);
      lidRef.current.rotation.x = closed + (open - closed) * t;
    }

    // ----- Group rotation: auto vs. user-controlled -----
    if (groupRef.current) {
      if (autoRotate) {
        autoRotateAngle.current += delta * 0.3;
        groupRef.current.rotation.y =
          Math.sin(autoRotateAngle.current) * 0.4;
        groupRef.current.rotation.x =
          Math.cos(autoRotateAngle.current * 0.5) * 0.08 - 0.08;
      } else {
        // Smooth interpolation toward user-driven rotation
        groupRef.current.rotation.x +=
          (userRotation.x - 0.08 - groupRef.current.rotation.x) * 0.1;
        groupRef.current.rotation.y +=
          (userRotation.y - groupRef.current.rotation.y) * 0.1;
      }
    }

    // ----- Subtle screen breathing glow -----
    if (screenRef.current) {
      const t = clock.getElapsedTime();
      const mat = screenRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.75 + Math.sin(t * 1.5) * 0.08;
    }

    // ----- Pulsing brand logo on lid -----
    if (logoRef.current) {
      const t = clock.getElapsedTime();
      const mat = logoRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 1.2) * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ===== BASE CHASSIS ===== */}
      {/* Main aluminum body */}
      <mesh position={[0, -0.08, 0]} castShadow receiveShadow material={materials.chassis}>
        <boxGeometry args={[3.2, 0.12, 2.2]} />
      </mesh>

      {/* Slight bevel highlight on top */}
      <mesh position={[0, -0.01, 0]} material={materials.chassisLight}>
        <boxGeometry args={[3.15, 0.02, 2.15]} />
      </mesh>

      {/* Recessed keyboard well */}
      <mesh position={[0, 0.001, 0.15]} material={materials.darkPlastic}>
        <boxGeometry args={[2.85, 0.005, 1.5]} />
      </mesh>

      {/* ===== KEYBOARD ===== */}
      {/* 5 rows × 14 columns of individual keys */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => {
          const x = -1.3 + col * 0.2;
          const z = -0.5 + row * 0.22;
          return (
            <mesh
              key={`key-${row}-${col}`}
              position={[x, 0.015, z]}
              castShadow
              material={materials.key}
            >
              <boxGeometry args={[0.17, 0.02, 0.18]} />
            </mesh>
          );
        })
      )}

      {/* Spacebar */}
      <mesh position={[0, 0.015, 0.6]} castShadow material={materials.key}>
        <boxGeometry args={[1.2, 0.02, 0.18]} />
      </mesh>

      {/* ===== TRACKPAD ===== */}
      <mesh position={[0, 0.005, 1.0]}>
        <boxGeometry args={[1.4, 0.008, 0.85]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Trackpad border highlight */}
      <mesh position={[0, 0.009, 1.0]}>
        <boxGeometry args={[1.42, 0.001, 0.87]} />
        <meshStandardMaterial color="#3a3a45" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ===== SPEAKER GRILLES ===== */}
      {[-1.35, 1.35].map((x, i) => (
        <group key={`speaker-${i}`}>
          {Array.from({ length: 8 }).map((_, j) => (
            <mesh key={j} position={[x, 0.005, -0.55 + j * 0.13]}>
              <cylinderGeometry args={[0.015, 0.015, 0.005, 8]} />
              <meshStandardMaterial color="#050507" metalness={0.6} roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ===== FRONT ACCENT LINE ===== */}
      <mesh position={[0, -0.08, 1.105]}>
        <boxGeometry args={[2.8, 0.015, 0.005]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* ===== HINGES ===== */}
      {[-1.0, 1.0].map((x, i) => (
        <mesh key={`hinge-${i}`} position={[x, 0.02, -1.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
          <meshStandardMaterial color="#15151a" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* ===== LID / SCREEN GROUP =====
         Pivots from the hinge axis at z = -1.05.
         Initial rotation set by intro animation.
      */}
      <group ref={lidRef} position={[0, 0.02, -1.05]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Lid back panel */}
        <mesh position={[0, 0, 1.0]} castShadow>
          <boxGeometry args={[3.2, 2.0, 0.08]} />
          <meshStandardMaterial color="#1a1a1f" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Pulsing brand logo on lid back */}
        <mesh ref={logoRef} position={[0, 0, 1.045]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Front bezel */}
        <mesh position={[0, 0, 1.041]}>
          <boxGeometry args={[3.15, 1.95, 0.005]} />
          <meshStandardMaterial color="#050507" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* ===== SCREEN ===== */}
        <mesh ref={screenRef} position={[0, -0.02, 1.045]}>
          <planeGeometry args={[2.9, 1.75]} />
          <meshStandardMaterial
            color="#0a1929"
            emissive="#1a4d7a"
            emissiveIntensity={0.8}
            metalness={0}
            roughness={0.1}
          />
        </mesh>

        {/* ===== SCREEN UI: CODE-EDITOR MOCK ===== */}
        {/* Title bar */}
        <mesh position={[0, 0.78, 1.046]}>
          <planeGeometry args={[2.9, 0.12]} />
          <meshStandardMaterial color="#1e1e2e" emissive="#1e1e2e" emissiveIntensity={0.5} />
        </mesh>

        {/* Window control dots */}
        {[
          { x: -1.32, color: '#ff5f57' },
          { x: -1.22, color: '#febc2e' },
          { x: -1.12, color: '#28c840' },
        ].map((dot, i) => (
          <mesh key={i} position={[dot.x, 0.78, 1.047]}>
            <circleGeometry args={[0.025, 16]} />
            <meshStandardMaterial
              color={dot.color}
              emissive={dot.color}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}

        {/* Sidebar */}
        <mesh position={[-1.15, -0.05, 1.046]}>
          <planeGeometry args={[0.6, 1.6]} />
          <meshStandardMaterial color="#181825" emissive="#181825" emissiveIntensity={0.4} />
        </mesh>

        {/* Code lines (Catppuccin-inspired palette) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const colors = ['#89b4fa', '#f38ba8', '#a6e3a1', '#fab387', '#cba6f7'];
          const widths = [1.5, 1.2, 1.7, 1.0, 1.4, 1.3, 1.6, 0.9, 1.5, 1.1, 1.4, 1.2];
          return (
            <mesh
              key={`code-${i}`}
              position={[-0.4 + (widths[i] / 2 - 0.75), 0.5 - i * 0.11, 1.047]}
            >
              <planeGeometry args={[widths[i], 0.04]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                emissive={colors[i % colors.length]}
                emissiveIntensity={0.6}
              />
            </mesh>
          );
        })}

        {/* Webcam */}
        <mesh position={[0, 0.92, 1.046]}>
          <circleGeometry args={[0.022, 16]} />
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.92, 1.048]}>
          <circleGeometry args={[0.01, 16]} />
          <meshStandardMaterial color="#1a3a5a" metalness={1} roughness={0} />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================
   3) MAIN EXPORTED COMPONENT
   Handles canvas setup, lighting, responsiveness, and user
   interaction (mouse + touch drag to rotate).
   ============================================================ */
export const Laptop3D = () => {
  const { cameraZ, cameraY, fov, sensitivity, dpr } = useResponsive();

  const [userRotation, setUserRotation] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- Mouse handlers ---------- */
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

  /* ---------- Touch handlers (mobile + tablet) ---------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsInteracting(true);
        setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInteracting || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startPos.x;
      const dy = e.touches[0].clientY - startPos.y;
      setUserRotation((prev) => ({
        x: Math.max(-0.5, Math.min(0.5, prev.x + dy * sensitivity)),
        y: prev.y + dx * sensitivity,
      }));
      setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = () => setIsInteracting(false);

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
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
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient base illumination */}
        <ambientLight intensity={0.4} />

        {/* Key light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Cool fill light */}
        <directionalLight position={[-5, 3, 2]} intensity={0.6} color="#4488ff" />

        {/* Rim light for separation */}
        <directionalLight position={[0, 2, -5]} intensity={0.5} color="#00d4ff" />

        {/* Screen emission glow */}
        <pointLight position={[0, 1.5, 0.5]} intensity={0.8} color="#4d9aff" distance={4} />

        {/* Soft underglow accent */}
        <pointLight position={[0, -1, 1]} intensity={0.3} color="#00d4ff" distance={3} />

        <LaptopModel autoRotate={!isInteracting} userRotation={userRotation} />
      </Canvas>
    </div>
  );
};
