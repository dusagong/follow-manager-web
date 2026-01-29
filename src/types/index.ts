export interface User {
  username: string;
  href?: string;
  timestamp?: number;
}

export interface FollowData {
  followers: User[];
  following: User[];
  notMutual: User[];
}

export type TabType = 'notMutual' | 'following' | 'followers';

export interface Translations {
  appTitle: string;
  uploadTitle: string;
  uploadDescription: string;
  howToDownload: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  selectFiles: string;
  dragAndDrop: string;
  followersFile: string;
  followingFile: string;
  analyze: string;
  notMutual: string;
  following: string;
  followers: string;
  searchPlaceholder: string;
  emptyList: string;
  reset: string;
  dataLoaded: string;
  invalidFile: string;
  missingFiles: string;
}

export const translations: Record<'ko' | 'en', Translations> = {
  ko: {
    appTitle: '팔로우 매니저',
    uploadTitle: '팔로우 데이터 분석',
    uploadDescription: 'Instagram에서 다운로드한 데이터 파일을 업로드하세요',
    howToDownload: '데이터 다운로드 방법',
    step1: '1. Instagram 앱 → 설정 → 계정 센터',
    step2: '2. 내 정보 및 권한 → 정보 다운로드',
    step3: '3. JSON 형식으로 요청',
    step4: '4. 이메일로 받은 파일에서 followers.json, following.json 업로드',
    selectFiles: '파일 선택',
    dragAndDrop: '또는 파일을 여기에 드래그하세요',
    followersFile: '팔로워 파일',
    followingFile: '팔로잉 파일',
    analyze: '분석하기',
    notMutual: '맞팔 안함',
    following: '팔로잉',
    followers: '팔로워',
    searchPlaceholder: '사용자 검색...',
    emptyList: '목록이 비어있습니다',
    reset: '초기화',
    dataLoaded: '데이터가 로드되었습니다',
    invalidFile: '올바른 형식의 파일이 아닙니다',
    missingFiles: '팔로워와 팔로잉 파일 모두 필요합니다',
  },
  en: {
    appTitle: 'Follow Manager',
    uploadTitle: 'Analyze Follow Data',
    uploadDescription: 'Upload your data files downloaded from Instagram',
    howToDownload: 'How to download data',
    step1: '1. Instagram App → Settings → Accounts Center',
    step2: '2. Your information and permissions → Download your information',
    step3: '3. Request in JSON format',
    step4: '4. Upload followers.json and following.json from the received files',
    selectFiles: 'Select Files',
    dragAndDrop: 'or drag and drop files here',
    followersFile: 'Followers file',
    followingFile: 'Following file',
    analyze: 'Analyze',
    notMutual: 'Not Mutual',
    following: 'Following',
    followers: 'Followers',
    searchPlaceholder: 'Search users...',
    emptyList: 'List is empty',
    reset: 'Reset',
    dataLoaded: 'Data loaded successfully',
    invalidFile: 'Invalid file format',
    missingFiles: 'Both followers and following files are required',
  },
};
