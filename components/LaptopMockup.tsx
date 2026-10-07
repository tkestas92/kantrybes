export default function LaptopMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%]">
      <div className="rounded-t-lg bg-[#0a0a0a] border border-[#2e2e2e] p-1">
        <div className="aspect-[16/10] rounded-[3px] overflow-hidden bg-black">
          <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
        </div>
      </div>
      <div className="relative -mx-[3%] h-[7px] rounded-b-lg bg-[#1c1c1c] border border-t-0 border-[#2e2e2e]">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[18%] h-[3px] rounded-b bg-[#101010]" />
      </div>
    </div>
  )
}
