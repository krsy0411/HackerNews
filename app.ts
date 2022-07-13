interface Store {
  currentPage: number;
  // 타입을 정의한 newsfeed를 배열에 사용
  feeds: NewsFeed[];
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
  readonly title: string;
}
// 배열 안에 들어가는 데이터들의 타입 결정
// News를 확장시켜 NewsFeed를 인터페이스 하는 방법(extends)
interface NewsFeed extends News {
  readonly comments_count: number,
  readonly points: number;
  read?: boolean;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

const container: HTMLElement | null = document.getElementById('root');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store: Store = {
  currentPage: 1,
  feeds: [],
};

// 믹스인 상속 코드
// targetClass로 제공된 class에 baseClasses로 제공된 n개의 class의 기능들을 합성시키는 코드
function applyApiMixins(targetClass: any, baseClasses:any[]): void {
  baseClasses.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    })
  })
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    // 긁어올 페이지를 오픈
    ajax.open('GET', url, false);
    // 데이터를 전송
    ajax.send();

    // 함수처리의 결과물을 반환
    return JSON.parse(ajax.response);   
  }
}

class NewsFeedApi {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));
  }
}

interface NewsFeedApi extends Api {};
interface NewsDetailApi extends Api {};

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);








class View {
  template: string;
  renderTemplate: string;
  container: HTMLElement;
  htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);

    // containerElement가 null로 반환될 수 있기에 예외처리
    if(!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다'
    }

    // 초기화
    this.container = containerElement;
    this.template = template;
    this.renderTemplate: template;
    this.htmlList = [];
  }

  updateView(): void {
      this.container.innerHTML = this.template;
    }
  
  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }
  
  getHtml(): string {
    return this.htmlList.join('');
  }

  setTemplateData(key: string, value: string): void {
    this.template = this.template.replace(`{{__${key}__}}`, value);
  }
}











class NewsFeedView extends View {
  api: NewsFeedApi;
  feeds: NewsFeed[];

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
    <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
      </div>
    `;
    
    super(containerId, template);

    this.api = new NewsFeedApi();
    // 매번 페이지 전체 글들을 긁어오는것은 비효율적이므로, 읽은 글은 읽었다고 처리하고 저장하도록
    this.feeds = store.feeds;

    // 최초실행시, news_url의 데이터를 가져옴
    // 제네릭
    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.makeFeeds(this.api.getData());
      this.makeFeeds();
    }
  

  }

  render(): void {
      for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        const {id, title, comments_count, user, points, time_ago, read} = this.feeds[i];
        // 목록 UI
        // 읽은 적이 있으면, 배경이 빨강색으로 처리되도록
        this.addHtml(`
          <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${id}">${title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${user}</div>
              <div><i class="fas fa-heart mr-1"></i>${points}</div>
              <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
            </div>  
          </div>
        </div>  
        `);
    }

    // 템플릿 안에 마킹해놓은 자리에 for문으로 만들어진 코드를 집어넣기
    this.setTemplateData('news_feed', this.getHtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage + 1));
      
        // 덮어씌우기
    // container안에 데이터가 없어서 null이 된다면 false로 인식하므로 if(container에 데이터가 있으면) {}
    updateView(template);
  }

    // 읽음처리 로직
  makeFeeds(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}











class NewsDetailView extends View {
  constructor(containerId: string) {
    let template:string = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div> 
          </div>
        </div>

        <div class="h-full border rounded-xl bg-white m-6 p-4">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>   

          {{__comments__}}

        </div>
      </div>
    `;

    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
    const newsDetail: NewsDetail = api.getData();

    for(let i=0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
    this.setTemplateData('{{__comments__}}', this.makeComment(newsDetail.comments));
    this.setTemplateData('currentPage', String(store.currentPage));
    this.setTemplateData('title', newsDetail.title);
    this.setTemplateData('content', newsDetail.content);
    this.updateView();
  }
  

  // 댓글기능
  makeComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];

      // 배열에 html형식으로 작성
      // 댓글에 댓글이 달릴때마다 indent 공간이 커지도록
      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>   
      `);

      // 대댓글 내용들을 재귀함수 형태로 push
      // i번째 대댓글의 댓글이 존재하면
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }

    // push 내용을 하나의 문자열로 집어넣기
    return this.getHtml();
  }

}













// 화면 전환을 위한 router
function router(): void {
  // hash 알아내기
  const routePath = location.hash;

  // routePath가 비어있을 때(hash가 비어있을 때) === 첫 진입
  // '목록으로' 또한 hash가 비어있기 때문에 newsFeed로 연결됨
  // location.hash의 값에 #만 존재하면 빈 값으로 처리됨
  if (routePath === '') {
    // 뉴스 제목 가져오기
    newsFeed();
    // 해당 문자열이 있으면 0이상의 위치값, 없으면 -1 반환
  } else if (routePath.indexOf('#/page/') >= 0) { 
    store.currentPage = Number(routePath.substring(7));
    newsFeed();
  } else {
    // 뉴스 글 가져오기
    newsDetail();
  }
};

// window객체
// hashchange를 화면전환을 위한 트리거로 사용(router를 연결)
window.addEventListener('hashchange', router);

router();