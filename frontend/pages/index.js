export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">
        Pencatat Uang Pertama di Indonesia
      </h1>
      <p className="text-gray-600 mb-8">
        Dengan fitur scan resi terintegrasi 🧾
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
      >
        Mulai Sekarang
      </a>
    </main>
  );
}
