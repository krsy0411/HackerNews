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

// 읽음처리 로직
function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function updateView(html: string): void {
  if(container) {
    container.innerHTML = html;
    } else {
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
    }
  }


// 뉴스 제목
function newsFeed(): void {
  const api = new NewsFeedApi();
  // 매번 페이지 전체 글들을 긁어오는것은 비효율적이므로, 읽은 글은 읽었다고 처리하고 저장하도록
  let newsFeed: NewsFeed[] = store.feeds;
  // ul 태그 안 쪽에 li a 태그를 10묶음 처리 해야하기 때문에 배열 이용
  const newsList = [];
  // 템플릿
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

  // 최초실행시, news_url의 데이터를 가져옴
  // 제네릭
  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(api.getData());
  }

  for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 목록 UI
    // 읽은 적이 있으면, 배경이 빨강색으로 처리되도록
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
          <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
          <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
        </div>  
      </div>
    </div>  
    `);
}

  // 템플릿 안에 마킹해놓은 자리에 for문으로 만들어진 코드를 집어넣기
  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  // 덮어씌우기
  // container안에 데이터가 없어서 null이 된다면 false로 인식하므로 if(container에 데이터가 있으면) {}
  updateView(template);
}


// 댓글기능
function makeComment(comments: NewsComment[]): string {
  // 댓글을 배열을 이용해서 담기
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];

    // 배열에 html형식으로 작성
    // 댓글에 댓글이 달릴때마다 indent 공간이 커지도록
    commentString.push(`
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
      commentString.push(makeComment(comment.comments));
    }
  }

  // push 내용을 하나의 문자열로 집어넣기
  return commentString.join('');
}





// 뉴스 내용
function newsDetail(): void {
  // hash를 알아내기(맨 앞의 #제거버젼)
  const id = location.hash.substring(7);
  // content_url 변수에 있는 @id(임시)를 알아낸 id값으로 대체
  const api = new NewsDetailApi();
  const newsDetail = NewsDetail = api.getData(id);
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsDetail.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsDetail.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  // read 내용을 true처리하도록
  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template);
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