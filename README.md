# Nano Banana - AI Fashion Stylist

Nano Banana는 Gemini AI를 활용한 지능형 패션 스타일리스트 애플리케이션입니다. 사용자의 옷장과 쇼핑 아이템을 분석하고, 가상 피팅(Virtual Try-On) 기능을 통해 스타일링을 제안합니다.

## 주요 기능 (Features)

### 1. AI 패션 분석 (AI Fashion Analyst)
- **이미지 인식**: 업로드된 패션 이미지에서 의류 아이템을 자동으로 감지하고 분류합니다.
- **상세 태깅**: 카테고리, 색상, 소재, 브랜드, 가격 등을 AI가 분석하여 태깅합니다.
- **스튜디오 (Studio)**: 사용자가 업로드한 사진을 분석하여 개별 아이템으로 분리하고, 각 아이템의 썸네일을 생성합니다.

### 2. 지능형 썸네일 생성 (Smart Thumbnail Generation)
- **이미지 기반 생성**: 원본 이미지에서 아이템을 크롭하여 깔끔한 누끼 썸네일을 생성합니다.
- **자동 폴백 (Fallback)**: 이미지 크롭이 불완전하거나 생성에 실패할 경우, AI가 아이템의 텍스트 설명(`searchQuery`)을 바탕으로 고품질의 썸네일을 자동으로 생성합니다.

### 3. 가상 피팅 (Virtual Try-On)
- **스타일 시각화**: 사용자의 사진에 선택한 의류 아이템을 가상으로 입혀볼 수 있습니다.
- **자연스러운 합성**: AI가 신체 포즈와 옷의 주름을 고려하여 자연스러운 착용 샷을 생성합니다.

## 기술 스택 (Tech Stack)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI Model**: Google Gemini 2.5 Flash (분석), Gemini 3 Pro Image Preview (이미지 생성)
- **Styling**: Tailwind CSS

## 시작하기 (Getting Started)

### 환경 변수 설정
`.env.local` 파일을 생성하고 Gemini API 키를 설정해야 합니다.

```bash
GEMINI_API_KEY=your_api_key_here
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인하세요.
