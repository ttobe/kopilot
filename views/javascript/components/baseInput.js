import { BaseComponent } from './baseComponent.js';

const DISABLE_CLASSNAME = 'disable';

export class BaseInput extends BaseComponent {
  #delay;

  constructor(holder, delay = 50) {
    super(holder);
    this.#delay = delay;
  }

  reset() {
    this.holder.value = '';
    this.hide();
  }

  showPlaceholder(placeholder) {
    this.holder.placeholder = placeholder;
    this.show();
  }

  scroll() {
    this.holder.scrollTop = this.holder.scrollHeight;
  }

  getValue() {
    return this.holder.value;
  }

  initializeValue() {
    this.holder.value = '';
  }

  addValue(value) {
    this.holder.value += value;
  }

  replaceValue(value) {
    this.holder.value = value;
  }

  enable() {
    this.holder.readonly = true;
    this.holder.classList.remove(DISABLE_CLASSNAME);
  }

  disable() {
    this.holder.readonly = false;
    this.holder.classList.add(DISABLE_CLASSNAME);
  }

  async typeText(text) {
    while (text.length > 0) {
      const char = text.charAt(0);
      text = text.slice(1);

      this.#typeCharacter(char);
      await new Promise((resolve) => setTimeout(resolve, this.#delay));
    }
  }

  #typeCharacter(char) {
    requestAnimationFrame(() => {
      this.addValue(char);
      this.scroll();
    });
  }
}
