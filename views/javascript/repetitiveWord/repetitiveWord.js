import { fetchServer } from '../utils/fetchServer.js';
import { RepetitiveWordPopup } from './popup.js';

export class RepetitiveWord {
  #popup;
  #btn;
  #clickedElement;
  #textarea;
  #output;
  #REPEATIVE_BTN_OPTION;
  #APPLY_BTN_OPTION;

  constructor() {
    this.#popup = new RepetitiveWordPopup();
    this.#btn = document.getElementById('repeative-btn');
    this.#textarea = document.getElementById('textarea');
    this.#output = document.getElementById('output');
    this.#REPEATIVE_BTN_OPTION = '반복되는 단어';
    this.#APPLY_BTN_OPTION = '반영하기';

    this.#btn.addEventListener('click', async (event) =>
      this.setRepeativeBtnEvent(event, this.#btn.innerText),
    );
  }

  setRepeativeBtnEvent = async (event, mode) => {
    const text = this.#textarea.value;

    switch (mode) {
      case this.#REPEATIVE_BTN_OPTION:
        if (text.length < 200) {
          this.#popup.denyPopup();
          return;
        }
        this.#popup.showLoading(event, '반복되는 단어를 탐지 중입니다...');
        const words = await this.getRepetitiveWord(text);
        this.#popup.showPopup(words, (words) => {
          this.showWord(words);
        });
        this.#btn.innerText = this.#APPLY_BTN_OPTION;
        break;

      case this.#APPLY_BTN_OPTION:
        this.#textarea.value = this.#output.innerText;
        this.#btn.innerText = this.#REPEATIVE_BTN_OPTION;
    }
  };

  getRepetitiveWord = async (sentence) => {
    const url = 'http://localhost:3000/clova/repeated-word';
    const data = {
      text: sentence,
    };

    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(data),
      'repeated word error',
    );
    return await response.json();
  };

  updateSelectedValue = (event) => {
    const textNode = document.createTextNode(event.value);
    this.#clickedElement.replaceWith(textNode);
  };

  showWord(result) {
    let content = this.#output.innerHTML;

    result.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'g');
      content = content.replace(
        regex,
        `<span class="highlight green">${word}</span>`,
      );
    });
    this.#output.innerHTML = content;

    document.querySelectorAll('.highlight.green').forEach((element) => {
      element.addEventListener('click', async (event) => {
        this.#popup.showLoading(event, '대체어를 불러오는 중입니다...');
        this.#clickedElement = event.target;
        const data = await this.getWords(event);
        this.#popup.showNewWord(data, this.updateSelectedValue);
      });
    });
  }

  getWords = async (event) => {
    const clickedElement = event.target;
    const word = clickedElement.innerText;

    const url = 'http://localhost:3000/clova/partial-modification';
    const body = JSON.stringify({
      input: word,
      command: 'SYNONYM',
      systemMessage: null,
    });

    const response = await fetchServer(
      url,
      'post',
      'json',
      body,
      'partial modification error',
    );
    return await response.json();
  };
}
