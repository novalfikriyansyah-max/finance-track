export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        💰 Pencatat Uang Pertama di Indonesia
      </h1>
      <p className="text-gray-600 mb-8">
        Dengan fitur <span className="font-semibold text-blue-600">scan resi terintegrasi</span>
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Mulai Sekarang
      </a>
    </div>
  );
}
