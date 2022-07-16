import Router from './core/router';
import {NewsDetailView, NewsFeedView} from './page';
import {Store} from './types'

const store: Store = {
  currentPage: 1,
  feeds: [],
};

declare global {
  interface Window {
    store: Store;
  }
}

window.store = store;

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);

router.addRoutePath('./page', newsFeedView);
router.addRoutePath('./page', newsDetailView);
//최초 진입시 라우터 함수 직접 실행(처음엔 혼자 작동하지 X)
router.go();
