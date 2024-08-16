import { BasePopup } from './basePopup.js';

export class AlertPopup extends BasePopup {
  timeout;

  constructor(holder) {
    super(holder);
  }

  pop(title, timeout = 2000) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.set(title, '', () => this.hide(false));
    this.show();

    if (timeout >= 0) {
      this.timeout = setTimeout(() => this.hide(false), timeout);
    }
  }
}
