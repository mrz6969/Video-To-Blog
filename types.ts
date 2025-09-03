
export interface SrtEntry {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface ExtractedImage {
  dataUrl: string;
  filename: string;
}

export type AppState = 'idle' | 'processing' | 'success' | 'error';

export interface ProcessedData {
  blogContent: string;
  images: ExtractedImage[];
}
