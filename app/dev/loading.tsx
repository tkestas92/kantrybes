export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-[#161616] rounded mb-4" />
      <div className="h-4 w-80 bg-[#161616] rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#161616] border border-[#252525] rounded-xl p-5 h-48" />
        ))}
      </div>
    </main>
  )
}
