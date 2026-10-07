export default function BrowserMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[94%] rounded-t-lg border border-b-0 border-[#2e2e2e] bg-black overflow-hidden">
      <div className="h-[18px] bg-[#151515] flex items-center gap-1 px-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
      </div>
      <div className="relative aspect-[16/10]">
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-top" />
      </div>
    </div>
  )
}
