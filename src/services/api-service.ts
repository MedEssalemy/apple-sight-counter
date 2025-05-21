
import { SubmitVideoResponse, JobStatus } from "@/types/api";

const API_BASE_URL = "https://itemscounter.ticktick.cloud";
const STATUS_BASE_URL = "http://159.223.234.220";

export async function submitVideo(videoFile: File): Promise<SubmitVideoResponse> {
  const formData = new FormData();
  formData.append("video", videoFile); // Changed from "file" to "video" based on API error

  const response = await fetch(`${API_BASE_URL}/submit_video/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload video: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${STATUS_BASE_URL}/job_status/${jobId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get job status: ${response.status} - ${errorText}`);
  }

  return response.json();
}
