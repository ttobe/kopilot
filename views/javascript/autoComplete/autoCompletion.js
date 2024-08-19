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
    this.#pointer.set(pointer);
    this.#cursorBox.show(this.#getEnding());
  }

  deactivate() {
    this.#cursorBox.empty();
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

    const pointer = this.#computePointer(ending);

    if (!this.#inputTracker.isComposing()) {
      this.emptyPhoneme();
      removeIncompleteCallback(pointer);
    }

    this.#executeCallbacks(
      pointer,
      ending,
      insertPhraseCallback,
      setNextCursorCallback,
    );
    this.reset();
  }

  #executeCallbacks(pointer, ending, ...callbacks) {
    callbacks.forEach((callback) => callback(pointer, ending));
  }

  #getEnding() {
    return (
      this.#getEndingWithWord() ??
      this.#getEndingWithLastCharacter() ??
      this.#getEndingWithWordAndPhoneme() ??
      this.#getEndingWithPhoneme()
    );
  }

  #getEndingWithWord() {
    return this.#endingMap[this.#inputTracker.getWord()];
  }

  #getEndingWithLastCharacter() {
    return this.#endingMap[this.#inputTracker.getLastCharacter()];
  }

  #getEndingWithWordAndPhoneme() {
    return this.#endingMap[
      `${this.#inputTracker.getWord()}${this.#inputTracker.getPhoneme()}`
    ];
  }

  #getEndingWithPhoneme() {
    return this.#endingMap[this.#inputTracker.getPhoneme()];
  }

  #computePointer(ending) {
    return (
      this.#pointer.get() -
      !this.#inputTracker.isComposing() +
      this.#hasComposingCharacter(ending)
    );
  }

  #hasComposingCharacter(ending) {
    return ending === this.#getEndingWithWordAndPhoneme();
  }

  setEndingType(selected) {
    this.#endingMap =
      selected === 'formal'
        ? formalEndingMap
        : selected === 'polite'
          ? politeEndingMap
          : plainEndingMap;
  }

  hasPhoneme() {
    return this.#inputTracker.hasPhoneme();
  }

  emptyPhoneme() {
    this.#inputTracker.emptyPhoneme();
  }

  updatePhoneme(phoneme) {
    this.#inputTracker.updatePhoneme(phoneme);
  }

  backspacePhoneme() {
    this.#inputTracker.backspacePhoneme();
  }

  updateWord() {
    this.#inputTracker.updateWord();
  }

  backspaceWord() {
    this.#inputTracker.backspaceWord();

    if (!this.canActivate()) {
      this.#cursorBox.empty();
    }
  }

  #emptyBuffers() {
    this.#inputTracker.reset();
    this.#pointer.reset();
  }
}
