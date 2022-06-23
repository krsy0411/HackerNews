const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';

ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');

for(let i = 0; i < 10; i++) {
  // li는 항상 새로 만들어져야 하므로(덮어씌우기X) 반복문 안 쪽에서 객체 생성
  const li = document.createElement('li');

  li.innerHTML = newsFeed[i].title;

  ul.appendChild(li);
}

document.getElementById('root').appendChild(ul);