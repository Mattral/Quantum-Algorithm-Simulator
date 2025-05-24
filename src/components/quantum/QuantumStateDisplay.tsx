
import React, { useState, useEffect } from 'react';
import { QuantumEngine } from '@/utils/quantum/QuantumEngine';
import { Card } from '@/components/ui/card';
import { ProbabilityChart } from './ProbabilityChart';
import { HelpTooltip } from './HelpTooltip';

interface QuantumStateDisplayProps {
  quantumEngine: QuantumEngine;
}

export const QuantumStateDisplay: React.FC<QuantumStateDisplayProps> = ({ 
  quantumEngine 
}) => {
  const [stateVector, setStateVector] = useState(quantumEngine.getStateVector());
  const [probabilities, setProbabilities] = useState(quantumEngine.getProbabilities());

  useEffect(() => {
    const updateState = () => {
      setStateVector(quantumEngine.getStateVector());
      setProbabilities(quantumEngine.getProbabilities());
    };

    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, [quantumEngine]);

  const getBasisState = (index: number): string => {
    return `|${index.toString(2).padStart(3, '0')}⟩`;
  };

  return (
    <div className="space-y-4">
      {/* Probability Chart */}
      <ProbabilityChart probabilities={probabilities} />

      {/* State Vector Details */}
      <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-medium text-gray-300">Quantum State Vector</h4>
          <HelpTooltip 
            title="What is a State Vector?"
            content="The state vector describes the complete quantum state of your qubits. Each entry shows the probability amplitude for finding the system in that particular state when measured."
            example="If you see |001⟩ with amplitude 0.707, there's a 50% chance (0.707²) of measuring the qubits as 001."
          />
        </div>
        <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
          {stateVector.map((amplitude, index) => {
            const probability = amplitude.magnitude() ** 2;
            return (
              <div key={index} className="flex justify-between items-center py-1 border-b border-slate-600/30 last:border-b-0">
                <span className="text-purple-300">{getBasisState(index)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{amplitude.toString()}</span>
                  <span className="text-xs text-gray-500">({(probability * 100).toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Entanglement Detection */}
      <Card className="p-3 bg-slate-700/50 border-slate-600">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-medium text-gray-300">Entanglement</h4>
          <HelpTooltip 
            title="What is Entanglement?"
            content="Entanglement is when qubits become 'connected' - measuring one instantly affects the others, no matter how far apart they are! It's one of the most mysterious features of quantum mechanics."
            example="Use a Hadamard gate on one qubit, then a CNOT gate to create entanglement between two qubits."
          />
        </div>
        <div className="text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No entanglement detected</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
