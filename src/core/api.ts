import { NewsDetail, NewsFeed } from '../types';

export class Api {
    ajax: XMLHttpRequest;
    url:string;
  
    constructor(url: string) {
      this.ajax = new XMLHttpRequest();
      this.url = url;
    }
  
    getRequest<AjaxResponse>(): AjaxResponse {
      // 긁어올 페이지를 오픈
      this.ajax.open('GET', this.url, false);
      // 데이터를 전송
      this.ajax.send();
  
      // 함수처리의 결과물을 반환
      return JSON.parse(this.ajax.response) as AjaxResponse;   
    }
  }
  
export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }
    getData(): NewsFeed[] {
      return this.getRequest<NewsFeed[]>();
    }
}
  
export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
    }
}





