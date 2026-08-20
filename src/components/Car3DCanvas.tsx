import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HotspotPin } from '../types';
import { HOTSPOT_PINS } from '../data/mockData';
import { RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Car3DCanvasProps {
  vehicleName: string;
  vin: string;
}

export const Car3DCanvas: React.FC<Car3DCanvasProps> = ({ vehicleName, vin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activePin, setActivePin] = useState<HotspotPin | null>(null);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 360;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111316, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 2.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Clear previous canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xadc6ff, 3.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00dbe9, 4.0);
    cyanRimLight.position.set(-5, 3, -5);
    scene.add(cyanRimLight);

    const blueUnderglow = new THREE.PointLight(0x4b8eff, 4, 10);
    blueUnderglow.position.set(0, -0.2, 0);
    scene.add(blueUnderglow);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(16, 24, 0x4b8eff, 0x282a2d);
    gridHelper.position.y = -0.55;
    scene.add(gridHelper);

    // Vehicle Group
    const carGroup = new THREE.Group();

    // Procedural Sports Car Silhouette
    // Main Body Chassis
    const bodyGeometry = new THREE.BoxGeometry(3.6, 0.65, 1.7);
    // Bevel/Shape adjustments
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2229,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: wireframeMode,
    });
    const mainBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    mainBody.position.y = 0;
    carGroup.add(mainBody);

    // Cabin / Cockpit Roof
    const cabinGeometry = new THREE.CylinderGeometry(0.7, 0.95, 1.5, 6);
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0e11,
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
      wireframe: wireframeMode,
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.rotation.z = Math.PI / 2;
    cabin.rotation.y = Math.PI / 6;
    cabin.position.set(-0.2, 0.5, 0);
    cabin.scale.set(0.7, 1.4, 1.1);
    carGroup.add(cabin);

    // Aerodynamic Hood Nose
    const hoodGeometry = new THREE.ConeGeometry(1.0, 1.6, 5);
    const hoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x282d36,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: wireframeMode,
    });
    const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
    hood.rotation.z = -Math.PI / 2;
    hood.position.set(1.7, -0.05, 0);
    hood.scale.set(0.6, 1.0, 1.4);
    carGroup.add(hood);

    // Rear Diffuser & Wing
    const wingGeometry = new THREE.BoxGeometry(0.35, 0.05, 1.8);
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0x00dbe9,
      emissive: 0x004f54,
      metalness: 0.9,
    });
    const rearWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rearWing.position.set(-1.85, 0.6, 0);
    carGroup.add(rearWing);

    // Wing Struts
    const strutGeom = new THREE.BoxGeometry(0.06, 0.4, 0.06);
    const leftStrut = new THREE.Mesh(strutGeom, bodyMaterial);
    leftStrut.position.set(-1.8, 0.38, 0.45);
    const rightStrut = new THREE.Mesh(strutGeom, bodyMaterial);
    rightStrut.position.set(-1.8, 0.38, -0.45);
    carGroup.add(leftStrut);
    carGroup.add(rightStrut);

    // LED Headlights (Electric Blue glow)
    const ledGeom = new THREE.BoxGeometry(0.08, 0.1, 0.38);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x7df4ff });
    const leftLed = new THREE.Mesh(ledGeom, ledMat);
    leftLed.position.set(1.85, 0.12, 0.6);
    const rightLed = new THREE.Mesh(ledGeom, ledMat);
    rightLed.position.set(1.85, 0.12, -0.6);
    carGroup.add(leftLed);
    carGroup.add(rightLed);

    // Taillights (Neon Red bar)
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const tailGeom = new THREE.BoxGeometry(0.05, 0.08, 1.55);
    const tailLight = new THREE.Mesh(tailGeom, tailMat);
    tailLight.position.set(-1.86, 0.15, 0);
    carGroup.add(tailLight);

    // 4 Wheels & Performance Calipers
    const wheelGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x191c20,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: wireframeMode,
    });
    const caliperMat = new THREE.MeshBasicMaterial({ color: 0x00dbe9 });
    const caliperGeom = new THREE.BoxGeometry(0.12, 0.22, 0.1);

    const wheelPositions = [
      [1.1, -0.22, 0.85],
      [1.1, -0.22, -0.85],
      [-1.1, -0.22, 0.85],
      [-1.1, -0.22, -0.85],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, y, z);
      carGroup.add(wheel);

      const caliper = new THREE.Mesh(caliperGeom, caliperMat);
      caliper.position.set(x + 0.1, y + 0.1, z > 0 ? z - 0.08 : z + 0.08);
      carGroup.add(caliper);
    });

    scene.add(carGroup);
    camera.lookAt(0, 0, 0);
    setIs3DReady(true);

    // Mouse Interaction / Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      carGroup.rotation.y += deltaX * 0.008;
      carGroup.rotation.x = Math.max(-0.2, Math.min(0.4, carGroup.rotation.x + deltaY * 0.004));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        carGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [wireframeMode, isRotating]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-xl bg-[#14171b] border border-[#2E3238] overflow-hidden flex items-center justify-center shadow-[inset_0_2px_24px_rgba(0,0,0,0.6)]">
      {/* Background Radial Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#8b90a0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Left Status Badge */}
      <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-[#111316]/85 backdrop-blur border border-[#414755] px-3 py-1.5 rounded-full z-10">
        <span className="w-2 h-2 rounded-full bg-[#00dbe9] animate-pulse"></span>
        <span className="text-[11px] font-bold tracking-wider text-[#e2e2e6] font-mono">
          DIGITAL TWIN ONLINE
        </span>
      </div>

      {/* Interactive Hotspot Pins Overlaid */}
      <div className="absolute inset-0 pointer-events-none">
        {HOTSPOT_PINS.map((pin) => {
          const isSelected = activePin?.id === pin.id;
          return (
            <div
              key={pin.id}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group z-20"
            >
              <button
                id={`hotspot-pin-${pin.id}`}
                onClick={() => setActivePin(isSelected ? null : pin)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none transition-transform hover:scale-110 active:scale-95"
                title={pin.title}
              >
                <div
                  className={`absolute inset-0 rounded-full border-2 ${
                    pin.id === 'powertrain'
                      ? 'border-[#00dbe9] bg-[#00dbe9]/20'
                      : 'border-[#4b8eff] bg-[#4b8eff]/20'
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-full border ${
                    pin.id === 'powertrain' ? 'border-[#00dbe9]' : 'border-[#4b8eff]'
                  } pulse-ring`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    pin.id === 'powertrain' ? 'bg-[#00dbe9]' : 'bg-[#adc6ff]'
                  }`}
                />
              </button>

              {/* Pin Popover */}
              {(isSelected || undefined) && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 glass-panel rounded-lg p-3 z-30 shadow-xl border border-[#414755] animate-in fade-in zoom-in duration-150 pointer-events-auto">
                  <div className="flex items-center justify-between border-b border-[#2E3238] pb-1.5 mb-2">
                    <span className="text-[11px] font-bold text-[#00dbe9] tracking-wider uppercase">
                      {pin.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#00a0aa]/20 border border-[#00dbe9]/40 text-[#7df4ff] text-[10px] font-mono font-bold">
                      {pin.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#e2e2e6] font-medium mb-2">{pin.system}</div>
                  <div className="flex flex-col gap-1 text-[11px]">
                    {pin.details.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-[#c1c6d7]">
                        <span>{d.label}</span>
                        <span className="font-mono text-[#adc6ff] font-medium">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-[#0c0e11] via-[#0c0e11]/80 to-transparent flex justify-between items-end z-20 pointer-events-none">
        <div className="text-xs font-mono text-[#c1c6d7] pointer-events-auto flex items-center gap-2">
          <span>VIN:</span>
          <span className="text-[#e2e2e6] bg-[#1e2023] px-2 py-0.5 rounded border border-[#2E3238]">
            {vin}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            id="toggle-wireframe-btn"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`w-8 h-8 rounded border flex items-center justify-center transition-colors text-xs ${
              wireframeMode
                ? 'bg-[#4b8eff] text-[#00285c] border-[#4b8eff]'
                : 'bg-[#282a2d]/90 border-[#414755] text-[#e2e2e6] hover:text-[#adc6ff]'
            }`}
            title="Toggle Wireframe Shader"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            id="toggle-rotation-btn"
            onClick={() => setIsRotating(!isRotating)}
            className={`w-8 h-8 rounded border flex items-center justify-center transition-colors text-xs ${
              isRotating
                ? 'bg-[#282a2d]/90 border-[#414755] text-[#00dbe9]'
                : 'bg-[#282a2d]/90 border-[#414755] text-[#8b90a0]'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            id="quick-pin-reset-btn"
            onClick={() => setActivePin(activePin ? null : HOTSPOT_PINS[0])}
            className="w-8 h-8 rounded bg-[#282a2d]/90 border border-[#414755] flex items-center justify-center text-[#e2e2e6] hover:text-[#adc6ff] transition-colors"
            title="Inspect Powertrain Pin"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
