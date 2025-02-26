// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import { Mic, ImagePlus, Volume2, Send, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateImage = async () => {
    const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";
    const API_TOKEN = "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"; // 🔥 ใส่ API Token ที่นี่

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) throw new Error("API Error");
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResult({ type: "image", url: imageUrl });
    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (activeTab === "image") generateImage();
    else console.log("สร้างเสียง (ต้องเพิ่ม API)"); // ยังไม่ได้เพิ่ม API สำหรับเสียง
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 text-gray-800">
      <Head>
        <title>AI Generator | สร้างรูปและเสียงจาก AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container mx-auto px-4 py-8 font-['Prompt']">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            AI Generator
          </h1>
          <p className="mt-2 text-gray-600">สร้างรูปภาพและเสียงจากข้อความด้วย AI</p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-3 flex justify-center items-center gap-2 transition ${
                activeTab === 'image' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImagePlus size={18} />
              <span>สร้างรูปภาพ</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-3 flex justify-center items-center gap-2 transition ${
                activeTab === 'audio' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Volume2 size={18} />
              <span>สร้างเสียง</span>
            </button>
          </div>

          {/* Input Form */}
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="prompt" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {activeTab === 'image' ? 'อธิบายรูปภาพที่ต้องการ' : 'ข้อความที่ต้องการแปลงเป็นเสียง'}
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition"
                    placeholder={activeTab === 'image' ? 'เช่น: ภาพวิวทะเลยามพระอาทิตย์ตก มีเรือประมงลอยอยู่กลางทะเล' : 'เช่น: สวัสดีครับ นี่คือข้อความทดสอบสำหรับการแปลงเป็นเสียง'}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></textarea>
                  {activeTab === 'audio' && (
                    <button 
                      type="button"
                      className="absolute right-2 bottom-2 text-gray-400 hover:text-purple-600"
                      title="บันทึกเสียง"
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>กำลังประมวลผล...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>สร้าง{activeTab === 'image' ? 'รูปภาพ' : 'เสียง'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Display */}
          {result && (
            <div className="p-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-2">ผลลัพธ์:</div>
              <div className="bg-gray-50 rounded-lg p-3">
                {result.type === 'image' ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={result.url}
                      alt="Generated Image"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                    <button className="mt-3 text-sm text-purple-600 flex items-center gap-1 hover:text-purple-700 transition">
                      <span>ดาวน์โหลดรูปภาพ</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex justify-center">
                      <audio controls className="w-full">
                        <source src={result.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    <button className="mt-3 text-sm text-purple-600 flex items-center gap-1 hover:text-purple-700 transition">
                      <span>ดาวน์โหลดไฟล์เสียง</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">คุณสมบัติของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <ImagePlus size={20} />
                </div>
                <h3 className="font-medium">สร้างรูปภาพจากข้อความ</h3>
              </div>
              <p className="text-gray-600 text-sm">
                เพียงอธิบายรูปภาพที่คุณต้องการ AI จะสร้างรูปภาพที่สวยงามตามจินตนาการของคุณ
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Volume2 size={20} />
                </div>
                <h3 className="font-medium">แปลงข้อความเป็นเสียง</h3>
              </div>
              <p className="text-gray-600 text-sm">
                แปลงข้อความของคุณเป็นเสียงพูดที่เป็นธรรมชาติ เหมาะสำหรับการสร้างเนื้อหาเสียง
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 AI Generator | </p>
        </div>
      </footer>
    </div>
  );
}
