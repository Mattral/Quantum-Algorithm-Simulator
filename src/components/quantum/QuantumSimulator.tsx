
import React, { useState } from 'react';
import { CircuitEditor } from './CircuitEditor';
import { BlochSphereVisualization } from './BlochSphereVisualization';
import { QuantumStateDisplay } from './QuantumStateDisplay';
import { EducationalSidebar } from './EducationalSidebar';
import { HelpTooltip } from './HelpTooltip';
import { QuantumEngine } from '@/utils/quantum/QuantumEngine';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';

export const QuantumSimulator = () => {
  const [quantumEngine] = useState(() => new QuantumEngine(3));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const handleStepForward = () => {
    console.log('Stepping forward in quantum simulation');
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    quantumEngine.reset();
    console.log('Quantum circuit reset');
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
    console.log(isRunning ? 'Pausing simulation' : 'Starting simulation');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Quantum Algorithm Simulator
            </h1>
            <HelpTooltip 
              title="What is Quantum Computing?"
              content="Quantum computing is like having a super-powered computer that can solve certain problems much faster than regular computers. Instead of using regular bits (0 or 1), it uses 'qubits' that can be 0, 1, or both at the same time!"
              example="Think of it like a coin that's spinning in the air - it's both heads AND tails until it lands. Quantum computers use this 'spinning coin' effect to try many solutions at once!"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <HelpTooltip 
              title="How to Control Your Circuit"
              content="Use these buttons to control how your quantum circuit runs. Think of it like controlling a video - you can play, pause, go step by step, or restart from the beginning."
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20 text-xs md:text-sm"
            >
              <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStepForward}
              className="border-blue-500/30 text-blue-200 hover:bg-blue-500/20 text-xs md:text-sm"
            >
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Step
            </Button>
            <Button 
              size="sm" 
              onClick={handlePlayPause}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm"
            >
              {isRunning ? <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
              {isRunning ? 'Pause' : 'Run'}
            </Button>
          </div>
        </div>
        
        {/* Enhanced Beginner Guide */}
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2 text-blue-200">
              <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>New to Quantum Computing?</strong> 
                <p className="mt-1 text-xs md:text-sm">
                  1) Start by dragging an <span className="font-mono bg-purple-600/30 px-1 rounded">H</span> gate to create "superposition" → 
                  2) Watch the sphere change → 
                  3) Click any <span className="text-blue-300">?</span> button for detailed explanations!
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-2 text-green-200">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Quick Learning Path:</strong>
                <p className="mt-1 text-xs md:text-sm">
                  Single gates → Superposition → Entanglement → Measurement. Each concept builds on the previous one!
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Circuit Editor */}
        <div className="flex-1 p-2 md:p-4 order-1">
          <Card className="h-full bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
            <div className="p-3 md:p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base md:text-lg font-semibold text-white">Build Your Quantum Circuit</h2>
                <HelpTooltip 
                  title="What is a Quantum Circuit?"
                  content="A quantum circuit is like a recipe for quantum operations. You read it from left to right, and each column represents a moment in time. It's like reading music - each note (gate) happens at a specific time on a specific qubit (instrument)."
                  example="Try this: Put an H gate on qubit 0, then a CNOT gate connecting qubits 0 and 1. This creates 'entanglement' - a special quantum connection!"
                />
              </div>
              <CircuitEditor 
                quantumEngine={quantumEngine}
                onGateSelect={setSelectedGate}
                selectedGate={selectedGate}
              />
            </div>
          </Card>
        </div>

        {/* Center Panel - Visualization (Mobile: order-3, Desktop: order-2) */}
        <div className="w-full lg:w-96 p-2 md:p-4 space-y-4 order-3 lg:order-2">
          {/* Bloch Spheres */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
            <div className="p-3 md:p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base md:text-lg font-semibold text-white">Qubit Visualization</h3>
                <HelpTooltip 
                  title="What are these Spheres?"
                  content="These are called 'Bloch spheres' - think of them as 3D compasses for qubits! The arrow shows where each qubit 'points'. Top = definitely 0, Bottom = definitely 1, Sides = both 0 AND 1 at the same time (superposition)!"
                  example="When you add an H gate, watch the arrow move to the side - that's superposition! It's like the qubit is 'undecided' between 0 and 1."
                />
              </div>
              <div className="text-xs text-gray-400 mb-3 bg-slate-700/30 p-2 rounded">
                <strong>Reading the Spheres:</strong> North Pole = |0⟩, South Pole = |1⟩, Equator = Superposition (both states at once!)
              </div>
              <BlochSphereVisualization quantumEngine={quantumEngine} />
            </div>
          </Card>

          {/* Quantum State */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
            <div className="p-3 md:p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base md:text-lg font-semibold text-white">Measurement Results</h3>
                <HelpTooltip 
                  title="Understanding Quantum Measurements"
                  content="In quantum mechanics, we can't know the exact result before measuring - we can only predict probabilities! It's like predicting if a coin will be heads or tails while it's still spinning."
                  example="If you see 50% for |000⟩ and 50% for |111⟩, it means when you measure, you'll get either all 0s or all 1s, but you can't predict which!"
                />
              </div>
              <div className="text-xs text-gray-400 mb-3 bg-slate-700/30 p-2 rounded">
                <strong>What am I looking at?</strong> These bars show the chance of measuring each possible outcome. Higher bars = more likely results!
              </div>
              <QuantumStateDisplay quantumEngine={quantumEngine} />
            </div>
          </Card>
        </div>

        {/* Right Panel - Educational Sidebar (Mobile: order-2, Desktop: order-3) */}
        <div className="w-full lg:w-80 p-2 md:p-4 order-2 lg:order-3">
          <EducationalSidebar 
            selectedGate={selectedGate}
            quantumEngine={quantumEngine}
          />
        </div>
      </div>
    </div>
  );
};
