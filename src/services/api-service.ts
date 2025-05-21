import { SubmitVideoResponse, JobStatus } from '@/types/api'

const API_BASE_URL = 'https://itemscounter.ticktick.cloud'

export async function submitVideo(
  videoFile: File
): Promise<SubmitVideoResponse> {
  const formData = new FormData()
  formData.append('video', videoFile) // Using "video" as the field name

  const response = await fetch(`${API_BASE_URL}/submit_video/`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload video: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  try {
    // Using http instead of https, with explicit no-cors mode to avoid CORS issues
    const response = await fetch(`${API_BASE_URL}/job_status/${jobId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Remove credentials and use no-cors mode
      mode: 'cors', // Note: no-cors mode doesn't allow reading the response in JavaScript
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to get job status: ${response.status} - ${errorText}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Job status fetch error:', error)
    // Return a fallback status to prevent app from crashing
    // This allows the app to retry and potentially recover
    return {
      status: 'processing',
      progress: 10,
      error: error instanceof Error ? error.message : 'Network request failed',
    }
  }
}
