import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 허용할 IP 주소 목록
const ALLOWED_IPS = [process.env.NEXT_PUBLIC_ALLOWED_IP]

// 개발 환경에서 허용할 IP (선택 사항)
const DEV_IPS = ['127.0.0.1', '::1']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 접근 제한 페이지 자체에 대한 요청은 IP 검사를 건너뜀
  if (pathname === '/access-denied') {
    return NextResponse.next()
  }

  // Vercel 환경 등에서 클라이언트 IP 주소 가져오기
  const realIp = request.headers.get('x-real-ip')
  const forwarded = request.headers.get('x-forwarded-for')
  let userIp: string | null = null

  if (realIp) {
    userIp = realIp.trim()
  } else if (forwarded) {
    userIp = forwarded.split(',')[0].trim()
  }

  console.log('접근 시도 - x-real-ip:', realIp)
  console.log('접근 시도 - x-forwarded-for:', forwarded)
  console.log('최종 확인된 IP:', userIp)

  // 현재 환경이 개발 환경인지 확인 (선택 사항)
  const isDevelopment = process.env.NODE_ENV === 'development'

  // 허용된 IP 목록
  let allowedIpList = [...ALLOWED_IPS]
  if (isDevelopment) {
    allowedIpList = [...allowedIpList, ...DEV_IPS]
  }

  // IP 주소를 확인할 수 없는 경우 차단 페이지로 rewrite
  if (!userIp) {
    console.error('사용자 IP 주소를 확인할 수 없습니다.')
    const url = request.nextUrl.clone()
    url.pathname = '/access-denied'
    return NextResponse.rewrite(url)
  }

  // IP 주소 확인 후 차단 시 차단 페이지로 rewrite
  if (!allowedIpList.includes(userIp)) {
    console.warn(`차단된 IP 접근: ${userIp}`)
    const url = request.nextUrl.clone()
    url.pathname = '/access-denied'
    return NextResponse.rewrite(url)
  }

  // 허용된 IP 주소일 경우 요청 계속 진행
  return NextResponse.next()
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - access-denied (the access denied page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|access-denied).)*'
  ]
}
