import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { 
  Plane, Compass, MapPin, Globe, Sparkles, Navigation, 
  Camera, Briefcase, Sun, CheckSquare, Anchor, Mountain, Sunset
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

  // Helper to Create Realistic Continent Map Texture
  const createWorldMapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Solid Burgundy Ocean Base
    ctx.fillStyle = '#42171c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continent Off-White / Warm Cream Polygons
    ctx.fillStyle = '#f5efe9';
    ctx.strokeStyle = '#e2d5c8';
    ctx.lineWidth = 4;

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

    // Realistic Continent Coordinates
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

    // 1. Scene & Camera (Positioned to ensure 100% full globe visibility with zero clipping)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Main Globe Group with Right-Tilt (23.5 degrees)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.41; // Right-tilted axis
    globeGroup.position.y = 0.0;   // Centered vertically
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Globe Sphere with Realistic World Map Texture (NO lat-long grid lines)
    const worldTexture = createWorldMapTexture();
    const globeGeometry = new THREE.SphereGeometry(2.0, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      bumpScale: 0.05,
      specular: 0x66242a,
      shininess: 15
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Atmosphere Outer Glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.14, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7e2a33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
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

    // Add Pins
    cityCoords.forEach((city) => {
      const pos = convertLatLngToVector3(city.lat, city.lng, 2.02);
      const pinGeometry = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x3d1418 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    // Add Curved Flight Arc Lines
    for (let i = 0; i < cityCoords.length - 1; i++) {
      const start = convertLatLngToVector3(cityCoords[i].lat, cityCoords[i].lng, 2.02);
      const end = convertLatLngToVector3(cityCoords[i + 1].lat, cityCoords[i + 1].lng, 2.02);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.55);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0x45181d, linewidth: 2 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);
    }

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5efe9, 1.1);
    dirLight1.position.set(5, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7e2a33, 0.7);
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

  // Compute Scroll Transformation Metrics
  const maxScroll = 550;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  // Update Globe Rotation strictly driven by Scroll (Scroll Down -> Right, Scroll Up -> Left)
  useEffect(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = scrollProgress * Math.PI * 1.25;
    }
  }, [scrollProgress]);

  // Globe Zoom Clamped (zooms from 1.0 to 1.35 max so it STAYS contained inside the Hero section and NEVER overflows into the black row!)
  const globeScale = 1 + scrollProgress * 0.35;
  // Outward displacement of 3D elements (NO FADING! 100% Opacity maintained)
  const elementsOutwardOffset = scrollProgress * 170;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '560px', overflow: 'hidden' }}>
      
      {/* Realistic 3D Globe Canvas */}
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

      {/* 3D TRAVEL ELEMENTS (SOLID MATTE SURFACES — NO GLASSMORPHISM, NO OPACITY FADING) */}
      
      {/* 1. 3D Passport & Visa (Inspired by ele3.png) */}
      <motion.div 
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '10%',
          left: '4%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${-elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Briefcase size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Passport & Visa</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Multi-City Stamp Access</small>
        </div>
      </motion.div>

      {/* 2. 3D Airplane & Flight Path (Inspired by ele3.png) */}
      <motion.div 
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '12%',
          right: '4%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Plane size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Flight Routes</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>NYC &rarr; LHR &rarr; CDG &rarr; TYO</small>
        </div>
      </motion.div>

      {/* 3. 3D Folded Map & Location Pin (Inspired by ele1.png) */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '44%',
          left: '2%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${-elementsOutwardOffset * 1.1}px, 0px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <MapPin size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Interactive Map</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Custom Pins & Destinations</small>
        </div>
      </motion.div>

      {/* 4. 3D Camera & Sightseeing (Inspired by ele3.png) */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '46%',
          right: '2%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${elementsOutwardOffset * 1.1}px, 0px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Camera size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Activity Photos</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Slideshow & Tour Views</small>
        </div>
      </motion.div>

      {/* 5. 3D Tropical Island & Weather Rain Check (Inspired by ele2.png) */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          bottom: '8%',
          left: '6%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${-elementsOutwardOffset}px, ${elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Sun size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Rain Check Alert</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Weather Forecast Tracking</small>
        </div>
      </motion.div>

      {/* 6. 3D Hot Air Balloon & Compass (Inspired by ele3.png) */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          bottom: '10%',
          right: '6%',
          backgroundColor: '#3e181c',
          border: '1.5px solid #63262c',
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          transform: `translate(${elementsOutwardOffset}px, ${elementsOutwardOffset * 0.3}px)`,
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Compass size={24} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Smart Navigator</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Automated Route Scheduling</small>
        </div>
      </motion.div>

    </div>
  );
}
