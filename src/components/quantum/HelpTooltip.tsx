
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  title: string;
  content: string;
  formula?: string;
  example?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, content, formula, example }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-5 w-5 md:h-6 md:w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 flex-shrink-0"
        >
          <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-purple-500/30 text-white max-w-sm md:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-purple-300 text-base md:text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
          
          {formula && (
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Mathematical Representation:</h4>
              <code className="text-xs bg-slate-700 p-2 rounded block text-purple-300 font-mono break-all">
                {formula}
              </code>
              <p className="text-xs text-gray-400 mt-2">
                Don't worry if this looks confusing - the important part is understanding what the gate does!
              </p>
            </div>
          )}
          
          {example && (
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
              <h4 className="text-sm font-medium text-green-300 mb-2">Try This:</h4>
              <p className="text-xs text-green-200 leading-relaxed">{example}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
