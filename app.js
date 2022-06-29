const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
  currentPage: 1,
};

// ajax 동작 수행처리 함수
function getData(url) {
  // 긁어올 페이지를 오픈
  ajax.open('GET', url, false);
  // 데이터를 전송
  ajax.send();

  // 함수처리의 결과물을 반환
  return JSON.parse(ajax.response);
}

// 뉴스 제목
function newsFeed() {
// ul 태그 안 쪽에 li a 태그를 10묶음 처리 해야하기 때문에 배열 이용
const newsList = [];

const newsFeed = getData(NEWS_URL);

// 배열 안에 먼저 ul태그 삽입
newsList.push('<ul>');

for(let i = (store.currentPage - 1) * 10; i < currentPage * 10; i++) {
  // 목록 UI
  newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} ${newsFeed[i].comments_count}
      </a>
    </li>
  `);
}
// 네비게이션 ui
newsList.push(`
  <div>
    <a href="#/page/${store.currentPage - 1}">이전 페이지</a>
    <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
  </div>
`);

newsList.push('</ul>');
// 덮어씌우기
container.innerHTML = newsList.join('');
};





// 뉴스 내용
function newsDetail() {
  // hash를 알아내기(맨 앞의 #제거버젼)
  const id = location.hash.substring(1);
  
  // content_url 변수에 있는 @id(임시)를 알아낸 id값으로 대체
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');
  
  // 글 내용 UI
  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  
  <div>
    <a href="#">목록으로</a>
  </div>
  `;
}

// 화면 전환을 위한 router
function router() {
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