export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary'></div>
      <p className='ml-4 text-lg font-semibold text-muted-foreground'>로딩 중...</p>
    </div>
  )
}
