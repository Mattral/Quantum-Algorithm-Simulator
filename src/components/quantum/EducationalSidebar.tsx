import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantumEngine } from '@/utils/quantum/QuantumEngine';
import { BookOpen, Zap, Target, Atom, Cpu, Lock, Lightbulb } from 'lucide-react';

interface EducationalSidebarProps {
  selectedGate: string | null;
  quantumEngine: QuantumEngine;
}

const GATE_INFORMATION = {
  'X': {
    name: 'Pauli-X Gate (Quantum NOT)',
    description: 'The X gate is like a quantum "flip switch". If your qubit is pointing up (|0⟩), it flips it to point down (|1⟩), and vice versa. It\'s the quantum version of the NOT gate you might know from regular computers.',
    matrix: '[[0, 1], [1, 0]]',
    effect: 'Flips the qubit: |0⟩ becomes |1⟩, and |1⟩ becomes |0⟩',
    realWorld: 'Used in quantum error correction, like fixing typos in quantum information.',
    analogy: 'Like flipping a light switch - if it\'s ON, turn it OFF, and if it\'s OFF, turn it ON.',
    applications: ['Quantum error correction', 'State preparation', 'Creating NOT operations']
  },
  'Y': {
    name: 'Pauli-Y Gate',
    description: 'The Y gate is more complex - it both flips the qubit AND adds a phase (like adding a twist). Think of it as flipping a coin while also spinning it.',
    matrix: '[[0, -i], [i, 0]]',
    effect: 'Flips the qubit and adds a phase: |0⟩ → i|1⟩, |1⟩ → -i|0⟩',
    realWorld: 'Used in quantum algorithms that need precise control over both amplitude and phase.',
    analogy: 'Like flipping a coin while also giving it a spin - it changes both the face and the rotation.',
    applications: ['Complex quantum rotations', 'Quantum algorithms', 'Phase manipulation']
  },
  'Z': {
    name: 'Pauli-Z Gate (Phase Flip)',
    description: 'The Z gate is sneaky - it leaves |0⟩ alone but adds a "minus sign" to |1⟩. You can\'t see this change directly, but it affects how qubits interfere with each other.',
    matrix: '[[1, 0], [0, -1]]',
    effect: 'Leaves |0⟩ unchanged, but flips the phase of |1⟩: |1⟩ → -|1⟩',
    realWorld: 'Critical for quantum interference effects and conditional operations.',
    analogy: 'Like putting a "negative" stamp on |1⟩ - it looks the same but behaves differently in combinations.',
    applications: ['Phase operations', 'Quantum interference', 'Conditional logic']
  },
  'H': {
    name: 'Hadamard Gate (Superposition Creator)',
    description: 'The H gate is the "magic" of quantum computing! It puts a qubit into superposition - a state where it\'s both |0⟩ AND |1⟩ at the same time. This is what gives quantum computers their power.',
    matrix: '(1/√2)[[1, 1], [1, -1]]',
    effect: 'Creates superposition: |0⟩ → (|0⟩ + |1⟩)/√2, making the qubit "both states at once"',
    realWorld: 'Essential for quantum search algorithms and quantum key distribution.',
    analogy: 'Like spinning a coin so fast it\'s both heads AND tails simultaneously until it stops.',
    applications: ['Creating superposition', 'Quantum search (Grover\'s)', 'Quantum cryptography']
  },
  'S': {
    name: 'S Gate (Quarter Phase)',
    description: 'The S gate applies a 90-degree phase rotation to the |1⟩ state. Think of it as giving the qubit a quarter-turn twist.',
    matrix: '[[1, 0], [0, i]]',
    effect: 'Adds a 90° phase to |1⟩: |1⟩ → i|1⟩',
    realWorld: 'Used in quantum Fourier transforms and precise quantum control.',
    analogy: 'Like turning a dial by one quarter - same position but different orientation.',
    applications: ['Quantum Fourier Transform', 'Phase control', 'Algorithm building blocks']
  },
  'T': {
    name: 'T Gate (Eighth Phase)',
    description: 'The T gate applies a 45-degree phase rotation - half of what the S gate does. It\'s used for very precise quantum operations.',
    matrix: '[[1, 0], [0, e^(iπ/4)]]',
    effect: 'Adds a 45° phase to |1⟩',
    realWorld: 'Essential for fault-tolerant quantum computing and universal gate sets.',
    analogy: 'Like making a very precise small adjustment to a dial - fine-tuning the quantum state.',
    applications: ['Fault-tolerant computing', 'Universal gate sets', 'Precise phase control']
  },
  'CNOT': {
    name: 'Controlled-NOT (Entanglement Creator)',
    description: 'The CNOT gate creates "entanglement" - a special quantum connection between qubits. It flips the second qubit ONLY if the first qubit is |1⟩. This is how qubits become "spookily connected"!',
    matrix: '[[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]',
    effect: 'If control qubit is |1⟩, flip the target. If control is |0⟩, do nothing.',
    realWorld: 'The foundation of quantum teleportation and quantum error correction.',
    analogy: 'Like a smart light switch - it only turns on the second light if the first light is already on.',
    applications: ['Creating entanglement', 'Quantum teleportation', 'Quantum error correction']
  }
};

const QUANTUM_CONCEPTS = [
  {
    title: 'Superposition',
    icon: <Zap className="w-4 h-4" />,
    description: 'A qubit can be in multiple states at once - like a spinning coin that\'s both heads AND tails!',
    example: 'When you apply an H gate, the qubit enters superposition.',
    realWorld: 'This allows quantum computers to try many solutions simultaneously.'
  },
  {
    title: 'Entanglement',
    icon: <Target className="w-4 h-4" />,
    description: 'Qubits can become "connected" so measuring one instantly affects the other, no matter how far apart they are.',
    example: 'Use H gate on qubit 0, then CNOT between qubits 0 and 1.',
    realWorld: 'Einstein called this "spooky action at a distance" - it enables quantum teleportation!'
  },
  {
    title: 'Measurement',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'When you "look" at a quantum state, it randomly picks one definite value and "collapses" to that state.',
    example: 'A superposition qubit will randomly become either |0⟩ or |1⟩ when measured.',
    realWorld: 'This randomness is true randomness - not just hidden information!'
  }
];

const QUANTUM_APPLICATIONS = [
  {
    title: 'Quantum Cryptography',
    icon: <Lock className="w-4 h-4" />,
    description: 'Ultra-secure communication using quantum properties',
    example: 'Banks might use this for unhackable transactions'
  },
  {
    title: 'Drug Discovery',
    icon: <Atom className="w-4 h-4" />,
    description: 'Simulating molecular interactions to find new medicines',
    example: 'Finding COVID treatments faster than ever before'
  },
  {
    title: 'AI & Optimization',
    icon: <Cpu className="w-4 h-4" />,
    description: 'Solving complex problems that would take classical computers centuries',
    example: 'Optimizing traffic flow in entire cities'
  }
];

export const EducationalSidebar: React.FC<EducationalSidebarProps> = ({
  selectedGate,
  quantumEngine
}) => {
  const gateInfo = selectedGate ? GATE_INFORMATION[selectedGate as keyof typeof GATE_INFORMATION] : null;

  return (
    <div className="h-full space-y-3 md:space-y-4">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <div className="p-3 md:p-4">
          <h2 className="text-base md:text-lg font-semibold text-white mb-4">
            {gateInfo ? 'Gate Information' : 'Quantum Learning Guide'}
          </h2>
          
          {gateInfo ? (
            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2 text-xs">{gateInfo.name}</Badge>
                <p className="text-sm text-gray-300 leading-relaxed">{gateInfo.description}</p>
              </div>
              
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">What it does:</h4>
                <p className="text-xs text-gray-400">{gateInfo.effect}</p>
              </div>
              
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                <h4 className="text-sm font-medium text-blue-300 mb-2">Real-world analogy:</h4>
                <p className="text-xs text-blue-200">{gateInfo.analogy}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Matrix (for advanced students):</h4>
                <code className="text-xs bg-slate-700 p-2 rounded block text-purple-300 font-mono">
                  {gateInfo.matrix}
                </code>
              </div>
              
              <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <h4 className="text-sm font-medium text-green-300 mb-2">Why is this useful?</h4>
                <p className="text-xs text-green-200 mb-2">{gateInfo.realWorld}</p>
                <ul className="text-xs text-green-200 space-y-1">
                  {gateInfo.applications.map((app, index) => (
                    <li key={index}>• {app}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                <p className="text-sm text-purple-200">
                  👋 Welcome! Click on any gate to learn about it in detail. Start with the <span className="font-mono bg-purple-600/30 px-1 rounded">H</span> gate to see quantum magic in action!
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Core Quantum Concepts
                </h3>
                <div className="space-y-3">
                  {QUANTUM_CONCEPTS.map((concept, index) => (
                    <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="text-purple-400 mt-0.5">{concept.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{concept.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{concept.description}</p>
                          <p className="text-xs text-blue-300 mt-1"><strong>Try:</strong> {concept.example}</p>
                          <p className="text-xs text-green-300 mt-1"><strong>Impact:</strong> {concept.realWorld}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Real-world Applications Card */}
      {!gateInfo && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
          <div className="p-3 md:p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Why Learn Quantum Computing?
            </h3>
            <div className="space-y-3">
              {QUANTUM_APPLICATIONS.map((app, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 rounded-lg border border-blue-500/20">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-400 mt-0.5">{app.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{app.title}</h4>
                      <p className="text-xs text-gray-300 mt-1">{app.description}</p>
                      <p className="text-xs text-blue-300 mt-1"><strong>Example:</strong> {app.example}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
