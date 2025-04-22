# 오늘 점심 뭐 먹지? 🍽️

회사 근처 점심 메뉴를 랜덤으로 추천해주는 웹 애플리케이션입니다.

## 기술 스택

-   [Next.js 15](https://nextjs.org) - React 프레임워크
-   [TypeScript](https://www.typescriptlang.org/) - 타입 안전성 확보
-   [Tailwind CSS](https://tailwindcss.com/) - 스타일링
-   [Shadcn UI](https://ui.shadcn.com/) - UI 컴포넌트
-   [Naver Map API](https://www.ncloud.com/product/applicationService/maps) - 지도 표시
-   [Supabase](https://supabase.com/) - 백엔드 서비스

## 시작하기

1. 저장소 클론

```bash
git clone <repository-url>
cd lunch-picker
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수를 설정:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=<your-naver-map-client-id>
```

4. 개발 서버 실행

```bash
npm run dev
```

5. [http://localhost:3000](http://localhost:3000)에서 결과를 확인하세요.

## 주요 기능

-   카테고리별 식당 필터링
-   랜덤 식당 추천
-   지도에서 식당 위치 확인
-   식당 상세 정보 표시

## 데이터 관리

현재는 샘플 데이터를 사용하고 있으며, Supabase를 통해 실시간 데이터를 연동할 수 있습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

lunch-picker/
├── app/ # Next.js 페이지들
│ ├── api/ # API 라우트
│ ├── features/ # 페이지별 기능
│ ├── globals.css # 전역 스타일
│ ├── layout.tsx # 레이아웃 컴포넌트
│ └── page.tsx # 메인 페이지
├── components/ # 재사용 가능한 컴포넌트
│ ├── common/ # 공통 컴포넌트
│ │ └── ui/ # UI 컴포넌트
│ ├── features/ # 기능별 컴포넌트
│ │ ├── map/ # 지도 관련 컴포넌트
│ │ └── restaurant/# 식당 관련 컴포넌트
│ └── layout/ # 레이아웃 컴포넌트
├── config/ # 환경 설정
├── constants/ # 상수 값
├── data/ # 정적 데이터
├── hooks/ # 커스텀 훅
├── lib/ # 유틸리티 함수
│ ├── services/ # 서비스 함수
│ └── utils/ # 유틸리티 함수
├── public/ # 정적 파일
└── types/ # TypeScript 타입 정의
