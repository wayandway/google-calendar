export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        // 새로운 기능 추가
        'feat',
        // 버그 수정
        'fix',
        // 문서 수정 (README.md 등)
        'docs',
        // 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
        'style',
        // 코드 리팩토링
        'refactor',
        // 테스트 코드 추가 및 수정
        'test',
        // 빌드 설정 변경, 패키지 매니저 설정 등
        'chore',
        // 이전 커밋으로 되돌리기
        'revert',
        // 성능 개선
        'perf',
      ],
    ],
  },
};
