import style from './loadingSpinner.module.css'
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-golemblue"></div>
      </div>
    </div>
  )
}

export const PulsingDotLoader = ({ className }: { className: string }) => {
  return (
    <div
      className={`${style.pulsar} rounded-full ${className} bg-golemblue`}
    ></div>
  )
}
