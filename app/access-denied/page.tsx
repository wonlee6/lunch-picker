export default function AccessDeniedPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <h1 className='text-3xl font-bold text-center'>접근 제한</h1>
      <p className='text-center text-muted-foreground mt-2'>이 페이지에 접근할 권한이 없습니다.</p>
    </div>
  )
}
