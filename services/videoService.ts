
import type { SrtEntry } from '../types';

export function parseSrt(srtContent: string): SrtEntry[] {
    const entries: SrtEntry[] = [];
    const lines = srtContent.replace(/\r\n/g, '\n').split('\n\n');

    for (const line of lines) {
        const parts = line.split('\n');
        if (parts.length >= 3) {
            const id = parseInt(parts[0], 10);
            const timeMatch = parts[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
            
            if (id && timeMatch) {
                const startTime = timeToSeconds(timeMatch[1]);
                const endTime = timeToSeconds(timeMatch[2]);
                const text = parts.slice(2).join(' ').trim();
                
                entries.push({ id, startTime, endTime, text });
            }
        }
    }
    return entries;
}

function timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':');
    const [secs, millis] = seconds.split(',');
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(secs, 10) + parseInt(millis, 10) / 1000;
}


export function extractFramesFromVideo(
    videoFile: File, 
    srtEntries: SrtEntry[],
    numFrames: number
): Promise<{ dataUrl: string; text: string; }[]> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const videoUrl = URL.createObjectURL(videoFile);
        
        video.src = videoUrl;
        video.muted = true;

        const frames: { dataUrl: string; text: string; }[] = [];
        let framesExtracted = 0;

        // Select representative SRT entries to extract frames from
        const totalEntries = srtEntries.length;
        if (totalEntries === 0) {
            reject(new Error("No SRT entries found."));
            return;
        }

        const step = Math.max(1, Math.floor(totalEntries / numFrames));
        const selectedEntries: SrtEntry[] = [];
        for (let i = 0; i < totalEntries && selectedEntries.length < numFrames; i += step) {
            selectedEntries.push(srtEntries[i]);
        }
        
        if (selectedEntries.length === 0) {
           reject(new Error("Could not select any entries for frame extraction."));
           return;
        }

        let currentEntryIndex = 0;

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            seekToNextTime();
        };

        const seekToNextTime = () => {
            if (currentEntryIndex < selectedEntries.length) {
                video.currentTime = selectedEntries[currentEntryIndex].startTime + 0.1; // seek slightly into the subtitle
            } else {
                URL.revokeObjectURL(videoUrl);
                resolve(frames);
            }
        };

        video.onseeked = () => {
             if (!context) {
                reject(new Error("Failed to get canvas context."));
                return;
            }
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            frames.push({ dataUrl, text: selectedEntries[currentEntryIndex].text });
            framesExtracted++;
            currentEntryIndex++;
            seekToNextTime();
        };

        video.onerror = (e) => {
            URL.revokeObjectURL(videoUrl);
            reject(new Error('Error loading or processing video file.'));
        };
    });
}
