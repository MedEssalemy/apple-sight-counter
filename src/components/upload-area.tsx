
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface UploadAreaProps {
  onVideoUploaded: (file: File) => void;
  isUploading: boolean;
}

const UploadArea = ({ onVideoUploaded, isUploading }: UploadAreaProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }
    
    onVideoUploaded(file);
  }, [onVideoUploaded, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    disabled: isUploading,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 transition-colors flex flex-col items-center justify-center
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 hover:bg-muted/50'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="p-4 bg-muted rounded-full">
          {isUploading ? (
            <Video className="h-10 w-10 text-primary animate-pulse" />
          ) : (
            <Upload className="h-10 w-10 text-primary" />
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-1">Upload Apple Tree Video</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Drag and drop or click to select a video of your apple tree
          </p>
        </div>
        
        <Button 
          disabled={isUploading}
          className="relative"
        >
          {isUploading ? 'Uploading...' : 'Select Video'}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Supported formats: MP4, MOV, AVI (max. 200MB)
        </p>
      </div>
    </div>
  );
};

export default UploadArea;
