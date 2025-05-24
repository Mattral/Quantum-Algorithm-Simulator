
import { Complex } from './Complex';
import { Matrix } from './Matrix';

export interface QuantumGate {
  name: string;
  matrix: number[][];
  qubits: number[];
  parameters?: number[];
}

export interface QuantumCircuit {
  gates: QuantumGate[];
  numQubits: number;
}

export class QuantumEngine {
  private numQubits: number;
  private stateVector: Complex[];
  private circuit: QuantumGate[];
  
  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.stateVector = this.initializeState();
    this.circuit = [];
  }

  private initializeState(): Complex[] {
    const numStates = Math.pow(2, this.numQubits);
    const state = new Array(numStates).fill(null).map(() => new Complex(0, 0));
    state[0] = new Complex(1, 0); // |000...0⟩ state
    return state;
  }

  addGate(gate: QuantumGate): void {
    this.circuit.push(gate);
    this.applyGate(gate);
  }

  private applyGate(gate: QuantumGate): void {
    const gateMatrix = this.expandGateMatrix(gate);
    this.stateVector = Matrix.multiplyVector(gateMatrix, this.stateVector);
  }

  private expandGateMatrix(gate: QuantumGate): Complex[][] {
    const numStates = Math.pow(2, this.numQubits);
    
    if (gate.qubits.length === 1) {
      return this.expandSingleQubitGate(gate, numStates);
    } else if (gate.qubits.length === 2) {
      return this.expandTwoQubitGate(gate, numStates);
    }
    
    throw new Error('Gates with more than 2 qubits not supported yet');
  }

  private expandSingleQubitGate(gate: QuantumGate, numStates: number): Complex[][] {
    const qubit = gate.qubits[0];
    const result: Complex[][] = [];
    
    for (let i = 0; i < numStates; i++) {
      result[i] = new Array(numStates).fill(null).map(() => new Complex(0, 0));
    }

    for (let i = 0; i < numStates; i++) {
      for (let j = 0; j < numStates; j++) {
        if (this.differOnlyInQubit(i, j, qubit)) {
          const iBit = (i >> (this.numQubits - 1 - qubit)) & 1;
          const jBit = (j >> (this.numQubits - 1 - qubit)) & 1;
          
          const matrixElement = gate.matrix[iBit][jBit];
          result[i][j] = new Complex(matrixElement, 0);
        } else if (i === j) {
          result[i][j] = new Complex(1, 0);
        }
      }
    }

    return result;
  }

  private expandTwoQubitGate(gate: QuantumGate, numStates: number): Complex[][] {
    // Implementation for two-qubit gates like CNOT
    const result: Complex[][] = [];
    
    for (let i = 0; i < numStates; i++) {
      result[i] = new Array(numStates).fill(null).map(() => new Complex(0, 0));
      result[i][i] = new Complex(1, 0); // Identity by default
    }

    // Special handling for CNOT gate
    if (gate.name === 'CNOT') {
      const control = gate.qubits[0];
      const target = gate.qubits[1];

      for (let i = 0; i < numStates; i++) {
        const controlBit = (i >> (this.numQubits - 1 - control)) & 1;
        if (controlBit === 1) {
          const flipped = i ^ (1 << (this.numQubits - 1 - target));
          result[i][i] = new Complex(0, 0);
          result[i][flipped] = new Complex(1, 0);
        }
      }
    }

    return result;
  }

  private differOnlyInQubit(state1: number, state2: number, qubit: number): boolean {
    const mask = ~(1 << (this.numQubits - 1 - qubit));
    return (state1 & mask) === (state2 & mask);
  }

  getStateVector(): Complex[] {
    return [...this.stateVector];
  }

  getProbabilities(): number[] {
    return this.stateVector.map(amplitude => amplitude.magnitude() ** 2);
  }

  getQubitState(qubit: number): { alpha: Complex; beta: Complex } {
    // Extract single qubit state from the full state vector
    const alpha = new Complex(0, 0);
    const beta = new Complex(0, 0);
    
    const numStates = Math.pow(2, this.numQubits);
    
    for (let i = 0; i < numStates; i++) {
      const qubitBit = (i >> (this.numQubits - 1 - qubit)) & 1;
      if (qubitBit === 0) {
        alpha.add(this.stateVector[i]);
      } else {
        beta.add(this.stateVector[i]);
      }
    }

    const norm = Math.sqrt(alpha.magnitude() ** 2 + beta.magnitude() ** 2);
    if (norm > 0) {
      alpha.divide(new Complex(norm, 0));
      beta.divide(new Complex(norm, 0));
    }

    return { alpha, beta };
  }

  measure(qubit: number): number {
    const probabilities = this.getQubitProbabilities(qubit);
    const random = Math.random();
    
    const result = random < probabilities[0] ? 0 : 1;
    this.collapseState(qubit, result);
    
    return result;
  }

  private getQubitProbabilities(qubit: number): [number, number] {
    let prob0 = 0;
    let prob1 = 0;
    
    const numStates = Math.pow(2, this.numQubits);
    
    for (let i = 0; i < numStates; i++) {
      const qubitBit = (i >> (this.numQubits - 1 - qubit)) & 1;
      const probability = this.stateVector[i].magnitude() ** 2;
      
      if (qubitBit === 0) {
        prob0 += probability;
      } else {
        prob1 += probability;
      }
    }
    
    return [prob0, prob1];
  }

  private collapseState(qubit: number, result: number): void {
    const numStates = Math.pow(2, this.numQubits);
    let norm = 0;
    
    // Set amplitudes to zero for states inconsistent with measurement
    for (let i = 0; i < numStates; i++) {
      const qubitBit = (i >> (this.numQubits - 1 - qubit)) & 1;
      if (qubitBit !== result) {
        this.stateVector[i] = new Complex(0, 0);
      } else {
        norm += this.stateVector[i].magnitude() ** 2;
      }
    }
    
    // Renormalize
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < numStates; i++) {
        this.stateVector[i].divide(new Complex(norm, 0));
      }
    }
  }

  reset(): void {
    this.stateVector = this.initializeState();
    this.circuit = [];
  }

  getCircuit(): QuantumGate[] {
    return [...this.circuit];
  }
}
