import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { 
  Plane, Compass, MapPin, Globe, Sparkles, Navigation, 
  Camera, Briefcase, Sun, CheckSquare, Anchor, Mountain
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

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Increased z position so the bottom of the globe is 100% visible without clipping
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 8.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Main Globe Group with Right-Tilt (23.5 deg = 0.41 rad)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.41; // Right-tilted axial tilt
    globeGroup.position.y = 0.15; // Raised slightly to prevent bottom clipping
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Globe Sphere Material (Burgundy #4a191e)
    const globeGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a191e,
      emissive: 0x240b0f,
      specular: 0x8a333e,
      shininess: 30,
      transparent: true,
      opacity: 0.96
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Wireframe Grid Lines (Cream #f5efe9 with opacity)
    const wireframeGeometry = new THREE.SphereGeometry(2.11, 36, 18);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5efe9,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframeMesh);

    // 5. Atmosphere Glow Shell
    const atmosphereGeometry = new THREE.SphereGeometry(2.26, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7e2a33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.35
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 6. Travel Arcs & City Pinpoints
    const cityCoords = [
      { lat: 40.7128, lng: -74.0060 }, // NYC
      { lat: 51.5074, lng: -0.1278 },  // London
      { lat: 48.8566, lng: 2.3522 },   // Paris
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
      { lat: 25.2048, lng: 55.2708 },  // Dubai
      { lat: -33.8688, lng: 151.2093 } // Sydney
    ];

    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Add City Pins
    cityCoords.forEach((city) => {
      const pos = convertLatLngToVector3(city.lat, city.lng, 2.12);
      const pinGeometry = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xf5efe9 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    // Add Flight Path Lines
    for (let i = 0; i < cityCoords.length - 1; i++) {
      const start = convertLatLngToVector3(cityCoords[i].lat, cityCoords[i].lng, 2.12);
      const end = convertLatLngToVector3(cityCoords[i + 1].lat, cityCoords[i + 1].lng, 2.12);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.65);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0xf5efe9, transparent: true, opacity: 0.65 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);
    }

    // 7. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5efe9, 1.25);
    dirLight1.position.set(5, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7e2a33, 0.85);
    dirLight2.position.set(-5, -4, -6);
    scene.add(dirLight2);

    // 8. Render Loop (NO auto-loop rotation! Scroll position drives rotation)
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handler
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

  // Update Globe Rotation & Zoom strictly driven by scroll position
  const maxScroll = 650;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  useEffect(() => {
    if (globeGroupRef.current) {
      // Scroll Down -> Rotate Right (+Y). Scroll Up -> Rotate Left (-Y).
      globeGroupRef.current.rotation.y = scrollProgress * Math.PI * 1.35;
    }
  }, [scrollProgress]);

  // Compute scale and displacement metrics
  const globeScale = 1 + scrollProgress * 0.75; // Zooms in from 1.0 to 1.75
  const elementsOpacity = Math.max(1 - scrollProgress * 1.6, 0);
  const elementsOutwardOffset = scrollProgress * 160;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '640px', overflow: 'visible' }}>
      
      {/* 3D WebGL Globe Canvas */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          transform: `scale(${globeScale})`,
          transition: 'transform 0.15s cubic-bezier(0.1, 0.5, 0.1, 1)',
          pointerEvents: 'none'
        }} 
      />

      {/* 3D TRAVEL ELEMENTS & TYPOGRAPHY BADGES (Scatter Outward on Scroll Down) */}
      
      {/* 1. Passport & Visa (Top Left) */}
      <motion.div 
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '8%',
          left: '5%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${-elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.4}px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Briefcase size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Passport & Visa</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Multi-Destination Verified</small>
        </div>
      </motion.div>

      {/* 2. Flight Routes & Airplane (Top Right) */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '12%',
          right: '5%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${elementsOutwardOffset}px, ${-elementsOutwardOffset * 0.4}px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Plane size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Flight Routes</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>NYC &rarr; PAR &rarr; TYO</small>
        </div>
      </motion.div>

      {/* 3. Camera & Sightseeing (Mid Left) */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '45%',
          left: '2%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${-elementsOutwardOffset * 1.2}px, 0px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Camera size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Activity Discovery</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Photos & Tours Catalog</small>
        </div>
      </motion.div>

      {/* 4. Compass Navigator (Mid Right) */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          top: '48%',
          right: '2%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${elementsOutwardOffset * 1.2}px, 0px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Compass size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Smart Navigator</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Automated Timelines</small>
        </div>
      </motion.div>

      {/* 5. Rain Check Forecast (Bottom Left) */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          bottom: '8%',
          left: '8%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${-elementsOutwardOffset}px, ${elementsOutwardOffset * 0.4}px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Sun size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Rain Check Alert</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>Weather Forecast Tracking</small>
        </div>
      </motion.div>

      {/* 6. Multi-Currency Split (Bottom Right) */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute p-3 rounded-4 d-flex align-items-center gap-3"
        style={{
          bottom: '10%',
          right: '8%',
          background: '#3e181c',
          border: '1.5px solid #63262c',
          opacity: elementsOpacity,
          transform: `translate(${elementsOutwardOffset}px, ${elementsOutwardOffset * 0.4}px)`,
          boxShadow: '0 16px 32px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        <div className="p-2.5 rounded-3" style={{ background: '#532328' }}>
          <Navigation size={22} style={{ color: '#f5efe9' }} />
        </div>
        <div>
          <div className="fw-bold small text-cream display-heading">Group Split & FX</div>
          <small style={{ color: '#cbb8ac', fontSize: '0.78rem' }}>USD, EUR, GBP, INR</small>
        </div>
      </motion.div>

    </div>
  );
}
