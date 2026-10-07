export default function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 aspect-[9/19.5] rounded-[20px] bg-[#0a0a0a] border border-[#2e2e2e] p-1">
      <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-contain" />
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black border border-[#1f1f1f]" />
      </div>
    </div>
  )
}
