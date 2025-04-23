import React from 'react'

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
      <h1>접근 제한</h1>
      <p>이 페이지에 접근할 권한이 없습니다.</p>
      <p>허용된 IP 주소에서만 접근 가능합니다.</p>
    </div>
  )
}
