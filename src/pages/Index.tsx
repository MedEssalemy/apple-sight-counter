
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import UploadArea from "@/components/upload-area";
import ProgressCard from "@/components/progress-card";
import ResultsDisplay from "@/components/results-display";
import { submitVideo, getJobStatus } from "@/services/api-service";
import { AppStatus, JobResult, JobStatus } from "@/types/api";
import Logo from "@/components/logo";

const Index = () => {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<JobResult | null>(null);
  const [networkErrorCount, setNetworkErrorCount] = useState(0);

  const handleVideoUploaded = useCallback((file: File) => {
    setVideoFile(file);
    setStatus("uploading");
    setProgress(0);
    setResults(null);
    setNetworkErrorCount(0);

    const uploadVideo = async () => {
      try {
        // Fake upload progress
        const uploadInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) {
              clearInterval(uploadInterval);
              return 95;
            }
            return prev + 5;
          });
        }, 200);

        const response = await submitVideo(file);
        clearInterval(uploadInterval);
        
        if (response.job_id) {
          setJobId(response.job_id);
          setProgress(100);
          
          // Short delay before switching to processing state
          setTimeout(() => {
            setStatus("processing");
            setProgress(0);
          }, 500);
          
          toast({
            title: "Video uploaded successfully",
            description: `Processing has started with Job ID: ${response.job_id}`,
          });
        } else {
          throw new Error("No job ID returned from server");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setStatus("error");
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    };

    uploadVideo();
  }, [toast]);

  const resetAnalysis = useCallback(() => {
    setVideoFile(null);
    setJobId(null);
    setStatus("idle");
    setProgress(0);
    setResults(null);
    setNetworkErrorCount(0);
  }, []);

  // Poll for job status with improved error handling
  useEffect(() => {
    if (!jobId || status !== "processing") return;
    
    let statusInterval: NodeJS.Timeout;
    let errorTimeout: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        console.log(`Checking status for job: ${jobId}`);
        const statusData: JobStatus = await getJobStatus(jobId);
        
        // Reset error count on successful response
        setNetworkErrorCount(0);
        
        if (statusData.status === "completed") {
          setStatus("completed");
          setProgress(100);
          setResults(statusData.result || null);
          clearInterval(statusInterval);
          
          toast({
            title: "Analysis complete",
            description: statusData.result ? 
              `We found ${statusData.result.apple_count} apples in your video!` :
              "Analysis finished but no results were found",
          });
        } else if (statusData.status === "failed") {
          setStatus("error");
          clearInterval(statusInterval);
          
          toast({
            variant: "destructive",
            title: "Processing failed",
            description: statusData.error || "Unknown error occurred during processing",
          });
        } else {
          // Still processing
          setProgress(statusData.progress || 0);
        }
      } catch (error) {
        console.error("Status check error:", error);
        
        // Increment error count
        setNetworkErrorCount(prev => {
          const newCount = prev + 1;
          
          // After too many consecutive errors, show an error message
          if (newCount >= 5) {
            clearInterval(statusInterval);
            
            // Don't set error state immediately, retry after a longer timeout
            errorTimeout = setTimeout(() => {
              toast({
                variant: "destructive",
                title: "Connection problems",
                description: "We're having trouble connecting to the server. Your analysis may continue in the background.",
              });
              
              // Restart polling with a longer interval
              setNetworkErrorCount(0);
              statusInterval = setInterval(checkStatus, 8000);
            }, 5000);
          }
          
          return newCount;
        });
      }
    };
    
    // Check immediately then start interval
    checkStatus();
    statusInterval = setInterval(checkStatus, 3000);
    
    return () => {
      clearInterval(statusInterval);
      clearTimeout(errorTimeout);
    };
  }, [jobId, status, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <header className="mb-10">
          <Logo />
          <h1 className="text-3xl font-bold mt-6 mb-2">Apple Counter</h1>
          <p className="text-muted-foreground">
            Upload a video of your apple trees and we'll count the apples for you.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10 items-start">
          <div className="space-y-6">
            {status !== "completed" && (
              <UploadArea 
                onVideoUploaded={handleVideoUploaded}
                isUploading={status === "uploading"}
              />
            )}
            
            <ProgressCard 
              status={status}
              progress={progress}
              jobId={jobId || undefined}
            />
          </div>
          
          <div>
            {status === "completed" && results && (
              <ResultsDisplay 
                results={results}
                onNewAnalysis={resetAnalysis}
              />
            )}
          </div>
        </div>
        
        <footer className="mt-16 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Apple Counter helps farmers quickly assess their harvest yield. Upload a video of your apple trees for analysis.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
