import { RouteInfo } from '../types';
import View from './view';

export default class Router {
    routeTable: RouteInfo[];
    defaultPage: RouteInfo | null;
    constructor() {
      // window객체
      // hashchange를 화면전환을 위한 트리거로 사용
      // route메소드를 인자로 연결. Router의 인스턴스로 사용하기 위해 bind로 고정
      window.addEventListener('hashchange', this.route.bind(this));
  
      this.routeTable = [];
      this.defaultPage = null;
    }
  
    setDefaultPage(page: View): void {
      this.defaultPage = { path: '', page };
    }
  
    addRoutePath(path:string, page:View): void {
      this.routeTable.push({path, page});
    }
  
    route() {
      // hash 알아내기
      const routePath = location.hash;
      // defaultpage 체크
      if(routePath === '' && this.defaultPage) {
        this.defaultPage.page.render();
      }
  
      for (const routeInfo of this.routeTable) {
        if (routePath.indexOf(routeInfo.path) >= 0) {
          routeInfo.page.render();
          break;
        }
      }
    }
  }
  