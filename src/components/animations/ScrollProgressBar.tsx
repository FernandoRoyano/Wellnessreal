export default function ScrollProgressBar() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
    >
      <div className="scroll-progress h-full origin-left" />
    </div>
  )
}
