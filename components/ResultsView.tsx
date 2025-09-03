
import React, { useRef } from 'react';
import type { ProcessedData } from '../types';
import { DownloadIcon, Image as ImageIcon, FileTextIcon, RefreshCwIcon } from './Icons';

// Use 'any' for window properties that are not standard
declare const window: any;

interface ResultsViewProps {
    data: ProcessedData;
    onReset: () => void;
}

// Renders markdown content and replaces image placeholders with actual images.
const MarkdownRenderer: React.FC<{ content: string; images: ProcessedData['images'] }> = ({ content, images }) => {
    // Split the content by image placeholders, keeping the placeholders in the array
    const blocks = content.split(/(\[IMAGE-\d+\])/g);

    return (
        <>
            {blocks.map((block, index) => {
                const imageMatch = block.match(/\[IMAGE-(\d+)\]/);
                if (imageMatch) {
                    const imageIndex = parseInt(imageMatch[1], 10) - 1;
                    if (images[imageIndex]) {
                        const image = images[imageIndex];
                        const caption = image.filename
                            .replace(/\.jpg$/i, '')
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

                        return (
                            <figure key={`image-${index}`} className="my-8 text-center">
                                <img
                                    src={image.dataUrl}
                                    alt={caption}
                                    className="rounded-lg shadow-xl w-full max-w-3xl mx-auto h-auto object-cover"
                                />
                                <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                                    {caption}
                                </figcaption>
                            </figure>
                        );
                    }
                    return null; // Image not found for placeholder
                }

                // If it's a text block, process it line by line for markdown
                if (block.trim() === '') return null;

                return block.split('\n').map((line, lineIndex) => {
                    const key = `${index}-${lineIndex}`;
                    if (line.startsWith('# ')) {
                        return <h1 key={key} className="text-3xl md:text-4xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={key} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                        return <h3 key={key} className="text-xl font-bold mt-5 mb-2">{line.substring(4)}</h3>;
                    }
                    if (line.trim() === '---') {
                        return <hr key={key} className="my-8 border-gray-200 dark:border-gray-700" />;
                    }
                    if (line.trim() === '') {
                        return null; // Don't render empty paragraphs, spacing is handled by margins
                    }
                    return <p key={key} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>;
                }).filter(Boolean);
            })}
        </>
    );
};


const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset }) => {
    const { blogContent, images } = data;
    const blogPostRef = useRef<HTMLDivElement>(null);

    const [metaDescription, articleContent] = (() => {
        const parts = blogContent.split('---');
        if (parts.length > 1 && parts[0].toLowerCase().includes('meta description:')) {
            const meta = parts[0].replace(/meta description:/i, '').trim();
            return [meta, parts.slice(1).join('---').trim()];
        }
        return ["Not generated.", blogContent];
    })();


    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const content = blogPostRef.current;
        if (!content) return;

        window.html2canvas(content, { scale: 2, useCORS: true, allowTaint: true }).then((canvas: any) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgWidth = pdfWidth;
            const imgHeight = imgWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            pdf.save('blog-post.pdf');
        });
    };

    const handleDownloadImages = async () => {
        const JSZip = window.JSZip;
        const zip = new JSZip();

        for (const image of images) {
            const response = await fetch(image.dataUrl);
            const blob = await response.blob();
            zip.file(image.filename, blob);
        }

        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'extracted-images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="w-full max-w-5xl p-4 md:p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b dark:border-gray-700 pb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Conversion Complete!</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <RefreshCwIcon />
                        <span>Start Over</span>
                    </button>
                    <button onClick={handleDownloadImages} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                        <ImageIcon />
                        <span>Download Images (.zip)</span>
                    </button>
                    <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        <FileTextIcon />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>

            <div ref={blogPostRef} className="px-2">
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 rounded-r-lg">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300">Meta Description:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 italic">{metaDescription}</p>
                </div>
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownRenderer content={articleContent} images={images} />
                </article>
            </div>
        </div>
    );
};

export default ResultsView;
