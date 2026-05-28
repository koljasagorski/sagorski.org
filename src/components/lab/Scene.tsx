"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import {
  labStore, ACTS, blendActs, smoothstep,
  SOURCES, TARGETS_GLOBAL, TARGET_LAT, TARGET_LNG, latLngToVec3,
} from "@/lib/lab";

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerp3(a: readonly number[], b: readonly number[], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function lerpColor(out: THREE.Color, hexA: string, hexB: string, t: number) {
  tmpA.set(hexA); tmpB.set(hexB);
  out.set(
    lerp(tmpA.r, tmpB.r, t),
    lerp(tmpA.g, tmpB.g, t),
    lerp(tmpA.b, tmpB.b, t),
  );
}

// ---- Shared mutable scene state (no React re-renders) ----
type SceneState = {
  cam: [number, number, number];
  globeSpinRate: number;
  atmoColor: THREE.Color;
  atmoIntensity: number;
  arcCount: number;
  arcColor: THREE.Color;
  arcSpeed: number;
  arcFocus: "global" | "frankfurt";
  shieldOpacity: number;
  shieldScale: number;
  exfilIntensity: number;
  targetIntensity: number;
};
function initialSceneState(): SceneState {
  const a = ACTS[0];
  return {
    cam: [...a.camPos] as [number, number, number],
    globeSpinRate: a.globeSpin,
    atmoColor: new THREE.Color(a.atmoColor),
    atmoIntensity: a.atmoIntensity,
    arcCount: a.arcsTarget,
    arcColor: new THREE.Color(a.arcColor),
    arcSpeed: a.arcSpeed,
    arcFocus: a.arcFocus,
    shieldOpacity: a.shieldOpacity,
    shieldScale: a.shieldScale,
    exfilIntensity: a.exfilIntensity,
    targetIntensity: a.targetIntensity,
  };
}

function StateBlender({ ref: stateRef }: { ref: React.MutableRefObject<SceneState> }) {
  useFrame(() => {
    const { from, to, t } = blendActs(labStore.total);
    const s = smoothstep(t);
    const a = ACTS[from], b = ACTS[to];
    const st = stateRef.current;
    st.cam = lerp3(a.camPos, b.camPos, s);
    st.globeSpinRate = lerp(a.globeSpin, b.globeSpin, s);
    lerpColor(st.atmoColor, a.atmoColor, b.atmoColor, s);
    st.atmoIntensity = lerp(a.atmoIntensity, b.atmoIntensity, s);
    st.arcCount = lerp(a.arcsTarget, b.arcsTarget, s);
    lerpColor(st.arcColor, a.arcColor, b.arcColor, s);
    st.arcSpeed = lerp(a.arcSpeed, b.arcSpeed, s);
    st.arcFocus = s < 0.5 ? a.arcFocus : b.arcFocus;
    st.shieldOpacity = lerp(a.shieldOpacity, b.shieldOpacity, s);
    st.shieldScale = lerp(a.shieldScale, b.shieldScale, s);
    st.exfilIntensity = lerp(a.exfilIntensity, b.exfilIntensity, s);
    st.targetIntensity = lerp(a.targetIntensity, b.targetIntensity, s);
  });
  return null;
}

function CameraRig({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const camera = useThree(s => s.camera);
  useFrame(() => {
    const c = stateRef.current.cam;
    camera.position.set(c[0], c[1], c[2]);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Earth({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const tex = useTexture("/lab/earth-dark.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  useFrame((_, dt) => {
    if (!meshRef.current) return;
    angle.current += stateRef.current.globeSpinRate * dt;
    meshRef.current.rotation.y = angle.current;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial
        map={tex}
        emissive={new THREE.Color("#0e1f33")}
        emissiveIntensity={0.25}
        roughness={0.92}
        metalness={0.04}
      />
    </mesh>
  );
}

function Atmosphere({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color("#5ab2e6") },
    uIntensity: { value: 0.5 },
  }), []);
  useFrame(() => {
    uniforms.uColor.value.copy(stateRef.current.atmoColor);
    uniforms.uIntensity.value = stateRef.current.atmoIntensity;
  });
  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
        vertexShader={`
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float rim = 1.0 - max(dot(vN, vV), 0.0);
            rim = pow(rim, 3.5);
            gl_FragColor = vec4(uColor * rim * uIntensity * 1.6, rim * uIntensity * 0.9);
          }
        `}
      />
    </mesh>
  );
}

// ---- Arcs ----
type ArcSlot = {
  geom: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  obj: THREE.Line;
  active: boolean;
  progress: number;
  duration: number;
};
const ARC_POOL = 60;
const ARC_SEGMENTS = 64;

function pickPair(focus: "global" | "frankfurt"): [THREE.Vector3, THREE.Vector3] {
  const s = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  let tgt: [number, number];
  if (focus === "frankfurt") {
    tgt = Math.random() < 0.78 ? [TARGET_LAT, TARGET_LNG] : TARGETS_GLOBAL[Math.floor(Math.random() * TARGETS_GLOBAL.length)];
  } else {
    tgt = TARGETS_GLOBAL[Math.floor(Math.random() * TARGETS_GLOBAL.length)];
  }
  return [latLngToVec3(s[0], s[1], 1), latLngToVec3(tgt[0], tgt[1], 1)];
}

function rebuildArc(geom: THREE.BufferGeometry, start: THREE.Vector3, end: THREE.Vector3) {
  const angle = start.angleTo(end);
  const alt = 0.18 + 0.42 * (angle / Math.PI);
  const midDir = new THREE.Vector3().addVectors(start, end);
  if (midDir.length() < 1e-3) midDir.set(0, 1, 0); else midDir.normalize();
  const mid = midDir.multiplyScalar(1 + alt);
  const curve = new THREE.QuadraticBezierCurve3(start.clone(), mid, end.clone());
  const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  for (let i = 0; i < ARC_SEGMENTS; i++) {
    const t = i / (ARC_SEGMENTS - 1);
    const p = curve.getPoint(t);
    arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z;
  }
  posAttr.needsUpdate = true;
}

function Arcs({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const slots = useMemo<ArcSlot[]>(() => {
    return Array.from({ length: ARC_POOL }, () => {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(ARC_SEGMENTS * 3);
      const ts = new Float32Array(ARC_SEGMENTS);
      for (let i = 0; i < ARC_SEGMENTS; i++) ts[i] = i / (ARC_SEGMENTS - 1);
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color("#ff5a3a") },
          uProgress: { value: 0 },
          uTail: { value: 0.32 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          attribute float aT;
          varying float vT;
          void main() {
            vT = aT;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uProgress;
          uniform float uTail;
          uniform float uOpacity;
          varying float vT;
          void main() {
            float behind = uProgress - vT;
            // body: vT in [progress - tail, progress]
            float bodyMask = step(0.0, behind) * (1.0 - step(uTail, behind));
            float bodyFade = bodyMask * smoothstep(0.0, 0.12, behind) * (1.0 - smoothstep(uTail * 0.65, uTail, behind));
            // head halo (small region around head)
            float headDist = abs(behind);
            float head = exp(-headDist * 18.0);
            float a = (bodyFade * 0.95 + head * 1.2) * uOpacity;
            vec3 col = uColor * (1.4 + head * 1.8);
            gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
          }
        `,
      });
      const obj = new THREE.Line(geom, material);
      obj.frustumCulled = false;
      return { geom, material, obj, active: false, progress: 0, duration: 1.6 };
    });
  }, []);

  useEffect(() => {
    return () => {
      slots.forEach(s => {
        s.geom.dispose();
        s.material.dispose();
      });
    };
  }, [slots]);

  useFrame((_, dt) => {
    const cfg = stateRef.current;
    const want = Math.max(0, Math.round(cfg.arcCount));
    let active = 0;
    for (let i = 0; i < slots.length; i++) if (slots[i].active) active++;
    for (let i = 0; i < slots.length && active < want; i++) {
      const s = slots[i];
      if (s.active) continue;
      const [src, tgt] = pickPair(cfg.arcFocus);
      rebuildArc(s.geom, src, tgt);
      s.active = true;
      s.progress = -0.06;
      s.duration = 1.5 / Math.max(0.4, cfg.arcSpeed) * (0.8 + Math.random() * 0.5);
      active++;
    }
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const m = s.material;
      if (!s.active) {
        m.uniforms.uOpacity.value = 0;
        continue;
      }
      s.progress += dt / s.duration;
      if (s.progress >= 1.18) {
        s.active = false;
        m.uniforms.uOpacity.value = 0;
        continue;
      }
      m.uniforms.uProgress.value = Math.max(0, Math.min(1.0, s.progress));
      // fade in/out at edges
      const p = s.progress;
      const opacity = p < 0.05 ? p / 0.05 : p > 0.95 ? Math.max(0, 1 - (p - 0.95) / 0.23) : 1;
      m.uniforms.uOpacity.value = opacity;
      m.uniforms.uColor.value.copy(cfg.arcColor);
    }
  });

  return (
    <>
      {slots.map((s, i) => (
        <primitive key={i} object={s.obj} />
      ))}
    </>
  );
}

// ---- Shield ----
function Shield({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color("#1d9e75") },
    uOpacity: { value: 0 },
    uTime: { value: 0 },
  }), []);
  useFrame((_, dt) => {
    uniforms.uOpacity.value = stateRef.current.shieldOpacity;
    uniforms.uTime.value += dt;
    if (meshRef.current) meshRef.current.scale.setScalar(stateRef.current.shieldScale);
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.09, 3]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        wireframe
        vertexShader={`
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uTime;
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float rim = 1.0 - max(dot(vN, vV), 0.0);
            float pulse = 0.75 + 0.25 * sin(uTime * 1.6);
            float a = (0.85 + rim * 0.4) * pulse * uOpacity;
            gl_FragColor = vec4(uColor * (1.6 + rim * 1.4) * pulse, a);
          }
        `}
      />
    </mesh>
  );
}

// ---- Target marker (Frankfurt ring) ----
function TargetMarker({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pos, quat } = useMemo(() => {
    const p = latLngToVec3(TARGET_LAT, TARGET_LNG, 1.001);
    const dir = p.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    return { pos: p, quat: q };
  }, []);
  const uniforms = useMemo(() => ({
    uIntensity: { value: 0 },
    uTime: { value: 0 },
  }), []);
  useFrame((_, dt) => {
    uniforms.uIntensity.value = stateRef.current.targetIntensity;
    uniforms.uTime.value += dt;
  });
  return (
    <group ref={groupRef} position={[pos.x, pos.y, pos.z]} quaternion={[quat.x, quat.y, quat.z, quat.w]}>
      <mesh>
        <ringGeometry args={[0.025, 0.06, 48]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uIntensity;
            uniform float uTime;
            varying vec2 vUv;
            void main() {
              float pulse = 0.55 + 0.45 * sin(uTime * 3.0);
              float r = length(vUv - 0.5) * 2.0;
              gl_FragColor = vec4(1.0, 0.34, 0.12, uIntensity * pulse * (1.0 - r * 0.5));
            }
          `}
        />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.012, 24]} />
        <meshBasicMaterial
          color="#ffd6c4"
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ---- Exfil particles (Akt 3) ----
function Exfil({ stateRef }: { stateRef: React.MutableRefObject<SceneState> }) {
  const N = 110;
  const { base, tangentA, tangentB } = useMemo(() => {
    const pos = latLngToVec3(TARGET_LAT, TARGET_LNG, 1);
    const up = pos.clone().normalize();
    // build orthonormal tangents
    const helper = Math.abs(up.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const tangentA = new THREE.Vector3().crossVectors(up, helper).normalize();
    const tangentB = new THREE.Vector3().crossVectors(up, tangentA).normalize();
    return { base: pos, tangentA, tangentB };
  }, []);
  const particles = useRef<Array<{ t: number; vx: number; vy: number; vz: number }>>(
    Array.from({ length: N }, () => ({ t: -Math.random() * 2, vx: 0, vy: 0, vz: 0 }))
  );
  const positions = useMemo(() => new Float32Array(N * 3), [N]);
  const sizes = useMemo(() => new Float32Array(N), [N]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#ff5a3a") },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSize;
      varying float vSize;
      void main() {
        vSize = aSize;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * 220.0 / -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vSize;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c);
        if (r > 0.5) discard;
        float a = pow(1.0 - r * 2.0, 1.5) * uOpacity;
        gl_FragColor = vec4(uColor * (1.8 + (1.0 - r * 2.0)), a);
      }
    `,
  }), []);

  useEffect(() => () => { geom.dispose(); material.dispose(); }, [geom, material]);

  useFrame((_, dt) => {
    const intensity = stateRef.current.exfilIntensity;
    material.uniforms.uOpacity.value = intensity;
    if (intensity < 0.01) {
      for (let i = 0; i < N; i++) sizes[i] = 0;
      geom.attributes.aSize.needsUpdate = true;
      return;
    }
    const up = base.clone().normalize();
    for (let i = 0; i < N; i++) {
      const p = particles.current[i];
      p.t += dt;
      if (p.t < 0) {
        sizes[i] = 0;
        continue;
      }
      if (p.t > 2.2) {
        // respawn with new direction
        p.t = -Math.random() * 0.3;
        const ax = (Math.random() - 0.5) * 0.5;
        const ay = (Math.random() - 0.5) * 0.5;
        p.vx = up.x + tangentA.x * ax + tangentB.x * ay;
        p.vy = up.y + tangentA.y * ax + tangentB.y * ay;
        p.vz = up.z + tangentA.z * ax + tangentB.z * ay;
        const len = Math.hypot(p.vx, p.vy, p.vz);
        p.vx /= len; p.vy /= len; p.vz /= len;
        sizes[i] = 0;
        continue;
      }
      const r = 1.0 + p.t * 0.55;
      positions[i * 3] = p.vx * r;
      positions[i * 3 + 1] = p.vy * r;
      positions[i * 3 + 2] = p.vz * r;
      const life = p.t / 2.2;
      sizes[i] = (1 - life) * 0.05 * intensity;
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.aSize.needsUpdate = true;
  });

  return <points geometry={geom} material={material} />;
}

// ---- Stars background ----
function Stars() {
  const COUNT = 1200;
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // points on a far sphere
      const r = 30 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  const material = useMemo(() => new THREE.PointsMaterial({
    size: 0.06,
    sizeAttenuation: true,
    color: "#e8e8f5",
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  }), []);
  useEffect(() => () => { geom.dispose(); material.dispose(); }, [geom, material]);
  return <points geometry={geom} material={material} />;
}

// ---- Top-level Scene ----
export function Scene({ mobile }: { mobile: boolean }) {
  const stateRef = useRef<SceneState>(initialSceneState());
  return (
    <Canvas
      className="lab2-canvas"
      camera={{ position: ACTS[0].camPos, fov: 38, near: 0.1, far: 100 }}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color("#04060a"));
        scene.fog = new THREE.FogExp2("#04060a", 0.005);
      }}
    >
      <StateBlender ref={stateRef} />
      <CameraRig stateRef={stateRef} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} />
      <directionalLight position={[-4, -1, -2]} intensity={0.25} color="#6088b8" />

      <Stars />
      <Earth stateRef={stateRef} />
      <Atmosphere stateRef={stateRef} />
      <Arcs stateRef={stateRef} />
      <Exfil stateRef={stateRef} />
      <Shield stateRef={stateRef} />
      <TargetMarker stateRef={stateRef} />

      {!mobile && (
        <EffectComposer>
          <Bloom intensity={1.05} luminanceThreshold={0.35} luminanceSmoothing={0.45} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
