const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

// ajax 동작 수행처리 함수
function getData(url) {
  // 긁어올 페이지를 오픈
  ajax.open('GET', url, false);
  // 데이터를 전송
  ajax.send();

  // 함수처리의 결과물을 반환
  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

// window객체
// NEWS_CONTENT
window.addEventListener('hashchange', function() {
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
});

// ul 태그 안 쪽에 li a 태그를 10묶음 처리 해야하기 때문에 배열 이용
const newsList = [];
// 배열 안에 먼저 ul태그 삽입
newsList.push('<ul>');

// NEWS_FEED
for(let i = 0; i < 10; i++) {
  // 목록 UI
  newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} ${newsFeed[i].comments_count}
      </a>
    </li>
  `);
}

newsList.push('</ul>');
// 덮어씌우기
container.innerHTML = newsList.join('');