
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpTooltip } from './HelpTooltip';
import { QuantumEngine } from '@/utils/quantum/QuantumEngine';
import { Trash2, Plus } from 'lucide-react';

interface CircuitEditorProps {
  quantumEngine: QuantumEngine;
  onGateSelect: (gate: string | null) => void;
  selectedGate: string | null;
}

const QUANTUM_GATES = [
  { 
    name: 'X', 
    color: 'bg-red-500', 
    description: 'Pauli-X (NOT) Gate',
    help: 'The X gate flips a qubit: |0⟩ becomes |1⟩ and |1⟩ becomes |0⟩. Think of it as a quantum NOT gate.',
    formula: '[[0, 1], [1, 0]]',
    example: 'X|0⟩ = |1⟩'
  },
  { 
    name: 'Y', 
    color: 'bg-green-500', 
    description: 'Pauli-Y Gate',
    help: 'The Y gate combines a bit flip with a phase flip. It rotates the qubit around the Y-axis on the Bloch sphere.',
    formula: '[[0, -i], [i, 0]]',
    example: 'Y|0⟩ = i|1⟩'
  },
  { 
    name: 'Z', 
    color: 'bg-blue-500', 
    description: 'Pauli-Z Gate',
    help: 'The Z gate adds a phase of -1 to the |1⟩ state while leaving |0⟩ unchanged. This changes the quantum phase.',
    formula: '[[1, 0], [0, -1]]',
    example: 'Z|1⟩ = -|1⟩'
  },
  { 
    name: 'H', 
    color: 'bg-purple-500', 
    description: 'Hadamard Gate',
    help: 'The Hadamard gate creates superposition! It puts a qubit in an equal mixture of |0⟩ and |1⟩ states.',
    formula: '(1/√2)[[1, 1], [1, -1]]',
    example: 'H|0⟩ = (|0⟩ + |1⟩)/√2'
  },
  { 
    name: 'S', 
    color: 'bg-yellow-500', 
    description: 'S Gate (Phase)',
    help: 'The S gate applies a 90° phase rotation to the |1⟩ state. It\'s like a quarter turn around the Z-axis.',
    formula: '[[1, 0], [0, i]]',
    example: 'S|1⟩ = i|1⟩'
  },
  { 
    name: 'T', 
    color: 'bg-pink-500', 
    description: 'T Gate',
    help: 'The T gate applies a 45° phase rotation to the |1⟩ state. It\'s useful for creating precise quantum states.',
    formula: '[[1, 0], [0, e^(iπ/4)]]',
    example: 'T gates are often used in quantum algorithms'
  },
  { 
    name: 'CNOT', 
    color: 'bg-orange-500', 
    description: 'Controlled-NOT',
    help: 'CNOT creates entanglement! It flips the target qubit only if the control qubit is |1⟩. This is how qubits become "connected".',
    formula: '[[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]',
    example: 'CNOT|10⟩ = |11⟩, CNOT|00⟩ = |00⟩'
  },
];

export const CircuitEditor: React.FC<CircuitEditorProps> = ({
  quantumEngine,
  onGateSelect,
  selectedGate
}) => {
  const [numQubits, setNumQubits] = useState(3);
  const [circuitSteps, setCircuitSteps] = useState<any[][]>([[], [], []]);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const maxSteps = 8;

  const handleGateClick = (gateName: string) => {
    onGateSelect(gateName === selectedGate ? null : gateName);
  };

  const handleDragStart = (e: React.DragEvent, gateName: string) => {
    setDraggedGate(gateName);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, qubit: number, step: number) => {
    e.preventDefault();
    if (draggedGate) {
      const newSteps = [...circuitSteps];
      if (!newSteps[qubit]) newSteps[qubit] = [];
      newSteps[qubit][step] = draggedGate;
      setCircuitSteps(newSteps);
      
      const gateMatrix = getGateMatrix(draggedGate);
      quantumEngine.addGate({
        name: draggedGate,
        matrix: gateMatrix,
        qubits: [qubit]
      });
      
      setDraggedGate(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const removeGate = (qubit: number, step: number) => {
    const newSteps = [...circuitSteps];
    newSteps[qubit][step] = undefined;
    setCircuitSteps(newSteps);
  };

  const addQubit = () => {
    if (numQubits < 4) {
      setNumQubits(numQubits + 1);
      setCircuitSteps([...circuitSteps, []]);
    }
  };

  const removeQubit = () => {
    if (numQubits > 1) {
      setNumQubits(numQubits - 1);
      setCircuitSteps(circuitSteps.slice(0, -1));
    }
  };

  const getGateMatrix = (gateName: string): number[][] => {
    switch (gateName) {
      case 'X': return [[0, 1], [1, 0]];
      case 'Y': return [[0, -1], [1, 0]];
      case 'Z': return [[1, 0], [0, -1]];
      case 'H': return [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]];
      case 'S': return [[1, 0], [0, 1]];
      case 'T': return [[1, 0], [0, 1]];
      default: return [[1, 0], [0, 1]];
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Gate Palette */}
      <Card className="p-4 bg-slate-700/50 border-slate-600">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-300">Quantum Gates</h3>
          <HelpTooltip 
            title="What are Quantum Gates?"
            content="Quantum gates are the building blocks of quantum circuits. Each gate performs a specific operation on qubits, like rotation or creating entanglement. Drag gates from here onto the circuit below!"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUANTUM_GATES.map((gate) => (
            <div key={gate.name} className="flex items-center gap-1">
              <Button
                variant={selectedGate === gate.name ? "default" : "outline"}
                size="sm"
                className={`${gate.color} hover:opacity-80 text-white border-0 cursor-grab active:cursor-grabbing flex-1`}
                draggable
                onDragStart={(e) => handleDragStart(e, gate.name)}
                onClick={() => handleGateClick(gate.name)}
              >
                {gate.name}
              </Button>
              <HelpTooltip 
                title={gate.description}
                content={gate.help}
                formula={gate.formula}
                example={gate.example}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Qubit Controls */}
      <Card className="p-4 bg-slate-700/50 border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-300">Qubits</h3>
            <HelpTooltip 
              title="What are Qubits?"
              content="Qubits are quantum bits - the basic units of quantum information. Unlike classical bits that are either 0 or 1, qubits can be in a 'superposition' of both states at once!"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={removeQubit}
              disabled={numQubits <= 1}
              className="border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-300">{numQubits} qubits</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addQubit}
              disabled={numQubits >= 4}
              className="border-green-500/30 text-green-300 hover:bg-green-500/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Circuit Grid */}
      <Card className="p-4 bg-slate-700/50 border-slate-600 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium text-gray-300">Quantum Circuit</h3>
          <HelpTooltip 
            title="How to Build Circuits"
            content="Drag gates from the palette above onto the circuit grid below. Each row represents a qubit, and each column represents a time step. Gates are applied from left to right!"
            example="Try dragging an H gate to create superposition, then add other gates to see how they affect the quantum state."
          />
        </div>
        
        {/* Circuit Table */}
        <div className="border border-gray-600 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-600/50 border-b border-gray-600 grid grid-cols-9 text-xs text-gray-300">
            <div className="p-2 border-r border-gray-600 font-medium">Qubit</div>
            {Array.from({ length: maxSteps }, (_, step) => (
              <div key={step} className="p-2 border-r border-gray-600 text-center">
                Step {step + 1}
              </div>
            ))}
          </div>
          
          {/* Circuit Rows */}
          {Array.from({ length: numQubits }, (_, qubit) => (
            <div key={qubit} className="grid grid-cols-9 border-b border-gray-600 last:border-b-0">
              <div className="p-3 border-r border-gray-600 bg-slate-600/30 flex items-center justify-center">
                <span className="text-sm text-purple-300 font-mono">|q{qubit}⟩</span>
              </div>
              {Array.from({ length: maxSteps }, (_, step) => (
                <div
                  key={step}
                  className="border-r border-gray-600 h-16 flex items-center justify-center relative hover:bg-purple-500/20 transition-colors group"
                  onDrop={(e) => handleDrop(e, qubit, step)}
                  onDragOver={handleDragOver}
                >
                  {/* Quantum wire */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-0.5 bg-gray-400"></div>
                  </div>
                  
                  {/* Gate */}
                  {circuitSteps[qubit]?.[step] && (
                    <div className="relative group">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium z-10 relative">
                        {circuitSteps[qubit][step]}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => removeGate(qubit, step)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  
                  {/* Drop zone indicator */}
                  <div className="absolute inset-0 border-2 border-dashed border-purple-400 opacity-0 group-hover:opacity-30 transition-opacity"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
