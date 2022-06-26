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

  title.innerHTML = newsContent.title;
  content.appendChild(title);
  console.log(newsContent);
});

// NEWS_FEED
for(let i = 0; i < 10; i++) {
  // li는 항상 새로 만들어져야 하므로(덮어씌우기X) 반복문 안 쪽에서 객체 생성
  const div = document.createElement('div');
  const li = document.createElement('li');
  const a = document.createElement('a');

  // 문자열을 활용 - html 구조 작성(DOM작성)
  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} ${newsFeed[i].comments_count}
      </a>
    </li>
  `;

  // div ul li 순서
  // ul의 자식요소로 div의 첫번째 자식요소(li)
  ul.appendChild(div.firstElementChild);
}

// 출력 부분
container.appendChild(ul);
container.appendChild(content);