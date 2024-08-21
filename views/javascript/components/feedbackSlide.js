import { DomManager } from '../utils/domManager.js';
import { BaseSlide } from './base/baseSlide.js';

export class FeedbackSlide extends BaseSlide {
  #content;
  #dim;

  constructor(holder) {
    super(holder);
    this.#init();
  }

  toggle() {
    super.toggle();

    if (this.isActivated() && this.#content.innerHTML) {
      DomManager.showElement(this.#dim);
    }
  }

  #init() {
    this.#content = this.holder.querySelector('#feedback-content');

    this.#dim = this.holder.querySelector('.dim');
    this.#dim.onclick = () => DomManager.hideElement(this.#dim);
  }
}
