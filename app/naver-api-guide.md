# 네이버 API 설정 가이드

네이버 검색 API와 지도 API를 사용하기 위한 단계별 설정 가이드입니다.

## 1. 네이버 개발자 센터 가입

1. [네이버 개발자 센터](https://developers.naver.com)에 접속합니다.
2. 네이버 계정으로 로그인합니다.

## 2. 애플리케이션 등록

### 검색 API 애플리케이션 등록

1. [애플리케이션 관리](https://developers.naver.com/apps/#/list) 페이지로 이동합니다.
2. **Application 등록** 버튼을 클릭합니다.
3. 다음 정보를 입력합니다:
   - **애플리케이션 이름**: 원하는 이름 (예: "나의 검색 API")
   - **사용 API**: 검색 항목에서 "검색" 선택
   - **서비스 환경**: 웹 서비스 URL에 사용할 도메인 입력
     - 개발 환경: `http://localhost:3000`
     - 프로덕션 환경: 실제 서비스 도메인 입력
4. 이용 약관에 동의하고 등록합니다.
5. 등록 후 제공되는 **Client ID**와 **Client Secret**을 기록해둡니다.

### 지도 API 애플리케이션 등록

1. 필요한 경우 별도의 애플리케이션으로 지도 API를 등록합니다.
2. **Application 등록** 버튼을 클릭합니다.
3. 다음 정보를 입력합니다:
   - **애플리케이션 이름**: 원하는 이름 (예: "나의 지도 API")
   - **사용 API**: Maps 항목에서 "Maps" 선택
   - **서비스 환경**: 웹 서비스 URL에 사용할 도메인 입력
     - 개발 환경: `http://localhost:3000`
     - 프로덕션 환경: 실제 서비스 도메인 입력
4. 이용 약관에 동의하고 등록합니다.
5. 등록 후 제공되는 **Client ID**와 **Client Secret**을 기록해둡니다.

## 3. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 만들거나 수정하여 다음 정보를 추가합니다:

```
# 네이버 검색 API 설정
NEXT_PUBLIC_NAVER_CLIENT_ID=여기에_발급받은_클라이언트_ID
NEXT_PUBLIC_NAVER_CLIENT_SECRET=여기에_발급받은_클라이언트_시크릿

# 네이버 지도 API 설정 (Maps API용 별도 키를 발급받은 경우)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=여기에_지도용_클라이언트_ID
NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET=여기에_지도용_클라이언트_시크릿
```

## 4. 주의 사항

1. **API 사용량 제한**: 네이버 API는 일일 사용량 제한이 있습니다. 개발자 센터의 대시보드에서 사용량을 확인하세요.
2. **CORS 이슈**: 클라이언트에서 직접 네이버 API를 호출하면 CORS 이슈가 발생합니다. 반드시 서버를 통해 호출하세요.
3. **API 키 보안**: `.env.local` 파일은 절대 저장소에 커밋하지 마세요. API 키가 노출되지 않도록 주의하세요.
4. **환경 변수 접두사**: `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트에서 접근할 수 있습니다. 보안이 중요한 경우 서버 측에서만 사용하는 환경 변수로 변경하세요.

## 5. 추가 리소스

- [네이버 검색 API 문서](https://developers.naver.com/docs/serviceapi/search/local/local.md)
- [네이버 지도 API 문서](https://navermaps.github.io/maps.js.ncp/)
