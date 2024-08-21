import { BaseComponent } from './baseComponent.js';

const ACTIVE = 'active';

export class BaseSlide extends BaseComponent {
  constructor(holder) {
    super(holder);
  }

  isActivated() {
    return Array.from(this.holder.classList).find((item) => item === ACTIVE);
  }

  toggle() {
    this.holder.classList.toggle(ACTIVE);
  }
}
