import {
  formalEndingMap,
  plainEndingMap,
  politeEndingMap,
} from '../constants/endingMap.js';
import { InputTracker } from './inputTracker.js';
import { Pointer } from './pointer.js';

export class AutoCompletion {
  #endingMap = formalEndingMap;

  #inputTracker;

  #pointer;

  #cursorBox;

  constructor(cursorBox) {
    this.#inputTracker = new InputTracker();
    this.#pointer = new Pointer();
    this.#cursorBox = cursorBox;
  }

  getEnding() {
    return this.#getEndingWithWord() ?? this.#getEndingWithLastChar();
  }

  #getEndingWithWord() {
    return this.#endingMap[this.#inputTracker.getWord()];
  }

  #getEndingWithLastChar() {
    return this.#endingMap[this.#inputTracker.getLastChar()];
  }

  hasEnding() {
    return this.getEnding() ? true : false;
  }

  setEndingType(selected) {
    this.#endingMap =
      selected === 'formal'
        ? formalEndingMap
        : selected === 'polite'
          ? politeEndingMap
          : plainEndingMap;
  }

  hasChar() {
    return this.#inputTracker.hasChar();
  }

  emptyChar() {
    this.#inputTracker.emptyChar();
  }

  updateChar(char) {
    this.#inputTracker.updateChar(char);
  }

  backspaceChar() {
    this.#inputTracker.backspaceChar();
  }

  updateWord(char) {
    this.#inputTracker.updateWord(char);
  }

  backspaceWord() {
    this.#inputTracker.backspaceWord();
    if (!this.hasEnding()) {
      this.emptyCursorBox();
    }
  }

  getPointer() {
    return this.#pointer.get();
  }

  emptyBuffers() {
    this.#inputTracker.emptyWord();
    this.emptyChar();
    this.#pointer.empty();
  }

  showCursorBox(pointer) {
    this.#pointer.set(pointer);
    this.#cursorBox.show(this.getEnding());
  }

  emptyCursorBox() {
    this.#cursorBox.empty();
  }

  emptyAll() {
    this.emptyCursorBox();
    this.emptyBuffers();
  }
}
