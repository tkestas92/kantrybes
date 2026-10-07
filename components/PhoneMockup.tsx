export default function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[44%] aspect-[9/19.5] flex rounded-[18px] bg-[#0a0a0a] border border-[#2e2e2e] p-1">
      <div className="relative flex-1 rounded-[14px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-top" />
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black border border-[#1f1f1f]" />
      </div>
    </div>
  )
}
