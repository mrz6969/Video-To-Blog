
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateBlogPost(srtContent: string, keywords: string[], numImages: number): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Bạn là một chuyên gia viết nội dung SEO và chiến lược gia nội dung. Nhiệm vụ của bạn là chuyển đổi bản ghi video thành một bài đăng blog chất lượng cao, hấp dẫn và được tối ưu hóa SEO. **NGÔN NGỮ ĐẦU RA BẮT BUỘC LÀ TIẾNG VIỆT.**

        **Bản ghi video (Phụ đề):**
        ---
        ${srtContent}
        ---

        **Từ khóa SEO chính:**
        - ${keywords.join('\n- ')}

        **Hướng dẫn:**
        1.  **Viết lại nội dung:** Diễn giải và tái cấu trúc nội dung thành một bài đăng blog trôi chảy, được viết tốt. Đừng chỉ sao chép nguyên văn bản ghi.
        2.  **Giữ nguyên giọng điệu gốc:** Nắm bắt giọng điệu của người nói gốc (ví dụ: nhiệt tình, nhiều thông tin, hài hước) trong bài viết của bạn.
        3.  **Tối ưu hóa SEO:**
            -   Tích hợp một cách tự nhiên các từ khóa chính: "${keywords.join(', ')}".
            -   Xác định và kết hợp các từ khóa đuôi dài (long-tail keywords) có liên quan.
            -   Tạo một tiêu đề H1 hấp dẫn, giàu từ khóa cho bài đăng blog.
            -   Sử dụng các tiêu đề H2 và H3 để cấu trúc bài viết một cách hợp lý.
            -   Viết một meta description ngắn gọn, hấp dẫn (155-160 ký tự).
        4.  **Chèn Hình ảnh:** Chèn các placeholder cho hình ảnh vào những vị trí phù hợp trong bài viết để minh họa cho nội dung. Sử dụng định dạng \`[IMAGE-1]\`, \`[IMAGE-2]\`, v.v., một cách tuần tự cho đến \`[IMAGE-${numImages}]\`. Đảm bảo rằng mỗi placeholder nằm trên một dòng riêng biệt, không có văn bản khác.
        5.  **Cấu trúc và Định dạng:**
            -   Bắt đầu bằng một phần giới thiệu hấp dẫn.
            -   Sử dụng các đoạn văn ngắn, gạch đầu dòng và danh sách được đánh số để dễ đọc.
            -   Kết thúc bằng một kết luận mạnh mẽ và lời kêu gọi hành động.
        6.  **Định dạng đầu ra:** Trả về toàn bộ đầu ra dưới dạng một tài liệu Markdown duy nhất. Dòng đầu tiên phải là meta description, có tiền tố "Meta Description:". Dòng thứ hai phải là dấu phân cách "---". Dòng thứ ba phải là tiêu đề H1, bắt đầu bằng "# ".

        Ví dụ về cấu trúc đầu ra:
        Meta Description: Một bản tóm tắt ngắn gọn, hấp dẫn cho các công cụ tìm kiếm.
        ---
        # Đây là Tiêu đề H1 chính của Bài đăng Blog

        Đây là phần giới thiệu...

        [IMAGE-1]

        ## Đây là một Tiêu đề phụ (H2)

        Thêm nội dung ở đây...

        [IMAGE-2]
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating blog post:", error);
        throw new Error("Failed to generate blog post from Gemini API.");
    }
}


export async function generateImageFilenames(imageContexts: string[], keywords: string[]): Promise<string[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Bạn là một chuyên gia SEO chuyên về tối ưu hóa hình ảnh. Dựa trên các ngữ cảnh được cung cấp từ bản ghi video, hãy tạo tên tệp ngắn gọn, mô tả và thân thiện với SEO cho mỗi hình ảnh.

        Các từ khóa chính cho bài viết là: ${keywords.join(', ')}. Sử dụng các từ khóa này để định hình tên tệp khi có liên quan.

        **Quy tắc đặt tên tệp:**
        -   Chỉ sử dụng chữ thường, không dấu.
        -   Tách các từ bằng dấu gạch ngang (-).
        -   Không bao gồm phần mở rộng của tệp (như .jpg).
        -   Mỗi tên tệp nên có từ 3-6 từ.
        -   Ví dụ: "đánh giá điện thoại" trở thành "danh-gia-dien-thoai".

        Đây là các đoạn văn bản từ video nơi mỗi hình ảnh sẽ xuất hiện:
        ${imageContexts.map((ctx, i) => `Ngữ cảnh cho Hình ${i + 1}: "${ctx.trim()}"`).join('\n')}

        Tạo tên tệp cho mỗi ngữ cảnh và cung cấp đầu ra theo lược đồ JSON đã chỉ định.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        filenames: {
                            type: Type.ARRAY,
                            description: "An array of SEO-friendly filenames, one for each context provided.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.filenames && Array.isArray(jsonResponse.filenames)) {
            return jsonResponse.filenames.map((name: string) => `${name}.jpg`);
        }
        throw new Error("Invalid format for image filenames from API.");

    } catch (error) {
        console.error("Error generating image filenames:", error);
        // Fallback in case of API error
        return imageContexts.map((_, index) => `review-image-${index + 1}.jpg`);
    }
}
