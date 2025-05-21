
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobResult } from "@/types/api";
import { Progress } from "@/components/ui/progress";

interface ResultsDisplayProps {
  results: JobResult | null;
  onNewAnalysis: () => void;
}

const ResultsDisplay = ({ results, onNewAnalysis }: ResultsDisplayProps) => {
  const [showCount, setShowCount] = useState(0);
  
  useEffect(() => {
    if (!results) return;
    
    let count = 0;
    const targetCount = results.apple_count;
    const interval = 15; // ms between count updates
    const step = Math.max(1, Math.floor(targetCount / 100)); // Increment by at least 1, or 1% of the target
    
    const timer = setInterval(() => {
      count += step;
      if (count >= targetCount) {
        setShowCount(targetCount);
        clearInterval(timer);
      } else {
        setShowCount(count);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [results]);

  if (!results) {
    return null;
  }

  const framesRatio = results.frames_processed / results.total_frames;
  const framesPercent = Math.round(framesRatio * 100);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <div className="bg-apple-dark p-1 w-full">
          <p className="text-white text-center text-sm font-medium">Analysis Results</p>
        </div>
        <CardHeader className="pt-6 text-center">
          <CardTitle className="text-2xl flex flex-col items-center justify-center gap-2">
            <span className="flex items-center gap-2 text-accent">
              <Medal className="h-6 w-6" />
              <span>Results Ready</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="w-full max-w-xs mx-auto p-4 bg-apple-light rounded-xl border border-apple">
            <div className="flex items-center justify-center gap-3">
              <Apple className="h-8 w-8 text-accent" />
              <span className="text-4xl font-bold text-primary">{showCount}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Apples Detected</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Frames Processed</span>
              <span className="font-medium">{results.frames_processed} / {results.total_frames}</span>
            </div>
            <Progress value={framesPercent} className="h-1.5" />
          </div>
          
          <Button onClick={onNewAnalysis} className="w-full">
            Analyze Another Video
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
