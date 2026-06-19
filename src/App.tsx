import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Line } from '@react-three/drei';
import * as animeModule from 'animejs';
const anime = (animeModule as any).default || animeModule;
import * as THREE from 'three';
import {
  Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Code2, Brain, Globe, Trophy,
  Briefcase, Award, Send, Menu, X, Cpu, Users, MessageSquare, Lightbulb, Star, GitFork,
  ArrowRight, Zap, Target, TrendingUp, Moon, Sun, Cog, Wrench, CircuitBoard, Hexagon,
  Database, Server, Terminal, Layers, Radio, Box, Scan, Workflow, Gauge,
  Settings, Hammer, Compass, Rocket, FolderGit, User, Filter, Tag, Building, Calendar,
  GraduationCap, Coffee, Atom, FileType, Folder, FileCode, Smartphone,
  Leaf
} from 'lucide-react';
import SplashCursor from './components/SplashCursor';
import Aurora from './components/Aurora';
import { Laptop3D } from './components/Laptop3D';
import MagnetLines from './components/MagnetLines';
import AdminDashboard from './AdminDashboard';
gsap.registerPlugin(ScrollTrigger);

// ============================================
// ENGINEERING 3D BACKGROUND COMPONENT
// ============================================

const ThemeAwareObject = ({ theme }: { theme: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = theme === 'dark' ? '#fbbf24' : '#1f2937';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[9, 1.5, 200, 32]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={theme === 'dark' ? 0.3 : 0.1} />
      </mesh>
    </Float>
  );
};

const RotatingGear = ({ position, size, speed, theme }: { position: [number, number, number], size: number, speed: number, theme: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = theme === 'dark' ? '#fbbf24' : '#4b5563';

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += speed * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[size, size * 0.2, 16, 100]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.15} />
    </mesh>
  );
};

const CircuitLines = ({ theme }: { theme: string }) => {
  const linesRef = useRef<THREE.Group>(null);
  const color = theme === 'dark' ? '#fbbf24' : '#1f2937';

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const linesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      const startX = (Math.random() - 0.5) * 40;
      const startY = (Math.random() - 0.5) * 40;
      const startZ = (Math.random() - 0.5) * 20;
      const points = [];
      let currentX = startX, currentY = startY, currentZ = startZ;
      for (let j = 0; j < 5; j++) {
        points.push(new THREE.Vector3(currentX, currentY, currentZ));
        currentX += (Math.random() - 0.5) * 10;
        currentY += (Math.random() - 0.5) * 10;
        currentZ += (Math.random() - 0.5) * 5;
      }
      data.push(points);
    }
    return data;
  }, []);

  return (
    <group ref={linesRef}>
      {linesData.map((points, i) => (
        <Line key={i} points={points} color={color} lineWidth={0.5} transparent opacity={0.1} />
      ))}
    </group>
  );
};

const FloatingHexagons = ({ theme }: { theme: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const color = theme === 'dark' ? '#fbbf24' : '#1f2937';

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  const hexagons = useMemo(() => {
    const hexArray = [];
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 30 - 20;
      const size = Math.random() * 0.5 + 0.3;
      hexArray.push(
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[size, size, 0.05, 6]} />
          <meshStandardMaterial color={color} wireframe transparent opacity={0.08} />
        </mesh>
      );
    }
    return hexArray;
  }, [color]);

  return <group ref={groupRef}>{hexagons}</group>;
};

const DataParticles = ({ theme }: { theme: string }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const color = theme === 'dark' ? '#fbbf24' : '#1f2937';

  const [positions] = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.4} />
    </points>
  );
};

const EngineeringBackground = ({ theme }: { theme: string }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
        <ambientLight intensity={theme === 'dark' ? 0.3 : 1} />
        <pointLight position={[10, 10, 10]} intensity={1} color={theme === 'dark' ? '#fbbf24' : '#ffffff'} />
        <Stars radius={50} depth={50} count={theme === 'dark' ? 3000 : 1000} factor={4} saturation={0} fade speed={1} />
        <ThemeAwareObject theme={theme} />
        <RotatingGear position={[-15, 10, -10]} size={2} speed={1} theme={theme} />
        <RotatingGear position={[15, -8, -15]} size={1.5} speed={-1.5} theme={theme} />
        <RotatingGear position={[-12, -12, -8]} size={1} speed={2} theme={theme} />
        <CircuitLines theme={theme} />
        <FloatingHexagons theme={theme} />
        <DataParticles theme={theme} />
      </Canvas>
    </div>
  );
};

// ============================================
// ANIMATED ENGINEERING ELEMENTS
// ============================================

const AnimatedGear = ({ size = 24, className = '', speed = 2 }: { size?: number, className?: string, speed?: number }) => {
  const gearRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gearRef.current) {
      gsap.to(gearRef.current, { rotation: 360, duration: speed, repeat: -1, ease: 'none' });
    }
  }, [speed]);
  return <div ref={gearRef} className={className}><Settings size={size} /></div>;
};

const FloatingIcon = ({ icon: Icon, delay = 0, className = '' }: { icon: React.ComponentType<{ size?: number }>, delay?: number, className?: string }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, { y: -15, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay });
    }
  }, [delay]);
  return <div ref={iconRef} className={className}><Icon size={28} /></div>;
};

const ScanningLine = ({ className = '' }: { className?: string }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { top: '0%' }, { top: '100%', duration: 3, repeat: -1, ease: 'none' });
    }
  }, []);
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div ref={lineRef} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }} />
    </div>
  );
};

const BlueprintGrid = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-10 ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

const TechBadge = ({ icon: Icon, text, delay = 0 }: { icon: React.ComponentType<{ size?: number }>, text: string, delay?: number }) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay, ease: 'back.out(1.7)' });
    }
  }, [delay]);
  return (
    <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium border border-yellow-300 dark:border-yellow-700">
      <Icon size={16} /><span>{text}</span>
    </div>
  );
};


// ============================================
// NAVIGATION COMPONENT
// ============================================
const Navigation = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 });
    }
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: Cpu },
    { name: 'About', href: '#about', icon: User },
    { name: 'Projects', href: '#projects', icon: FolderGit },
    { name: 'Skills', href: '#skills', icon: Settings },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
          <AnimatedGear size={28} className="text-yellow-500" speed={4} />
          <span className="gradient-text">Portfolio</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }} className="nav-link text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
              <link.icon size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" aria-label="Toggle Dark Mode">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="md:hidden text-gray-900 dark:text-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg mt-3 mx-6 rounded-xl p-6 shadow-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 flex items-center gap-3">
                <link.icon size={18} className="text-yellow-500" />{link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = headingRef.current?.querySelectorAll('.letter');
      if (letters && letters.length > 0) {
        anime({ targets: letters, translateY: [100, 0], translateZ: 0, rotateX: [-90, 0], opacity: [0, 1], easing: 'easeOutElastic(1, .8)', duration: 1400, delay: anime.stagger(40, { start: 300 }) });
      }
      gsap.fromTo(contentRef.current?.children || [], { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.8 });
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.8, rotation: -5 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
      }
      gsap.to('.floating-stat', { y: -10, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <BlueprintGrid />
      <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-100 dark:bg-yellow-900/10 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-32 left-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Cog} delay={0} /></div>
      <div className="absolute bottom-40 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={CircuitBoard} delay={0.5} /></div>
      <div className="absolute top-1/2 left-10 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Hexagon} delay={1} /></div>
      <div className="absolute top-40 right-1/4 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Cpu} delay={1.5} /></div>
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-6 border border-yellow-300 dark:border-yellow-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"><Radio size={14} className="text-yellow-500" />Available for opportunities</span>
            </div>
            <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6 flex flex-col gap-2">
  {/* Line 1: DEBMALYA */}
  <div className="block whitespace-nowrap">
    {"DEBMALYA".split('').map((char, i) => (
      <span key={`f-${i}`} className="letter inline-block" style={{ transformStyle: 'preserve-3d' }}>
        {char}
      </span>
    ))}
  </div>

  {/* Line 2: BHATTACHARYYA with gradient applied directly to the spans */}
  <div className="block whitespace-nowrap">
    {"BHATTACHARYYA".split('').map((char, i) => (
      <span key={`l-${i}`} className="letter inline-block gradient-text" style={{ transformStyle: 'preserve-3d' }}>
        {char}
      </span>
    ))}
  </div>
</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium flex items-center gap-2"><Terminal size={20} className="text-yellow-500" />3x Hackathon Winner | Freelancer | Full-Stack Developer (MERN & Django) | Android (Java) | AI & Data Enthusiast (Flask) | Open Source Contributor</p>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg text-lg">Building innovative solutions through code.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={scrollToProjects} className="magnetic-btn px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30 group">
                <Rocket size={18} className="group-hover:animate-bounce" />Explore My Work<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           <a href="mailto:debmalyabhattacharyya2@gmail.com" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-800 hover:border-yellow-400 dark:hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full font-semibold transition-all flex items-center gap-2"><Send size={18} />Get In Touch</a>
            </div>
            <div className="flex gap-4 mt-8">
              <a href="https://linkedin.com/in/debmalya-bhattacharyya" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 group"><Linkedin size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-yellow-600" /></a>
              <a href="https://github.com/Debmalya2107" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 group"><Github size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-yellow-600" /></a>
              <a href="mailto:debmalyabhattacharyya2@gmail.com" className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110 group"><Mail size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-yellow-600" /></a>
            </div>
          </div>
          <div ref={imageRef} className="order-1 lg:order-2 flex justify-center relative">
            <ScanningLine />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-3xl blur-2xl opacity-30 transform rotate-6" />
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-400" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-400" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-400" />
              <img src="/images/hero-portrait.png" alt="Debmalya Bhattacharyya" className="relative rounded-3xl w-full max-w-md shadow-2xl border-4 border-white dark:border-gray-800" />
              <div className="floating-stat absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl border border-yellow-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center"><Trophy size={28} className="text-gray-900" /></div>
                  <div><p className="text-3xl font-bold gradient-text">Passionate</p><p className="text-sm text-gray-500 dark:text-gray-400">Coder</p></div>
                </div>
              </div>
              <div >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================
// ABOUT SECTION
// ============================================
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { label: 'Projects', value: 30, suffix: '+', icon: FolderGit },
    { label: 'Hackathons', value: 5, suffix: '+', icon: Trophy },
    { label: 'Internships', value: 3, suffix: '', icon: Briefcase },
    { label: 'GitHub Repos', value: 30, suffix: '+', icon: Github },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statElements = statsRef.current?.querySelectorAll('.stat-value');
      statElements?.forEach((el, i) => {
        const target = stats[i].value;
        gsap.fromTo(el, { innerText: 0 }, { innerText: target, duration: 2, ease: 'power2.out', snap: { innerText: 1 }, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }, delay: i * 0.1 });
      });
      gsap.fromTo('.stat-card', { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: statsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 bg-gray-50 dark:bg-gray-900/50">
      <BlueprintGrid />
      <div className="absolute top-20 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Wrench} delay={0} /></div>
      <div className="absolute bottom-40 left-10 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Hammer} delay={0.7} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4"><Compass size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Know More</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">About <span className="gradient-text">Me</span></h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">I am a <span className="text-yellow-600 dark:text-yellow-500 font-semibold">BCA student</span> at Techno International New Town (2023-2027), passionate about technology and innovation. My journey involves exploring AI/ML, web development, and creating impactful projects.</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">With hands-on experience in multiple internships and hackathons,freelance projects, and personal projects, I've developed a strong foundation in both technical skills and collaborative leadership. I'm constantly learning and adapting to new technologies to stay at the forefront of innovation.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <TechBadge icon={MapPin} text="Kolkata, India" delay={0} />
              <TechBadge icon={GraduationCap} text="BCA Student" delay={0.1} />
              <TechBadge icon={Zap} text="Tech Enthusiast" delay={0.2} />
              <TechBadge icon={Award} text="Problem Solver" delay={0.3} />
              <TechBadge icon={Award} text="Creative Thinker" delay={0.4} />
              <TechBadge icon={Award} text="Team Player" delay={0.5} />
              <TechBadge icon={Award} text="Fast Learner" delay={0.6} />
              <TechBadge icon={Award} text="Freelancer" delay={0.7} />
            </div>
          </div>
          <div ref={statsRef} className="w-full h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black shadow-2xl border border-gray-800 dark:border-gray-700 flex items-center justify-center">
            <img src="/images/abt.png" alt="About" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// PROJECTS SECTION
// ============================================
const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState('All');

  const projects = [
    // --- YOUR EXISTING PROJECTS ---
    { name: "Campora", description: "Campus Management System for HackOverflow - IIT Goa. Say goodbye to boring student portals. Say hello to the interactive campus.", url: "https://github.com/Debmalya2107/CAMPORA-", language: "Django & React", tags: ["Vite.js", "django", "Tailwind CSS", "Web"], stars: 0, forks: 0, image: "/images/project-campus.jfif" },
    { name: "Resumy.ai", description: "A privacy-first AI Career Coach that runs Google's Gemma-2B model entirely in your browser via WebGPU for instant resume analysis and mock interviews.", url: "https://github.com/Debmalya2107/Resumy.ai", language: "TypeScript", tags: ["AI/ML", "WebGPU", "JavaScript", "AI"], stars: 0, forks: 0, image: "/images/project-resume.jfif" },
    { name: "Code-Desk", description: "Student Project Collaboration Platform - A full-stack application for students to collaborate on projects in real-time.", url: "https://github.com/Debmalya2107/Code-Desk_3.0", language: "TypeScript", tags: ["django", "postgresql", "Libsodium", "Web"], stars: 0, forks: 0, image: "/images/project-codedesk.jpg" },
    { name: "Smart_Link_Hub", description: "Smart Link Hub - Intelligent link management system with AI-powered categorization. 2nd Place at Advitiya x JPD Hub Hackathon, IIT Ropar.", url: "https://github.com/Debmalya2107/Smart_Link_Hub-Advitiya-x-JPD-Hub-Hackathon-26-Indian-Institute-of-Technology-IIT-Ropar",liveUrl: "https://smart-link-hub-blue.vercel.app/", language: "MERN", tags: ["AI/ML", "JavaScript", "Hackathon", "AI"], stars: 0, forks: 0, image: "/images/project-ai.jfif" },
    { name: "Stock-Price-Prediction", description: "Euphoria Genx Internship Project - AI-powered stock price prediction using machine learning algorithms and historical data analysis.", url: "https://github.com/Debmalya2107/Stock-Price-Prediction_using-AI", language: "Python", tags: ["Python", "Machine Learning", "LSTM", "AI/ML"], stars: 0, forks: 0, image: "/images/project-stock.jpg" },
    { name: "Hand-Gesture-Recognition", description: "Indian Institute of Internship Project - AI-integrated Computer Vision system for recognizing hand gestures in real-time.", url: "https://github.com/Debmalya2107/Hand-Gesture-Recognition-Using-AI-integrated-with-COMPUTER-VISION-", language: "Python", tags: ["Python", "OpenCV", "Computer Vision", "AI/ML"], stars: 0, forks: 0, image: "/images/hand.jpg" },
    
    // --- ADDED: FRONT-END PROJECTS ---
    { name: "Banquet Management", description: "A modern, full-stack web application designed for premium wedding vendor management.", url: "https://github.com/Debmalya2107/weddingschapter-Full-stack-website",liveUrl: "https://wedding-frontend-flax.vercel.app/", language: "React", tags: ["Frontend", "React", "Web"], stars: 0, forks: 0, image: "/images/wedding.jpg" },
    { name: "Frontend-Diploma Projects", description: "A single website to showcase all of my Diploma Projects", url: "https://github.com/Debmalya2107/Diploma-Projects",liveUrl: "https://icube-web-dev-projects.netlify.app/", language: "JavaScript", tags: ["Frontend", "HTML", "CSS"], stars: 0, forks: 0, image: "/images/icube.jpg" },
    { name: "Chromatic-Drift", description: "Chromatic Drift is a minimalist photography website that curates nature and street photo collections, invites collaboration from other photographers, and makes it easy for people to get in touch for projects, licensing, or partnerships.", url: "https://github.com/Debmalya2107/Chromatic-Drift", liveUrl: "https://chromatic-drift.netlify.app/", language: "JavaScript", tags: ["Frontend", "HTML", "CSS"], stars: 0, forks: 0, image: "/images/cd.jpg" },
    { name: "Bank Denomination Calculator", description: "The Bank Denomination Calculator is a web application that allows users to break down any amount of money into specified currency denominations.", url: "https://github.com/Debmalya2107/Bank-Denomination-Calculator", language: "HTML", tags: ["Frontend", "HTML", "Web"], stars: 0, forks: 0, image: "/images/bank.jpg" },
    { name: "Memory-Match-Adventure", description: "Memory Match Adventure is a fun and interactive card matching game where players test their memory skills by finding pairs of matching cards.", url: "https://github.com/Debmalya2107/Memory-Match-Adventure", language: "HTML", tags: ["Frontend", "HTML", "Web"], stars: 0, forks: 0, image: "/images/mem.jpg" },

    // --- ADDED: AI/ML PROJECTS ---
    { name: "RetinaAI - Diabetic Retinopathy Detection System", description: "An advanced Deep Learning solution for automated grading of Diabetic Retinopathy using Weakly-supervised Chained Knowledge Distillation (WeCKD).", url: "https://github.com/Debmalya2107/Diabetic-Retinopathy-Classification-using-WeCKD", language: "Python", tags: ["AI/ML", "Healthcare", "Python"], stars: 0, forks: 0, image: "/images/dia.jpg" },
    { name: "FairGurad-AI", description: "Hackathon winning system for detecting cheating in exams using AI and computer vision.", url: "https://github.com/Debmalya2107/fairguard_ai", language: "Python", tags: ["AI/ML", "Cheating-Detection", "Python"], stars: 0, forks: 0, image: "/images/fair.jpeg" },
    { name: "Cracky-AI", description: "A crack detection system using AI and computer vision to identify cracks in construction materials.", url: "https://github.com/Debmalya2107/cracky-AI", language: "Python", tags: ["AI/ML", "Road-Crack-Detection", "Python"], stars: 0, forks: 0, image: "/images/crack.jpg" },
    { name: "Emotion Detection", description: "An emotion detection system using AI and computer vision to recognize emotions in real-time.", url: "https://github.com/Debmalya2107/Emotion-Detection-Model", language: "Python", tags: ["AI/ML", "Computer Vision", "Keras"], stars: 0, forks: 0, image: "/images/emo.jpg" },
    { name: "GlobalAlert: Live Crisis Monitor", description: "A robust, real-time threat intelligence dashboard powered by Google Gemini 3 and NewsAPI.A hackathon project.", url: "https://github.com/Debmalya2107/GlobalAlert-Dataquest-DataQuest-2026-Indian-Institute-of-Technology-IIT-Kharagpur",liveUrl: "https://huggingface.co/spaces/dedx09/globalnews", language: "Python", tags: ["AI/ML", "Pathway", "API used"], stars: 0, forks: 0, image: "/images/glo.jpg" },
    { name: "Road Lane Detection", description: "By processing video frames or images, the system highlights lane boundaries, aiding in applications like autonomous driving and advanced driver-assistance systems (ADAS).", url: "https://github.com/Debmalya2107/Detection-Of-Road-Lane-Lines", language: "Python", tags: ["AI/ML", "openCV", "Basic level ADAS"], stars: 0, forks: 0, image: "/images/road.jpg" },
    { name: "Student-Grading-With-AI", description: "A powerful Streamlit web application for analyzing student marks from Excel files and generating comprehensive top 5 student reports.", url: "https://github.com/Debmalya2107/Student-Grading-With-AI", language: "Python", tags: ["AI/ML", "openCV", "Basic level ADAS"], stars: 0, forks: 0, image: "/images/stu.jpg" },

    // --- ADDED: FULL STACK PROJECTS ---
    { name: "Bow Box", description: "A premium, full-stack e-commerce platform designed with a beautifully crafted glassmorphism and pastel aesthetic. From birthday surprises to the perfect anniversary expression, Bowbox delivers a seamless, high-performance shopping experience.", url: "https://github.com/Debmalya2107/Bow-Box",liveUrl: "https://website-eta-gules-28.vercel.app/", language: "TypeScript", tags: ["Framer Motion", "Next.js", "Supabase"], stars: 0, forks: 0, image: "/images/bow.jpg" },
    { name: "Real Time Chat App", description: "A simple real-time chat application built with Node.js, Express, and Socket.IO.", url: "https://github.com/Debmalya2107/Chat-application",liveUrl: "https://chat-application-1-p539.onrender.com/", language: "Node.js", tags: ["Internship Project", "Next.js", "Express"], stars: 0, forks: 0, image: "/images/cht.jpg" },
    
    // --- ADDED: OTHER PROJECTS ---
  { name: "Frontend-Diploma Projects", description: "A single website to showcase all of my Diploma Projects", url: "https://github.com/Debmalya2107/Diploma-Projects",liveUrl: "https://icube-web-dev-projects.netlify.app/", language: "Android Studio", tags: ["ICUBE", "Diploma", "Android"], stars: 0, forks: 0, image: "/images/icube.jpg" },
  { name: "Prabuddha TINT", description: "1st Runner up Group project for DEV YOU WEB hackathon", url: "https://github.com/Debmalya2107/prabbudha_TINT",liveUrl: "https://prabuddha.kankangain.com/", language: "Hackathon Build", tags: ["TINT", "Dev Your Web", "Hackathon"], stars: 0, forks: 0, image: "/images/pra.jpg" },
  ];

  const filters = ['All', 'Front-End', 'AI/ML', 'Full Stack', 'Other'];

  const getProjectCategory = (project: typeof projects[0]) => {
    const t = project.tags.map(tag => tag.toLowerCase());
    const n = project.name.toLowerCase();
    
    // The sorting logic looks at the tags array to decide which tab to put it in
    if (t.includes('fossee') || n.includes('fossee')) return 'Open Source';
    if (t.includes('ai/ml') || t.includes('ai') || t.includes('machine learning') || t.includes('computer vision') || n.includes('ai')) return 'AI/ML';
    if (t.includes('node.js') ||t.includes('django') || t.includes('backend') || t.includes('supabase') || t.includes('socket.io') || t.includes('express')) return 'Full Stack';
    if (t.includes('frontend') || t.includes('web') || t.includes('html') || t.includes('css') || t.includes('react')) return 'Front-End';
    
    return 'Other';
  };

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => getProjectCategory(p) === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section id="projects" ref={sectionRef} className="relative py-32">
      <BlueprintGrid />
      <div className="absolute top-40 left-10 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Folder} delay={0} /></div>
      <div className="absolute bottom-20 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={FileCode} delay={0.5} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4"><Rocket size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">View My</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">My <span className="gradient-text">Projects</span></h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-4" />          
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`filter-btn px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === f ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              <Filter size={14} />{f}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: typeof projects[0], index) => (
            <div key={index} className="project-card bg-white dark:bg-gray-800 group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
              <div className="relative overflow-hidden h-48">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-semibold flex items-center gap-1"><Code2 size={12} />{project.language}</span></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"><ScanningLine /></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2"><Box size={18} className="text-yellow-500" />{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded text-xs flex items-center gap-1"><Tag size={10} />{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Star size={14} /> {project.stars}</span>
                    <span className="flex items-center gap-1"><GitFork size={14} /> {project.forks}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {(project as any).liveUrl && (
                      <a href={(project as any).liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"><Globe size={14} />Live</a>
                    )}
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"><ExternalLink size={14} />View</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="https://github.com/Debmalya2107" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition-all hover:shadow-xl group">
            <Github size={20} />View All Projects on GitHub<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};


// ============================================
// SKILLS SECTION
// ============================================
const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const techSkills = [
    { name: 'Java', level: 55, color: '#f89820', icon: Coffee },
    { name: 'Python', level: 65, color: '#3776ab', icon: Terminal },
    { name: 'JavaScript', level: 75, color: '#f7df1e', icon: Code2 },
    { name: 'TypeScript', level: 55, color: '#3178c6', icon: FileType },
    { name: 'HTML/CSS', level: 99, color: '#e34c26', icon: Layers },
    { name: 'React', level: 70, color: '#61dafb', icon: Atom },
    { name: 'Node.js', level: 75, color: '#339933', icon: Server },
    { name: 'AI/ML', level: 50, color: '#ff6f00', icon: Brain },
    { name: 'Git', level: 80, color: '#f05032', icon: GitFork },
  ];

  const softSkills = [
    { name: 'Collaborative Leadership', description: 'Proven ability to work effectively within diverse teams under high-pressure, competitive environments like national-level hackathons.', icon: Users },
    { name: 'Problem-Solving & Adaptability', description: 'Strong analytical skills with the capacity to rapidly learn and implement new technologies.', icon: Lightbulb },
    { name: 'Technical Communication', description: 'Skilled in articulating complex technical concepts and project visions to both technical and non-technical stakeholders.', icon: MessageSquare },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.skill-bar-fill', { width: 0 }, { width: '100%', duration: 1.5, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      gsap.fromTo('.skill-orb', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15, delay: 0.2, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <BlueprintGrid />
      {/* Animated magnetic lines background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-30 z-0">
        <MagnetLines
          rows={10}
          columns={12}
          containerSize="90vmin"
          lineColor="#fbbf24"
          lineWidth="2px"
          lineHeight="30px"
          baseAngle={-10}
        />
      </div>
      <div className="absolute top-20 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Wrench} delay={0} /></div>
      <div className="absolute bottom-40 left-10 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Settings} delay={0.5} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4"><Gauge size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">My</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Skills & <span className="gradient-text">Expertise</span></h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Code2 className="text-yellow-500" size={28} /><span className="text-gray-900 dark:text-white">Technical Skills</span></h3>
            <div className="space-y-6">
              {techSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><skill.icon size={16} className="text-yellow-500" />{skill.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="skill-bar-fill h-full rounded-full transition-all duration-1000 relative" style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Brain className="text-yellow-500" size={28} /><span className="text-gray-900 dark:text-white">Soft Skills</span></h3>
            <div className="space-y-4">
              {softSkills.map((skill, index) => (
                <div key={index} className="skill-orb group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-yellow-400 dark:hover:border-yellow-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-yellow-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-yellow-400 dark:group-hover:bg-yellow-500 transition-colors duration-300">
                      <skill.icon size={28} className="text-yellow-600 dark:text-yellow-500 group-hover:text-gray-900 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-yellow-600 transition-colors duration-300">{skill.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{skill.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// EXPERIENCE SECTION
// ============================================
const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const internships = [
    { company: 'Indian Institute of Internship', role: 'AI/ML Intern', project: 'Hand Gesture Recognition Using AI', tech: 'Computer Vision, Python', period: '2025', icon: Brain },
    { company: 'Euphoria Genx', role: 'Machine Learning Intern', project: 'Stock Price Predictor using AI', tech: 'Python, ML Algorithms', period: '2025', icon: TrendingUp },
    { company: 'Tech Nest', role: 'Backend Developer Intern', project: 'Real-time chat server with Node.js', tech: 'Node.js, Socket.IO', period: '2025', icon: Server },
    { company: 'Skillbit Technologies', role: 'Web Development Intern', project: 'Dell Alienware Landing Page, Video Player', tech: 'HTML, CSS, JavaScript', period: '2025', icon: Globe },
    { company: 'KODBUD', role: 'Java Development Intern', project: 'Library Management, Digital Clock, Notepad, Games', tech: 'Java, Swing', period: '2025', icon: Coffee },
    { company: 'Pinancle Labs', role: 'AI/ML Intern', project: 'Fake News Detection, Road Lane Detection', tech: 'Python, NLP, OpenCV', period: '2025', icon: Scan },
  ];

  const onlineHackathons = [
    { name: 'Advitiya x JPD Hub', organizer: 'IIT Ropar', position: '2nd Place', project: 'Smart Link Hub', icon: Trophy },
    { name: 'Educ-A-Thon 2.0', organizer: 'Techno Main', position: 'Leader', project: 'Code-Desk', icon: Code2 },
    { name: 'HACKX', organizer: 'Chandigarh University (CU), Ajitgarh, Punjab', position: 'Leader', project: 'Resumy.ai', icon: Brain },
    { name: 'Crackathon', organizer: 'Indian Institute of Technology (IIT), Bombay', position: 'Leader', project: 'Craky AI', icon: Target },
    { name: 'Nextgen-AI 2026', organizer: 'St. Peters Engineering College kompally', position: 'Leader', project: 'Emotion Detection', icon: Target },
    { name: 'DataQuest 2026', organizer: 'Indian Institute of Technology (IIT), Kharagpur', position: 'Member', project: 'GlobalAlert', icon: Globe },
    { name: 'HackOverflow', organizer: 'Indian Institute of Technology (IIT), Goa', position: 'Leader', project: 'Campora - Online College Campus Management System', icon: Globe },
    { name: 'Emotion-Aware Encryption Hackathon', organizer: 'UnsaidTalks Education', position: 'Leader', project: 'AuraCrypt', icon: Zap },
  ];

  const offlineHackathons = [
    { name: 'Hack Storm 2.26', organizer: 'BP Poddar Institute', position: '2nd Place', project: 'Exam Proctoring System', icon: Trophy },
    { name: 'Dev Your Web', organizer: 'Techno International Newtown', position: '2nd Place', project: 'Prabuddha Website', icon: Trophy },
    { name: 'The XiBit', organizer: 'Brainware University', position: 'Leader', project: 'Ayulinker', icon: Leaf },
    { name: 'Smart India Hackathon', organizer: 'Government of India', position: 'Team Member', project: 'AyuLinker', icon: Award },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.timeline-item', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative py-32">
      <BlueprintGrid />
      <div className="absolute top-40 left-10 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Briefcase} delay={0} /></div>
      <div className="absolute bottom-20 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Trophy} delay={0.5} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4"><Workflow size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Journey</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Experience & <span className="gradient-text">Achievements</span></h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Briefcase className="text-yellow-500" size={28} />Internships</h3>
            <div className="space-y-6">
              {internships.map((intern, index) => (
                <div key={index} className="timeline-item bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-l-4 border-yellow-400 group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><intern.icon size={20} className="text-yellow-600 dark:text-yellow-500" /></div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{intern.company}</h4>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1"><Calendar size={12} />{intern.period}</span>
                  </div>
                  <p className="text-yellow-600 dark:text-yellow-500 font-semibold mb-2 flex items-center gap-2"><User size={14} />{intern.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center gap-2"><Folder size={14} />{intern.project}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1"><Code2 size={10} />{intern.tech}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Trophy className="text-yellow-500" size={28} />Hackathons</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><Radio size={18} className="text-yellow-500" />Offline</h4>
                <div className="space-y-4">
                  {offlineHackathons.map((hack, index) => (
                    <div key={index} className={`timeline-item bg-white dark:bg-gray-800 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all ${hack.position.includes('2nd') ? 'border-2 border-yellow-400 dark:border-yellow-500' : 'border-2 border-transparent'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hack.position.includes('2nd') ? 'bg-yellow-400' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                        <hack.icon size={24} className={hack.position.includes('2nd') ? 'text-gray-900' : 'text-yellow-600 dark:text-yellow-500'} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{hack.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{hack.organizer}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">{hack.project}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hack.position.includes('2nd') ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{hack.position}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><Globe size={18} className="text-yellow-500" />Online</h4>
                <div className="space-y-4">
                  {onlineHackathons.map((hack, index) => (
                    <div key={index} className={`timeline-item bg-white dark:bg-gray-800 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all ${hack.position.includes('2nd') ? 'border-2 border-yellow-400 dark:border-yellow-500' : 'border-2 border-transparent'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hack.position.includes('2nd') ? 'bg-yellow-400' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                        <hack.icon size={24} className={hack.position.includes('2nd') ? 'text-gray-900' : 'text-yellow-600 dark:text-yellow-500'} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{hack.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{hack.organizer}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">{hack.project}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hack.position.includes('2nd') ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{hack.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================
// CERTIFICATIONS SECTION
// ============================================
const CertificationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const certifications = [
    { title: 'Diploma in Android App Development', issuer: 'Institute of Intellectual Information', period: '2025-2026', description: 'Advanced certification in mobile app development & Website Development', icon: Smartphone },
    { title: 'Blockchain Technology Workshop', issuer: 'Technical Institution', period: '2024', description: 'Technical immersion on decentralized ledgers', icon: Database },
    { title: 'Mastering The Tools Of Data Analytics', issuer: 'HCL GUVI', period: '2025', description: 'Excel, PowerBI, Tableau', icon: Brain },
    { title: 'Machine Learning Certificate', issuer: 'Euphoria Genx', period: '2025', description: 'Stock Price Prediction using AI', icon: TrendingUp },
    { title: 'Backend Development Certificate', issuer: 'Tech Nest', period: '2025', description: 'Real-time Chat Server with Node.js', icon: Server },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cert-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-gray-50 dark:bg-gray-900/50">
      <BlueprintGrid />
      <div className="absolute top-20 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Award} delay={0} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4"><Award size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Credentials</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4"><span className="gradient-text">Certifications</span> & Courses</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="cert-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 border-t-4 border-yellow-400 group">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><cert.icon size={28} className="text-yellow-600 dark:text-yellow-500" /></div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{cert.title}</h3>
              <p className="text-yellow-600 dark:text-yellow-500 text-sm font-medium mb-1 flex items-center gap-1"><Building size={14} />{cert.issuer}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 flex items-center gap-1"><Calendar size={12} />{cert.period}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION
// ============================================
const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-element', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-32">
      <BlueprintGrid />
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 dark:bg-yellow-900/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200 dark:bg-yellow-900/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-40 left-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={Mail} delay={0} /></div>
      <div className="absolute bottom-40 right-20 text-yellow-400/20 dark:text-yellow-500/20"><FloatingIcon icon={MessageSquare} delay={0.5} /></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4"><Radio size={24} className="text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Connect</span></div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Let's <span className="gradient-text">Connect</span></h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Let's Build A Netwrok Together</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="contact-element flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Mail size={24} className="text-yellow-600 dark:text-yellow-500" /></div>
              <div><p className="text-sm text-gray-500 dark:text-gray-400">Email</p><a href="mailto:debmalyabhattacharyya2@gmail.com" className="font-semibold text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">debmalyabhattacharyya2@gmail.com</a></div>
            </div>
            <div className="contact-element flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Phone size={24} className="text-yellow-600 dark:text-yellow-500" /></div>
              <div><p className="text-sm text-gray-500 dark:text-gray-400">Phone</p><a href="tel:+917439417607" className="font-semibold text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">+91 74394 17607</a></div>
            </div>
            <div className="contact-element flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><MapPin size={24} className="text-yellow-600 dark:text-yellow-500" /></div>
              <div><p className="text-sm text-gray-500 dark:text-gray-400">Location</p><p className="font-semibold text-gray-900 dark:text-white">Kolkata, India</p></div>
            </div>
            <div className="contact-element flex gap-4 pt-4">
              <a href="https://linkedin.com/in/debmalya-bhattacharyya" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-900 dark:bg-gray-800 text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-gray-900 dark:hover:text-gray-900 transition-all hover:scale-110"><Linkedin size={24} /></a>
              <a href="https://github.com/Debmalya2107" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-900 dark:bg-gray-800 text-white rounded-xl flex items-center justify-center hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-gray-900 dark:hover:text-gray-900 transition-all hover:scale-110"><Github size={24} /></a>
            </div>
          </div>
          <div className="contact-element bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-3xl p-8 shadow-xl border border-yellow-200 dark:border-yellow-900/30 flex items-center justify-center min-h-[500px] overflow-hidden">
            <style>{`
              @keyframes auto-rotate {
                from {
                  transform: rotateY(0deg);
                }
                to {
                  transform: rotateY(360deg);
                }
              }
              .auto-rotating {
                animation: auto-rotate 15s linear infinite;
              }
            `}</style>
            <div className="w-full h-full flex items-center justify-center">
              <Laptop3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => {
  return (
    <footer className="relative py-8 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <AnimatedGear size={24} className="text-yellow-500" speed={4} />
            <span className="text-2xl font-bold gradient-text">DB</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400 text-sm">Debmalya Bhattacharyya</span>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-2"><Code2 size={14} />2025 Student Portfolio</p>
          <div className="flex gap-4">
            <a href="https://github.com/Debmalya2107" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Github size={20} /></a>
            <a href="https://linkedin.com/in/debmalya-bhattacharyya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP
// ============================================
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  if (window.location.pathname === '/admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Aurora
        colorStops={["#FFD400", "#FF8C00", "#FF8C00"]}
        blend={0.97}
        amplitude={1.0}
        speed={1.9}
      />
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#FFC300"
      />
      <EngineeringBackground theme={theme} />
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <main className="relative z-10 transition-colors duration-300">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
