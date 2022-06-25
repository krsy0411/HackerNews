const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

// 긁어올 페이지를 오픈
ajax.open('GET', NEWS_URL, false);
// 데이터를 전송
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');

// window객체
// NEWS_CONTENT
window.addEventListener('hashchange', function() {
  // hash를 알아내기(맨 앞의 #제거버젼)
  const id = location.hash.substring(1);

  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;
  content.appendChild(title);
  console.log(newsContent);
});

// NEWS_FEED
for(let i = 0; i < 10; i++) {
  // li는 항상 새로 만들어져야 하므로(덮어씌우기X) 반복문 안 쪽에서 객체 생성
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} ${newsFeed[i].comments_count}`;

  a.addEventListener('click', function() {});
  li.appendChild(a);
  ul.appendChild(li);
}

// 출력 부분
container.appendChild(ul);
container.appendChild(content);