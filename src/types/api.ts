
export interface SubmitVideoResponse {
  job_id: string;
  status: string;
}

export interface JobResult {
  apple_count: number;
  frames_processed: number;
  total_frames: number;
}

export interface JobStatus {
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  result?: JobResult;
  video_path?: string;
  error?: string;
}

export type AppStatus = "idle" | "uploading" | "processing" | "completed" | "error";
