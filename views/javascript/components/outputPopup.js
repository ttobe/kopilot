import { DomManager } from '../utils/domManager.js';
import { BasePopup } from './base/basePopup.js';

export class OutputPopup extends BasePopup {
  constructor(title, content, applyCallback) {
    super(
      document.getElementById('output-popup'),
      document.getElementById('overlay'),
    );
    this.set(title, content, applyCallback, () => this.hide());
  }

  show(title, content, okCallback, cancelCallback = null) {
    super.show(title, content, okCallback, cancelCallback);

    const radioBtnGroup = this.holder.querySelector('.radio-btn-group');
    if (radioBtnGroup) {
      DomManager.hideElement(radioBtnGroup);
    }
  }

  hideButton() {
    DomManager.hideElement(this.okBtn);
    DomManager.hideElement(this.cancelBtn);
  }

  showButton() {
    DomManager.showElement(this.okBtn);
    DomManager.showElement(this.cancelBtn);
  }

  hideApplyButton() {
    DomManager.hideElement(this.okBtn);
  }
}
