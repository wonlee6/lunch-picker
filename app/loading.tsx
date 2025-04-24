const SPINNER_SIZE = 'w-16 h-16'
const SPINNER_BORDER = 'border-4'
const SPINNER_ANIMATION = 'animate-spin'

export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className={`${SPINNER_SIZE} ${SPINNER_BORDER} border-dashed rounded-full ${SPINNER_ANIMATION} border-primary`}></div>
      <p className='ml-4 text-lg font-semibold text-muted-foreground'>로딩 중...</p>
    </div>
  )
}
