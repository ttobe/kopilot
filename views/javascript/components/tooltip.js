import { COPY_STYLE } from '../constants/copyStyle.js';
import { STYLE } from '../constants/style.js';
import { DomManager } from '../utils/domManager.js';
import { BaseComponent } from './base/baseComponent.js';

export class Tooltip extends BaseComponent {
  anchor;
  #lineHeight;

  constructor(holder, anchor) {
    super(holder);
    this.anchor = anchor;
    this.#lineHeight = DomManager.calculateLineHeight(this.anchor);
  }

  updatePosition() {
    const { top, left } = Tooltip.getCursorCoordinates(this.anchor);
    this.holder.style.top = `${top + this.#lineHeight}px`;
    this.holder.style.left = `${left}px`;
  }

  static getCursorCoordinates(anchor) {
    const div = Tooltip.makeDummyDiv(anchor);
    const span = document.createElement('span');

    span.textContent = '|';
    div.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    document.body.removeChild(div);

    const rect = anchor.getBoundingClientRect();
    const style = getComputedStyle(anchor);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingLeft = parseFloat(style.paddingLeft);
    const borderTopWidth = parseFloat(style.borderTopWidth);
    const borderLeftWidth = parseFloat(style.borderLeftWidth);

    return {
      top:
        rect.top +
        window.scrollY +
        offsetTop -
        anchor.scrollTop +
        paddingTop +
        borderTopWidth,
      left:
        rect.left +
        window.scrollX +
        offsetLeft -
        anchor.scrollLeft +
        paddingLeft +
        borderLeftWidth,
    };
  }

  static makeDummyDiv(anchor) {
    const val = anchor.value;
    const cursorPointer = anchor.selectionStart;

    const div = document.createElement('div');
    const style = getComputedStyle(anchor);

    for (const prop of COPY_STYLE) {
      div.style[prop] = style[prop];
    }

    DomManager.changePosition(div, STYLE.POSITION.ABSOLUTE);
    DomManager.changeVisibility(div, STYLE.VISIBILITY.HIDDEN);

    div.textContent = val.substring(0, cursorPointer);

    document.body.appendChild(div);
    return div;
  }
}
