export default abstract class View {
    private template: string;
    // replace의 대상이 되는 템플릿
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];
  
    constructor(containerId: string, template: string) {
      const containerElement: HTMLElement | null = document.getElementById(containerId);
  
      // containerElement가 null로 반환될 수 있기에 예외처리
      if(!containerElement) {
        throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다'
      }
  
      // 초기화
      this.container = containerElement;
      this.template = template;
      this.renderTemplate = template;
      this.htmlList = [];
    }
  
    protected updateView(): void {
        this.container.innerHTML = this.renderTemplate;
        this.renderTemplate = this.template;
      }
    
    protected addHtml(htmlString: string): void {
      this.htmlList.push(htmlString);
    }
    
    protected getHtml(): string {
      const snapshot = this.htmlList.join('');
      this.clearHtmlList();
      return snapshot;
    }
  
    protected setTemplateData(key: string, value: string): void {
      this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }
  
    private clearHtmlList(): void {
      this.htmlList = [];
    }
  
  
      // 자식 class들에게 render기능을 구현하도록 강제시키기
      abstract render(...params: string[]): void;
  }