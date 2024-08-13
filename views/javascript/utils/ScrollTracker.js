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
    const maxScrollTop = this.#calculateScrollTop(
      currScrollHeight,
      lineHeight,
      clientHeight,
    );

    if (
      this.#isLastLine(scrollTop, clientHeight, currScrollHeight, lineHeight)
    ) {
      // FIXME 약간의 흔들림 문제로 lineHeight 추가 (추후 원인 파악 필요)
      this.#scrollTop = maxScrollTop + lineHeight;
      return;
    }
    const diff = currScrollHeight - this.#prevScrollHeight;
    this.#scrollTop = Math.min(scrollTop + diff, maxScrollTop);
  }

  #isLastLine(scrollTop, clientHeight, currScrollHeight, lineHeight) {
    return (
      scrollTop + clientHeight >
      this.#getPositionBeforeLastNLine(currScrollHeight, lineHeight)
    );
  }

  #calculateScrollTop(scrollHeight, lineHeight, clientHeight) {
    return scrollHeight + lineHeight - clientHeight;
  }

  #getPositionBeforeLastNLine(scrollHeight, lineHeight, count = 1) {
    return scrollHeight - lineHeight * count;
  }
}
