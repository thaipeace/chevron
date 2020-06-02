import {Directive, ElementRef, OnInit, Input} from '@angular/core';

@Directive({
  selector: '[appToggleCollapse]'
})
export class ToggleCollapseDirective implements OnInit {

  @Input() collapsed: boolean = false;

  constructor(
    private element: ElementRef
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      let containerDefaultStyle = 'position: relative; border-right: 1px solid #24334f; transition: all 0.5s;';
      let container = this.element.nativeElement;
      container.setAttribute('style', containerDefaultStyle);
      container.querySelector('div').classList.add('wrapper');

      let toggleLeftDefaultStyle = 'position: absolute; top: 0; right: -10px; height: 100%; display: flex; justify-content: center; align-items: center; cursor: w-resize;';
      let toggleLeft = document.createElement('div');
      toggleLeft.setAttribute('style', toggleLeftDefaultStyle);

      const size = '24px';

      let defaultBtnCollapsedStyle = `transform: rotate(180deg); width: ${size}; height: ${size}; background-color: #119ed9; z-index: 1; text-align: center; line-height: ${size};font-size: 18px;padding-right: 3px;`;
      let defaultBtnExpandedStyle = `transform: rotate(0); width: ${size}; height: ${size}; background-color: #119ed9; z-index: 1; text-align: center; line-height: ${size};transition: all 0.5s;font-size: 18px;`;
      let toggleBtn = document.createElement('i');
      toggleBtn.setAttribute('class', 'fal fa-angle-left text-white rounded-circle cursor-pointer');
      toggleBtn.setAttribute('style', defaultBtnExpandedStyle);

      toggleLeft.appendChild(toggleBtn);
      container.appendChild(toggleLeft);

      toggleBtn.onclick = (event) => {
        console.log('toggle button');
        event.preventDefault();
        event.stopPropagation();
        this.toggleEvent(container, toggleBtn, containerDefaultStyle, defaultBtnCollapsedStyle, defaultBtnExpandedStyle);
        return false;
      };

      toggleLeft.onclick = (event) => {
        console.log('toggle left');
        event.preventDefault();
        event.stopPropagation();
        this.toggleEvent(container, toggleBtn, containerDefaultStyle, defaultBtnCollapsedStyle, defaultBtnExpandedStyle);
        return false;
      };


      toggleLeft.addEventListener('mouseover', (e) => {
        if (this.collapsed) {
          return;
        }
        toggleBtn.setAttribute('style', `visibility: visible; ${defaultBtnExpandedStyle}`);
        container.setAttribute('style', ` ${containerDefaultStyle}; border-color: #2496c9;`);
      });

      toggleLeft.addEventListener('mouseout', (e) => {
        if (this.collapsed) {
          return;
        }
        toggleBtn.setAttribute('style', `visibility: hidden; ${defaultBtnExpandedStyle}`);
        container.setAttribute('style', `${containerDefaultStyle}`);
      });

      //init collapsed
      if (this.collapsed) {
        this.collapsed = false;
        this.toggleEvent(container, toggleBtn, containerDefaultStyle, defaultBtnCollapsedStyle, defaultBtnExpandedStyle);
      }
    });
  }

  toggleEvent(container, toggleBtn, containerDefaultStyle, defaultBtnCollapsedStyle, defaultBtnExpandedStyle) {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      container.classList.add('wrapper-collapsed');
      container.querySelector('.wrapper').setAttribute('style', 'overflow: hidden;');
      container.setAttribute('style', `width: 0; max-width: 0; ${containerDefaultStyle}`);
      toggleBtn.setAttribute('style', defaultBtnCollapsedStyle);
    } else {
      container.classList.remove('wrapper-collapsed');
      container.querySelector('.wrapper').setAttribute('style', 'overflow: visible;');
      container.setAttribute('style', `${containerDefaultStyle}`);
      toggleBtn.setAttribute('style', defaultBtnExpandedStyle);
    }
  }
}
