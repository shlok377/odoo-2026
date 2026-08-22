import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { 
  Plane, Compass, MapPin, Globe, Sparkles, Navigation, 
  Briefcase, Sun, CheckSquare
} from 'lucide-react';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const globeGroupRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to Create Smooth Realistic Continent Map Texture with Subtitle Low Opacity
  const createWorldMapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep Burgundy Ocean Base
    ctx.fillStyle = '#42171c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Low-Opacity Continent Fill (rgba cream 0.35)
    ctx.fillStyle = 'rgba(245, 239, 233, 0.32)';
    ctx.strokeStyle = 'rgba(245, 239, 233, 0.45)';
    ctx.lineWidth = 3;

    const mapCoords = (lng, lat) => ({
      x: ((lng + 180) / 360) * canvas.width,
      y: ((90 - lat) / 180) * canvas.height
    });

    const drawPolygon = (points) => {
      if (points.length === 0) return;
      ctx.beginPath();
      const first = mapCoords(points[0][0], points[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const pt = mapCoords(points[i][0], points[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Realistic Continent Polygons
    const northAmerica = [[-168,66], [-140,60], [-125,48], [-120,34], [-105,20], [-90,15], [-80,8], [-77,8], [-80,25], [-75,35], [-60,46], [-64,60], [-80,68], [-115,70], [-130,70]];
    const southAmerica = [[-80,8], [-70,-10], [-40,-10], [-35,-5], [-40,-20], [-50,-30], [-70,-55], [-75,-45], [-80,-20]];
    const europe = [[-10,36], [0,44], [10,45], [30,40], [30,60], [20,65], [10,70], [-10,65], [-10,50]];
    const africa = [[-17,35], [10,37], [32,32], [43,12], [51,11], [40,-15], [33,-35], [18,-35], [12,-5], [-17,15]];
    const asia = [[30,40], [60,40], [70,20], [80,10], [100,5], [120,20], [140,35], [140,60], [170,65], [180,70], [100,75], [60,75], [40,65]];
    const australia = [[113,-15], [130,-12], [142,-11], [153,-28], [148,-38], [135,-35], [115,-35], [113,-25]];
    const greenland = [[-55,60], [-40,65], [-20,70], [-25,82], [-60,82], [-70,75]];
    const indiaSub = [[68,24], [78,32], [88,26], [80,8], [72,12]];

    drawPolygon(northAmerica);
    drawPolygon(southAmerica);
    drawPolygon(europe);
    drawPolygon(africa);
    drawPolygon(asia);
    drawPolygon(australia);
    drawPolygon(greenland);
    drawPolygon(indiaSub);

    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. High-Poly Globe Group (128x128 segments for smooth curvature)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.41; // Right tilted earth axis (23.5 deg)
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Globe Sphere Material (Subtle Map Texture + Smooth Phong Shading)
    const worldTexture = createWorldMapTexture();
    const globeGeometry = new THREE.SphereGeometry(2.05, 128, 128); // High poly count
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      bumpScale: 0.02,
      specular: 0x66242a,
      shininess: 25,
      transparent: true,
      opacity: 0.98
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Smooth Atmosphere Glow Shell
    const atmosphereGeometry = new THREE.SphereGeometry(2.18, 128, 128);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7e2a33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.28
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 5. Flight Paths & City Pins
    const cityCoords = [
      { lat: 40.7128, lng: -74.0060 }, // NYC
      { lat: 51.5074, lng: -0.1278 },  // London
      { lat: 48.8566, lng: 2.3522 },   // Paris
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
      { lat: 25.2048, lng: 55.2708 },  // Dubai
      { lat: 20.5937, lng: 78.9629 }   // India
    ];

    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    cityCoords.forEach((city) => {
      const pos = convertLatLngToVector3(city.lat, city.lng, 2.06);
      const pinGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xf5efe9 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    for (let i = 0; i < cityCoords.length - 1; i++) {
      const start = convertLatLngToVector3(cityCoords[i].lat, cityCoords[i].lng, 2.06);
      const end = convertLatLngToVector3(cityCoords[i + 1].lat, cityCoords[i + 1].lng, 2.06);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.55);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0xf5efe9, transparent: true, opacity: 0.5 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);
    }

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5efe9, 1.15);
    dirLight1.position.set(5, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7e2a33, 0.75);
    dirLight2.position.set(-5, -4, -6);
    scene.add(dirLight2);

    // 7. Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Compute Scroll Metrics
  const maxScroll = 550;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  // Scroll Down -> Rotate Right (+Y). Scroll Up -> Rotate Left (-Y).
  useEffect(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = scrollProgress * Math.PI * 1.2;
    }
  }, [scrollProgress]);

  // Clamped Zoom Scale
  const globeScale = 1 + scrollProgress * 0.32;
  const elementsOutwardOffset = scrollProgress * 175;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '560px', overflow: 'hidden' }}>
      
      {/* 128-Poly Smooth Realistic Globe Canvas */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          transform: `scale(${globeScale})`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none'
        }} 
      />

      {/* MINIMAL SLEEK 3D TRAVEL PILL BADGES (LESS TEXT, SOLID MATTE SURFACES) */}
      
      {/* 1. Multi-City Routes (Top Left) */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          top: '12%',
          left: '5%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${-elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <Plane size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">Multi-City Routes</span>
      </motion.div>

      {/* 2. Passport Verified (Top Right) */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          top: '14%',
          right: '5%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <Briefcase size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">Passport Sync</span>
      </motion.div>

      {/* 3. Interactive Map (Mid Left) */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          top: '46%',
          left: '2%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${-elementsOutwardOffset * 1.15}px, 0px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <MapPin size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">10k+ Cities</span>
      </motion.div>

      {/* 4. Live Navigator (Mid Right) */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          top: '48%',
          right: '2%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${elementsOutwardOffset * 1.15}px, 0px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <Compass size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">Smart Navigator</span>
      </motion.div>

      {/* 5. Rain Check Forecast (Bottom Left) */}
      <motion.div 
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          bottom: '10%',
          left: '6%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${-elementsOutwardOffset}px, ${elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <Sun size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">Rain Check Alert</span>
      </motion.div>

      {/* 6. Group Split & FX (Bottom Right) */}
      <motion.div 
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute px-3.5 py-2.5 rounded-pill d-flex align-items-center gap-2"
        style={{
          bottom: '12%',
          right: '6%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          transform: `translate(${elementsOutwardOffset}px, ${elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <Navigation size={18} style={{ color: '#f5efe9' }} />
        <span className="fw-bold small text-cream display-heading">Group Split & FX</span>
      </motion.div>

    </div>
  );
}
