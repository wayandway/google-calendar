import Image from 'next/image';

export default function Home() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">월간 보기</h2>
      {/* 캘린더 그리드 */}
      <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)]"></div>
    </div>
  );
}
