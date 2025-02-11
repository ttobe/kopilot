import { DomManager } from '../../utils/domManager.js';
import { BaseComponent } from './baseComponent.js';

export class BasePopup extends BaseComponent {
  overlay;

  title;
  content;

  okBtn;
  cancelBtn;

  constructor(holder, overlay = null) {
    super(holder);
    this.overlay = overlay;

    this.#init();
  }

  show() {
    super.show();
    if (this.overlay) {
      DomManager.showElement(this.overlay);
    }
  }

  hide(overlayHide = true) {
    super.hide();
    if (overlayHide) {
      DomManager.hideElement(this.overlay);
    }
  }

  set(title, content, okCallback, cancelCallback = null) {
    this.title.innerHTML = title;
    if (this.content) {
      this.content.innerHTML = content;
    }

    DomManager.overrideClickEvent(this.okBtn, okCallback);
    if (cancelCallback === null) {
      return;
    }
    DomManager.overrideClickEvent(this.cancelBtn, cancelCallback);
  }

  #init() {
    this.title = this.holder.querySelector('.title');
    this.content = this.holder.querySelector('.content');
    this.okBtn = this.holder.querySelector('.ok-btn');
    this.cancelBtn = this.holder.querySelector('.cancel-btn');
  }
}
