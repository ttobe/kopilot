import { DomManager } from './domManager.js';

export class ScrollTracker {
  #holder;

  #prevScrollHeight;
  #scrollTop = null;

  constructor(holder) {
    this.#holder = holder;
  }

  keepPrevScrollHeight() {
    this.#prevScrollHeight = this.#holder.scrollHeight;
  }

  getScrollTop() {
    const scrollTop = this.#scrollTop;
    this.#scrollTop = null;
    return scrollTop;
  }

  setScrollTop() {
    const scrollTop = this.#holder.scrollTop;
    const clientHeight = this.#holder.clientHeight;
    const currScrollHeight = this.#holder.scrollHeight;

    const lineHeight = DomManager.calculateLineHeight(this.#holder);
    if (
      this.#isLastLine(scrollTop, clientHeight, currScrollHeight, lineHeight)
    ) {
      this.#scrollTop = currScrollHeight;
      return;
    }

    const diff = currScrollHeight - this.#prevScrollHeight;
    const maxScrollTop = this.#calculateScrollTop(
      currScrollHeight,
      clientHeight,
      lineHeight,
    );
    this.#scrollTop = Math.min(scrollTop + diff, maxScrollTop);
  }

  #isLastLine(scrollTop, clientHeight, currScrollHeight, lineHeight) {
    return (
      scrollTop + clientHeight >
      this.#getPositionBeforeLastNLine(currScrollHeight, lineHeight)
    );
  }

  #calculateScrollTop(scrollHeight, clientHeight, lineHeight) {
    return scrollHeight - clientHeight + lineHeight;
  }

  #getPositionBeforeLastNLine(scrollHeight, lineHeight, count = 1) {
    return scrollHeight - lineHeight * count;
  }
}
