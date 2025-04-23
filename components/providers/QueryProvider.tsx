'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하는 것이 일반적입니다.
        staleTime: 60 * 1000 // 1분
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버에서는 항상 새 클라이언트를 생성합니다.
    return makeQueryClient()
  } else {
    // 브라우저에서는 클라이언트를 한 번만 생성합니다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // 클라이언트 인스턴스를 한 번만 생성하도록 합니다.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서 React Query Devtools를 표시합니다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
