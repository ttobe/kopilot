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

  canActivate() {
    return this.#getEnding() ? true : false;
  }

  activate(pointer) {
    this.#showCursorBox(pointer);
  }

  reset() {
    this.#cursorBox.empty();
    this.#emptyBuffers();
  }

  execute(
    removeIncompleteCallback,
    insertPhraseCallback,
    setNextCursorCallback,
  ) {
    const ending = this.#getEnding();
    if (!ending) {
      return;
    }

    const autoPointer = this.getPointer();

    if (!this.#inputTracker.isComposing()) {
      removeIncompleteCallback(autoPointer - 1);
    }

    insertPhraseCallback(autoPointer, ending);
    this.reset();
    setNextCursorCallback(autoPointer, ending);
  }

  #getEnding() {
    return (
      this.#getEndingWithWord() ??
      this.#getEndingWithLastChar() ??
      this.#getEndingWithChar()
    );
  }

  #getEndingWithWord() {
    return this.#endingMap[this.#inputTracker.getWord()];
  }

  #getEndingWithLastChar() {
    return this.#endingMap[this.#inputTracker.getLastChar()];
  }

  #getEndingWithChar() {
    return this.#endingMap[this.#inputTracker.getChar()];
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

    if (!this.canActivate()) {
      this.#cursorBox.empty();
    }
  }

  getPointer() {
    return this.#pointer.get();
  }

  #showCursorBox(pointer) {
    this.#pointer.set(pointer);
    this.#cursorBox.show(this.#getEnding());
  }

  #emptyBuffers() {
    this.#inputTracker.reset();
    this.#pointer.reset();
  }
}
