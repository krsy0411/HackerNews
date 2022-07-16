import View from '../core/view';
import {NewsDetailApi} from '../core/api';
import {NewsDetail, NewsComment} from '../types';
import {CONTENT_URL} from '../config';
 

const template:string = `
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

export default class NewsDetailView extends View {
    constructor(containerId: string) {
      super(containerId, template);
    }
  
    render = (id:string): void => {
      const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
      const newsDetail: NewsDetail = api.getData();
  
      for(let i=0; i < window.store.feeds.length; i++) {
        if (window.store.feeds[i].id === Number(id)) {
            window.store.feeds[i].read = true;
          break;
        }
      }
      this.setTemplateData('{{__comments__}}', this.makeComment(newsDetail.comments));
      this.setTemplateData('currentPage', String(window.store.currentPage));
      this.setTemplateData('title', newsDetail.title);
      this.setTemplateData('content', newsDetail.content);
      this.updateView();
    }
    
  
    // 댓글기능
    private makeComment(comments: NewsComment[]): string {
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