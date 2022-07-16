import View from '../core/view';

export interface Store {
    // 타입을 정의한 newsfeed를 배열에 사용
    feeds: NewsFeed[];
    currentPage: number;
  }
  
export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
    readonly title: string;
}
  // 배열 안에 들어가는 데이터들의 타입 결정
  // News를 확장시켜 NewsFeed를 인터페이스 하는 방법(extends)
export interface NewsFeed extends News {
    readonly comments_count: number,
    readonly points: number;
    read?: boolean;
}
  
export interface NewsDetail extends News {
    readonly comments: NewsComment[];
}
  
export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}
  
export interface RouteInfo {
    path: string;
    page: View;
    params: RegExp | null;
}