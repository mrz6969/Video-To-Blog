
import React, { useState, useCallback } from 'react';
import { generateBlogPost, generateImageFilenames } from './services/geminiService';
import { parseSrt, extractFramesFromVideo } from './services/videoService';
import type { SrtEntry, ExtractedImage, AppState, ProcessedData } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import KeywordInput from './components/KeywordInput';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import { ArrowRightIcon } from './components/Icons';

const App: React.FC = () => {
    const [srtFile, setSrtFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [keywords, setKeywords] = useState<string>('');
    const [appState, setAppState] = useState<AppState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

    const handleReset = () => {
        setSrtFile(null);
        setVideoFile(null);
        setKeywords('');
        setAppState('idle');
        setError(null);
        setProcessedData(null);
        setProgressMessage('');
    };

    const handleProcess = useCallback(async () => {
        if (!srtFile || !videoFile || !keywords) {
            setError('Please provide all inputs: SRT file, video file, and keywords.');
            return;
        }

        setAppState('processing');
        setError(null);

        try {
            setProgressMessage('Reading and parsing subtitle file...');
            const srtContent = await srtFile.text();
            const srtEntries = parseSrt(srtContent);
            if (srtEntries.length === 0) throw new Error("Could not parse SRT file or it's empty.");
            
            const framesToExtract = 10;

            setProgressMessage('AI is analyzing content and writing your blog post...');
            const blogPostMarkdown = await generateBlogPost(srtContent, keywords.split(',').map(k => k.trim()), framesToExtract);

            setProgressMessage('Extracting key frames from video...');
            const extractedFrames = await extractFramesFromVideo(videoFile, srtEntries, framesToExtract);
            
            if (extractedFrames.length === 0) throw new Error("Could not extract any frames from the video.");
            
            setProgressMessage('AI is generating SEO-friendly image filenames...');
            const imageContexts = extractedFrames.map(frame => frame.text);
            const imageFilenames = await generateImageFilenames(imageContexts, keywords.split(',').map(k => k.trim()));
            
            const finalImages: ExtractedImage[] = extractedFrames.map((frame, index) => ({
                dataUrl: frame.dataUrl,
                filename: imageFilenames[index] || `image-${index + 1}.jpg`,
            }));
            
            setProgressMessage('Finalizing results...');
            setProcessedData({ blogContent: blogPostMarkdown, images: finalImages });
            setAppState('success');

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setAppState('error');
        }
    }, [srtFile, videoFile, keywords]);

    const renderContent = () => {
        switch (appState) {
            case 'processing':
                return <ProcessingView message={progressMessage} />;
            case 'success':
                return processedData && <ResultsView data={processedData} onReset={handleReset} />;
            case 'error':
                 return (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Processing Failed</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-8 max-w-2xl w-full">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Start Conversion</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Upload your files and provide keywords to begin.</p>
                        </div>
                        <div className="space-y-6">
                           <FileUpload label="1. Upload Subtitle File (.srt)" onFileSelect={setSrtFile} acceptedTypes=".srt" file={srtFile}/>
                           <FileUpload label="2. Upload Video File" onFileSelect={setVideoFile} acceptedTypes="video/*" file={videoFile}/>
                           <KeywordInput keywords={keywords} onKeywordsChange={setKeywords} />
                        </div>
                        <button
                            onClick={handleProcess}
                            disabled={!srtFile || !videoFile || !keywords}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            <span>Generate Blog Post</span>
                            <ArrowRightIcon />
                        </button>
                        {error && <p className="text-red-500 text-center pt-2">{error}</p>}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <Header />
            <main className="w-full flex-grow flex items-center justify-center">
                 {renderContent()}
            </main>
        </div>
    );
};

export default App;
