import { KEY } from '../constants/eventKey.js';
import { LongSentence } from '../longSentence/longSentence.js';
import { spellCheck } from '../spell/spellCheck.js';
import { versionStorage } from '../storage/versionStorage.js';
import { ScrollTracker } from '../utils/ScrollTracker.js';
import { CharChecker } from '../utils/charChecker.js';
import { CharCounter } from '../utils/charCounter.js';
import { KeyChecker } from '../utils/keyChecker.js';
import { AlertPopup } from './alertPopup.js';
import { BaseComponent } from './baseComponent.js';

export class Textarea extends BaseComponent {
  #output;
  #writingTool;
  #alertPopup;

  #charCount;
  #byteCount;

  #autoCompletion;

  #nextCursorPointer;
  #scrollTracker;

  #longSentence;

  constructor(holder, autoCompletion, writingTool) {
    super(holder);

    this.#output = document.getElementById('output');
    this.#writingTool = writingTool;
    this.#alertPopup = new AlertPopup(
      document.getElementById('main-alert-popup'),
    );

    this.#charCount = document.getElementById('char-count-value');
    this.#byteCount = document.getElementById('byte-count-value');

    this.#autoCompletion = autoCompletion;
    this.#scrollTracker = new ScrollTracker(holder);

    this.#longSentence = LongSentence.getInstance();
    this.#init();
  }

  changeEndingType(key) {
    this.#autoCompletion.setEndingType(key);
  }

  static isSaveInput(ctrlKey, key) {
    return ctrlKey && key === 's';
  }

  static isCursorMoved(code, key) {
    return (
      (code === KEY.SPACE && key !== 'Process') ||
      code === KEY.ENTER ||
      KeyChecker.isArrowKeyEvent(code)
    );
  }

  static isAutoCompletePosition(currPointer, autoPointer) {
    return currPointer === autoPointer || currPointer === autoPointer + 1;
  }

  handleInputEvent(event) {
    spellCheck.spellCheckOnContinuousInput();
    this.#output.innerHTML = this.holder.value;

    if (!event.isComposing && CharChecker.isIMECharacter(event.data)) {
      this.#removeLastCharacter();
      this.#restoreNextCursorPointer();
      event.preventDefault();
    }

    this.#update();

    // FIXME
    /**
     * 1. 개발자 도구를 열거나 반응형으로 떨어졌을 때
     * 2. 스크롤이 될 정도로 긴 글의 마지막 줄에서 스크롤이 살짝 안 맞음
     * */
    const scrollTop = this.#scrollTracker.getScrollTop();
    if (scrollTop !== null) {
      this.holder.scrollTop = scrollTop;
    }
  }

  async handleKeydownEvent(event) {
    if (this.#writingTool.isOn()) {
      this.#writingTool.hide();
      return;
    }

    const code = event.code;
    const key = event.key;

    if (Textarea.isSaveInput(event.ctrlKey, event.key)) {
      event.preventDefault();
      await versionStorage.saveAndPopup();
      return;
    }

    const cursorPointer = this.#getCursorPointer();
    const autoPointer = this.#autoCompletion.getPointer();

    if (KeyChecker.isSentenceTerminated(key)) {
      spellCheck.spellCheckOnPunctuation();
    }

    if (!Textarea.isAutoCompletePosition(cursorPointer, autoPointer)) {
      this.#autoCompletion.emptyCursorBox();
    }

    if (code === KEY.BACKSPACE) {
      this.#handleBackspace();
      return;
    }

    if (Textarea.isCursorMoved(code, key)) {
      this.#autoCompletion.emptyAll();
      return;
    }

    if (code === KEY.TAB) {
      event.preventDefault();
      this.#handleAutoComplete(cursorPointer, autoPointer);
      return;
    }
  }

  handleSelectionChangeEvent() {
    const start = this.holder.selectionStart;
    const end = this.holder.selectionEnd;
    if (start === end) {
      this.#writingTool.hide();
      return;
    }
    const selectedText = this.holder.value.substring(start, end);

    this.#writingTool.show(selectedText, start, end);
  }

  #handleBackspace() {
    if (this.#autoCompletion.hasChar()) {
      this.#autoCompletion.backspaceChar();
      return;
    }
    this.#autoCompletion.backspaceWord();
  }

  #handleAutoComplete(cursorPointer, autoPointer) {
    const ending = this.#autoCompletion.getEnding();
    if (!ending) {
      return;
    }

    this.#scrollTracker.keepPrevScrollHeight();

    if (cursorPointer === autoPointer + 1) {
      this.#removeIncompleteCharacter(autoPointer);
    }
    this.#insertPhrase(autoPointer, ending);
    this.#autoCompletion.emptyAll();
    this.#setNextCursorPointer(autoPointer, ending);

    this.#scrollTracker.setScrollTop();
    return;
  }

  #update() {
    this.#updateTextareaCounter();
    this.#longSentence.checkLength();
    spellCheck.setSpellHighlight();
    this.#longSentence.setLongSentenceEvent();
  }

  #init() {
    this.#bindEvent();
    this.#addEventListener();
    this.#observeValueChange();
  }

  #getCursorPointer() {
    return this.holder.selectionStart;
  }

  #insertPhrase(pointer, phrase) {
    const before = this.holder.value.substring(0, pointer);
    const after = this.holder.value.substring(pointer);

    this.holder.value = before + phrase + after;
  }

  #removeIncompleteCharacter(autoPointer) {
    const before = this.holder.value.substring(0, autoPointer);
    const after = this.holder.value.substring(autoPointer + 1);

    this.holder.value = before + after;
  }

  #removeLastCharacter() {
    const currLength = this.holder.value.length;
    this.holder.value = this.holder.value.substring(0, currLength - 1);
  }

  #setNextCursorPointer(currPointer, phrase) {
    this.#nextCursorPointer = currPointer + phrase.length;
  }

  #restoreNextCursorPointer() {
    this.holder.selectionStart = this.#nextCursorPointer;
    this.holder.selectionEnd = this.#nextCursorPointer;
  }

  #updateTextareaCounter() {
    const { char, byte } = CharCounter.countChar(this.holder.value);
    this.#charCount.innerText = char + ' 자';
    this.#byteCount.innerText = byte + ' 바이트';
  }

  #bindEvent() {
    this.handleKeydownEvent = this.handleKeydownEvent.bind(this);
    this.handleInputEvent = this.handleInputEvent.bind(this);
    this.handleSelectionChangeEvent =
      this.handleSelectionChangeEvent.bind(this);
  }

  #addEventListener() {
    this.holder.addEventListener('compositionstart', () =>
      this.#autoCompletion.emptyChar(),
    );
    this.holder.addEventListener('compositionupdate', (event) =>
      this.#autoCompletion.updateChar(event.data),
    );
    this.holder.addEventListener('compositionend', (event) => {
      this.#autoCompletion.updateWord(event.data);

      if (this.#autoCompletion.hasEnding()) {
        this.#autoCompletion.showCursorBox(this.#getCursorPointer());
      }
    });

    this.holder.addEventListener('keydown', this.handleKeydownEvent);
    this.holder.addEventListener('input', this.handleInputEvent);
    this.holder.addEventListener(
      'selectionchange',
      this.handleSelectionChangeEvent,
    );
  }

  #observeValueChange() {
    const holder = this.holder;
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    );

    Object.defineProperty(holder, 'value', {
      get() {
        return descriptor.get.call(holder);
      },
      set(value) {
        descriptor.set.call(holder, value);
        holder.dispatchEvent(new Event('input', { bubbles: false }));
      },
    });
  }
}
