
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppStatus } from "@/types/api";

interface ProgressCardProps {
  status: AppStatus;
  progress: number;
  jobId?: string;
}

const ProgressCard = ({ status, progress, jobId }: ProgressCardProps) => {
  let title = "Upload a video to begin";
  let statusText = "Ready to analyze your apple trees";
  let statusColor = "text-muted-foreground";
  
  if (status === "uploading") {
    title = "Uploading Video";
    statusText = "Please wait while your video uploads...";
    statusColor = "text-secondary";
  } else if (status === "processing") {
    title = "Processing Video";
    statusText = `Analyzing video (Job ID: ${jobId || 'Unknown'})`;
    statusColor = "text-primary";
  } else if (status === "completed") {
    title = "Analysis Complete";
    statusText = "Your results are ready below";
    statusColor = "text-green-500";
  } else if (status === "error") {
    title = "Error Occurred";
    statusText = "There was an issue processing your video";
    statusColor = "text-destructive";
  }

  const showProgress = status === "uploading" || status === "processing";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className={`text-sm ${statusColor} flex items-center`}>
            {status !== "idle" && (
              <span className="mr-2">
                <ArrowRight size={14} />
              </span>
            )}
            {statusText}
          </p>
          
          {showProgress && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground text-right">
                {progress}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
