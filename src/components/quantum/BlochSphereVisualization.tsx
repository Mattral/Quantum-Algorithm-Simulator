
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { QuantumEngine } from '@/utils/quantum/QuantumEngine';

interface BlochSphereProps {
  quantumEngine: QuantumEngine;
  qubitIndex: number;
}

const BlochSphere: React.FC<BlochSphereProps> = ({ quantumEngine, qubitIndex }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const vectorRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (vectorRef.current) {
      // Get qubit state and update Bloch vector
      const qubitState = quantumEngine.getQubitState(qubitIndex);
      const { alpha, beta } = qubitState;
      
      // Calculate Bloch vector coordinates
      const x = 2 * (alpha.real * beta.real + alpha.imag * beta.imag);
      const y = 2 * (alpha.imag * beta.real - alpha.real * beta.imag);
      const z = alpha.magnitude() ** 2 - beta.magnitude() ** 2;
      
      // Update vector position
      vectorRef.current.position.set(x, y, z);
      vectorRef.current.lookAt(x * 2, y * 2, z * 2);
    }
  });

  const points = [];
  // X axis
  points.push(new THREE.Vector3(-1.2, 0, 0));
  points.push(new THREE.Vector3(1.2, 0, 0));
  
  const yPoints = [];
  // Y axis
  yPoints.push(new THREE.Vector3(0, -1.2, 0));
  yPoints.push(new THREE.Vector3(0, 1.2, 0));
  
  const zPoints = [];
  // Z axis
  zPoints.push(new THREE.Vector3(0, 0, -1.2));
  zPoints.push(new THREE.Vector3(0, 0, 1.2));

  return (
    <group>
      {/* Bloch Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color="#4338ca" 
          transparent 
          opacity={0.3} 
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          wireframe 
          transparent 
          opacity={0.4}
        />
      </mesh>

      {/* Coordinate axes */}
      <Line points={points} color="#ef4444" lineWidth={2} />
      <Line points={yPoints} color="#22c55e" lineWidth={2} />
      <Line points={zPoints} color="#3b82f6" lineWidth={2} />

      {/* Axis labels */}
      <Text position={[1.3, 0, 0]} fontSize={0.2} color="#ef4444">X</Text>
      <Text position={[0, 1.3, 0]} fontSize={0.2} color="#22c55e">Y</Text>
      <Text position={[0, 0, 1.3]} fontSize={0.2} color="#3b82f6">Z</Text>
      <Text position={[0, 0, -1.3]} fontSize={0.2} color="#94a3b8">|1⟩</Text>
      <Text position={[0, 0, 1.3]} fontSize={0.2} color="#94a3b8">|0⟩</Text>

      {/* State vector */}
      <group ref={vectorRef}>
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshPhongMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, 0, 1]}>
          <coneGeometry args={[0.05, 0.1]} />
          <meshPhongMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
};

interface BlochSphereVisualizationProps {
  quantumEngine: QuantumEngine;
}

export const BlochSphereVisualization: React.FC<BlochSphereVisualizationProps> = ({ 
  quantumEngine 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[0, 1, 2].map((qubitIndex) => (
        <div key={qubitIndex} className="h-32">
          <div className="text-xs text-gray-400 mb-1">Qubit {qubitIndex}</div>
          <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <BlochSphere quantumEngine={quantumEngine} qubitIndex={qubitIndex} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>
      ))}
    </div>
  );
};
