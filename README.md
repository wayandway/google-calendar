# Google Calendar Clone Project

[Google Calendar](https://calendar.google.com/calendar) 서비스 중 주간별/월간별 캘린더 뷰를 클론 개발한 프로젝트입니다.

## 1. 기본 내용

### 기술 스택

- **NextJs15**, **React19**
- **Tailwind CSS(v4)**
- **Redux Toolkit**
- **date-fns**
- **Lucide React**
- **Yarn Berry**

### 배포 링크

https://google-calendar-swart.vercel.app

### 실행 방법

1.  **리포지토리 클론**
    ```bash
    git clone https://github.com/wayandway/google-calendar
    ```
2.  **설치**
    ```bash
    yarn install
    ```
3.  **실행**
    ```bash
    yarn dev
    # 브라우저에서 http://localhost:3000 접속 후 애플리케이션 확인 가능
    ```

## 2. 상태의 흐름

### 2.1. 전역 상태 관리 (Redux Toolkit)

- `calendarSlice` : 현재 날짜, 뷰 모드 (월/주), 선택된 날짜 등 캘린더의 핵심 상태를 관리합니다.

- `eventSlice` : 생성, 수정, 삭제되는 모든 이벤트(일정) 데이터를 관리합니다.

- `layoutSlice` : 사이드바, 미니 캘린더, 모달의 열림/닫힘 상태 등 UI 레이아웃 관련 상태를 관리합니다.

### 2.2. 미니 캘린더와 메인 캘린더의 동기화

- 두 캘린더는 동일한 `calendarSlice`의 `currentDate` 상태를 공유합니다.

- 사용자가 어느 한 캘린더에서 날짜를 변경하면 `setCurrentDate` 액션을 디스패치하여 전역 상태를 업데이트하고, 이 변화는 즉시 다른 캘린더에도 반영되어 동기화된 뷰를 볼 수 있습니다.

### 2.3. 모달 상태 관리

- 이벤트 생성 모달(`EventFormModal`)과 이벤트 상세 보기 모달(`EventViewModal`)은 `layoutSlice`의 상태(`isFormModalOpen`, `isViewModalOpen`)에 따라 열리고 닫힙니다.

- 또한 `MainCalendar` 컴포넌트에서 클릭된 날짜나 이벤트의 위치를 계산해 모달의 `position` 상태로 전달되고, 모달이 사용자가 클릭한 위치 근처에 나타나도록 관리합니다.

### 2.4. 상태 저장 - 로컬스토리지

- 사용자가 생성한 이벤트 데이터는 브라우저의 로컬스토리지에 저장되어 애플리케이션을 닫았다가 다시 열어도 데이터가 유지되도록 했습니다.

## 3. UX를 위해 추가한 요소들

실제 Google Calendar 프로덕트에서 제공하는 다양한 기능을 최대한 포함하려고 노력했습니다.

- **스크롤로 이전/다음 달 스크롤 이동**
  <br/> 월별 캘린더 뷰에서 마우스 휠 스크롤을 통해 이전 달 또는 다음 달로 쉽게 이동할 수 있습니다.

- **주간별 캘린더뷰 드래그앤드롭**
  <br/> 주간별 캘린더 뷰에서 드래그앤드롭을 통해 15분 단위로 자유롭게 날짜 및 시간을 지정하여 이벤트를 생성할 수 있습니다.

- **반복 일정 선택지**
  <br/> 이벤트 생성 시 반복 일정(매일, 매주, 매월, 매년, 주중 매일) 선택지를 추가했으며, 시작 날짜를 기준으로 반복 규칙을 자동으로 생성합니다.

## 4. 주요 문제 해결 사항

- **이벤트 일정 중복 구현**
<br/> 여러 이벤트(일정)가 동시에 발생할 경우 겹치지 않게 시각적으로 표시하는 레이아웃 구현에 어려움이 있었습니다.
<br/> → 해결: `WeekView.tsx`에서 이벤트의 시작 시간과 종료 시간을 기준으로 그리드 셀의 위치를 계산하고, `grid-row-start`와 `grid-row-end` 속성을 사용하여 이벤트의 세로 위치와 높이를 동적으로 조정했습니다. 또한 z-index를 활용하여 이벤트가 겹칠 때 시각적으로 구분되도록 구현했습니다.

- **모달 UI 구현**
<br/>실제 Google Calendar의 모달과 유사하게 디자인하고 사용자의 클릭 위치에 따라 모달이 나타나며, 내부 요소들이 적절하게 배치되도록 하는 데 많은 스타일 조정이 필요했습니다.
<br/> → 해결: `EventFormModal.tsx`에서 모달의 위치를 클릭한 날짜의 왼쪽에 나타나도록 `MainCalendar.tsx`의 위치 계산 로직을 수정하고, 모달이 뷰포트를 벗어나지 않도록 조정하는 로직을 추가했습니다. 또한 모달 내부 요소들의 레이아웃을 Flexbox를 사용하여 세로로 배치하고, 모달의 높이를 내용에 맞춰 자동으로 조절되도록 `h-fit`으로 설정했습니다.

## 5. 성능 체크

### 5.1. Lighthouse 성능 검사

- Performance : 84점
- Accessibility : 89점
- Best Practices & SEO : 100점
- 주요 이슈
  - `LCP`: 2.5s - 핵심 콘텐츠 지연 렌더링
  - `TBT`: 160ms - 일부 연산 최적화 필요
  - `warn - Unable to preventDefault inside passive event listener` : 스크롤 이벤트 리스너 최적화 필요

### 5.2. 리렌더링

- 리렌더링 없음 (React Developer Tools 기준 확인 완료)

## 6. 추가 개선해야 할 점

- 모달 UI 추가 개선

- 월간 캘린더 뷰에서 다중 날짜 선택 구현

- 성능 개선

- 애니메이션 추가(페이지 전환, 이벤트 생성/삭제, 모달 열림/닫힘 등)
