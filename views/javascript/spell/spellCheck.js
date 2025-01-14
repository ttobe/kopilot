﻿import { LongSentence } from '../longSentence/longSentence.js';
import { fetchServer } from '../utils/fetchServer.js';
import { showSuggestion } from './popup.js';

class SpellCheck {
  #spellErrors = [];
  #output = document.getElementById('output');
  #textarea = document.getElementById('textarea');
  #errorCount = document.getElementById('error-count');
  #tokenReg = /[a-zA-Z가-힣0-9]/;

  setSpellHighlight() {
    let index = 0;
    let content = this.#output.innerHTML;
    if (content.includes('highlight red')) {
      return;
    }

    this.#spellErrors.forEach((spellError) => {
      const token = spellError.token;
      const suggestions = spellError.suggestions.join(', ');

      const span = `<span class="highlight red" data-suggestions="${suggestions}">${token}</span>`;

      let tokenIndex = content.indexOf(token, index);

      while (tokenIndex !== -1) {
        if (this.#isToken(content, tokenIndex, token)) {
          content =
            content.substring(0, tokenIndex) +
            span +
            content.substring(tokenIndex + token.length);
          index = tokenIndex + span.length + 1;
          break;
        }

        tokenIndex = content.indexOf(token, tokenIndex + 1);
      }
    });

    // 줄바꿈 유지하여 결과를 div에 추가
    this.#output.innerHTML = content.replace(/\n/g, '<br>');
    this.#setSpellEvent();
    this.#updateErrorCount();
  }

  #isToken(content, tokenIndex, token) {
    const nextChar = this.#getNextChar(content, tokenIndex, token);
    return !nextChar || !this.#tokenReg.test(nextChar);
  }

  #getNextChar(content, tokenIndex, token) {
    const nextCharIndex = tokenIndex + token.length;
    return nextCharIndex < content.length ? content[nextCharIndex] : null;
  }

  #setSpellEvent() {
    document.querySelectorAll('.highlight.red').forEach((element, idx) => {
      element.addEventListener('click', (event) => {
        showSuggestion(event, element, idx);
      });
    });
  }

  #debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  #throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  async #updateSpellErrors() {
    const inputText = this.#output.innerHTML;

    const sentence = inputText.replace(/<\/?span[^>]*>/gi, '');

    const url = `${window.kopilotConfig.API_BASE_URL}/spell`;
    const response = await fetchServer(
      url,
      'post',
      'x-www-form-urlencoded',
      new URLSearchParams({ sentence }),
      'spell error',
    );
    this.#spellErrors = await response.json();
    // 삭제하기 위해 index 추가
    this.#spellErrors = this.#spellErrors.map((error, idx) => {
      return { ...error, idx };
    });
  }

  async performSpellCheck() {
    this.#output.innerHTML = this.#textarea.value;
    const longSentence = LongSentence.getInstance();
    longSentence.checkLength();
    await this.#updateSpellErrors();
    this.setSpellHighlight();
    longSentence.setLongSentenceEvent();
  }

  spellCheckOnPunctuation = this.#debounce(() => this.performSpellCheck(), 100);
  spellCheckOnContinuousInput = this.#throttle(
    () => this.performSpellCheck(),
    1000,
  );

  #updateErrorCount() {
    this.#errorCount.innerText = this.#getErrorCount();
  }

  #getErrorCount() {
    return this.#spellErrors.length;
  }

  removeErrorByIndex(idx) {
    this.#spellErrors = this.#spellErrors.filter((error) => error.idx !== idx);
    this.#updateErrorCount();
  }
}

export const spellCheck = new SpellCheck();
