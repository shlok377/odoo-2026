import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const globeGroupRef = useRef(null);
  const sideElementsGroupRef = useRef(null);
  const sideElementsMeshesRef = useRef([]);

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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Main 3D Globe Group (Tilted 23.5 degrees to the right)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.41; // Right-tilted axis
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Side 3D Travel Elements Group
    const sideElementsGroup = new THREE.Group();
    scene.add(sideElementsGroup);
    sideElementsGroupRef.current = sideElementsGroup;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xf5efe9, 1.4);
    mainLight.position.set(5, 6, 7);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x7e2a33, 0.9);
    fillLight.position.set(-5, -4, -6);
    scene.add(fillLight);

    // 5. GLTF Loader for Real 3D (.glb) Models from /models
    const loader = new GLTFLoader();

    // A. Load Real 3D Earth Model (`earth.glb`)
    loader.load('/models/earth.glb', (gltf) => {
      const earthModel = gltf.scene;
      
      // Auto-center and normalize scale
      const box = new THREE.Box3().setFromObject(earthModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 4.2 / maxDim; // Normalized radius
      earthModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Preserve original Google Poly textures & materials
      earthModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });

      globeGroup.add(earthModel);
    }, undefined, (err) => {
      console.warn('Fallback sphere for Earth model:', err);
      // Fallback Sphere if GLB loading fails
      const fallbackGeo = new THREE.SphereGeometry(2.1, 64, 64);
      const fallbackMat = new THREE.MeshPhongMaterial({ color: 0x532328, specular: 0xf5efe9, shininess: 20 });
      globeGroup.add(new THREE.Mesh(fallbackGeo, fallbackMat));
    });

    // Atmosphere Glow Shell around 3D Earth
    const atmosphereGeo = new THREE.SphereGeometry(2.16, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x7e2a33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    });
    globeGroup.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // B. Load Real 3D Side Travel Models (Compass, Island, Pin, Paper Plane, Palm Tree)
    const modelConfigs = [
      { url: '/models/compass.glb', initialPos: [-3.4, 1.4, 0.5], baseScale: 0.8, rotSpeed: 0.01, dir: [-1, 0.4] },
      { url: '/models/plane.glb', initialPos: [3.5, 1.6, 0.6], baseScale: 0.7, rotSpeed: -0.012, dir: [1, 0.4] },
      { url: '/models/pin.glb', initialPos: [-3.8, -1.2, 0.4], baseScale: 0.6, rotSpeed: 0.008, dir: [-1.2, -0.3] },
      { url: '/models/island.glb', initialPos: [3.8, -1.4, 0.3], baseScale: 0.9, rotSpeed: -0.006, dir: [1.2, -0.3] },
      { url: '/models/palmtree.glb', initialPos: [0, 2.6, 0.2], baseScale: 0.45, rotSpeed: 0.005, dir: [0, 0.8] }
    ];

    const loadedSideMeshes = [];

    modelConfigs.forEach((cfg, idx) => {
      loader.load(cfg.url, (gltf) => {
        const model = gltf.scene;
        
        // Normalize size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const s = (cfg.baseScale * 1.5) / maxDim;
          model.scale.set(s, s, s);
        }

        model.position.set(...cfg.initialPos);
        sideElementsGroup.add(model);

        loadedSideMeshes.push({
          mesh: model,
          initialPos: new THREE.Vector3(...cfg.initialPos),
          dir: cfg.dir,
          rotSpeed: cfg.rotSpeed,
          seed: idx * 1.5
        });
      });
    });

    sideElementsMeshesRef.current = loadedSideMeshes;

    // 6. Animation Loop (Smooth Floating Levitation)
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Levitating float for 3D side elements
      sideElementsMeshesRef.current.forEach((item) => {
        if (item.mesh) {
          item.mesh.rotation.y += item.rotSpeed;
          item.mesh.position.y = item.initialPos.y + Math.sin(elapsedTime * 1.8 + item.seed) * 0.12;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Listener
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

  // Scroll Down -> Rotate Right (+Y). Scroll Up -> Rotate Left (-Y).
  useEffect(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = scrollProgress * Math.PI * 1.25;
    }

    // Scroll Down -> 3D Side Models Move Outward to the Sides in 3D Space (NO FADING!)
    sideElementsMeshesRef.current.forEach((item) => {
      if (item.mesh) {
        const offset = scrollProgress * 3.2; // Move outward horizontally
        item.mesh.position.x = item.initialPos.x + item.dir[0] * offset;
        item.mesh.position.y = item.initialPos.y + item.dir[1] * offset * 0.4;
      }
    });
  }, [scrollProgress]);

  // Clamped Zoom Scale for 3D Earth Globe
  const globeScale = 1 + scrollProgress * 0.35;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '580px', overflow: 'hidden' }}>
      
      {/* Real 3D WebGL Canvas displaying .glb models */}
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

    </div>
  );
}
