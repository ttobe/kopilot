import { fetchServer } from '../utils/fetchServer.js';
import { RepetitiveWordPopup } from './popup.js';

export class RepetitiveWord {
  #popup;
  #btn;
  #clickedElement;
  #textarea;
  #output;
  #REPETITIVE_BTN_OPTION = '반복되는 단어';
  #APPLY_BTN_OPTION = '반영하기';
  #mode;

  constructor() {
    this.#popup = new RepetitiveWordPopup();
    this.#btn = document.getElementById('repetitive-btn');
    this.#textarea = document.getElementById('textarea');
    this.#output = document.getElementById('output');

    this.#btn.addEventListener('click', () => {
      this.#mode = this.#btn.innerText;
      this.setRepetitiveBtnEvent(this.mode);
    });
  }

  setRepetitiveBtnEvent = async () => {
    const text = this.#textarea.value;

    switch (this.#mode) {
      case this.#REPETITIVE_BTN_OPTION:
        if (text.length < 200) {
          this.#popup.denyPopup();
          return;
        }

        this.#btn.innerText = '로딩 중...';
        this.#btn.disable = true;
        const words = await this.getRepetitiveWord(text);

        await this.showWord(words);

        this.changeMode(this.#APPLY_BTN_OPTION);
        break;

      case this.#APPLY_BTN_OPTION:
        this.#textarea.value = this.#output.innerText;
        this.changeMode(this.#REPETITIVE_BTN_OPTION);
    }
  };

  getRepetitiveWord = async (sentence) => {
    const url = `${window.kopilotConfig.API_BASE_URL}/clova/repetitive-word`;
    const data = {
      text: sentence,
    };

    const response = await fetchServer(
      url,
      'post',
      'json',
      JSON.stringify(data),
      'repetitive word error',
    );
    return await response.json();
  };

  updateSelectedValue = (event) => {
    const text = document.createElement('span');
    text.classList.add('green-text');
    text.textContent = event.value;

    this.#clickedElement.replaceWith(text);
  };

  showWord = async (result) => {
    let content = this.#output.innerHTML;

    for (const data of result) {
      const alternative = await this.getWords(data);
      const result = alternative.result;

      if (result.length > 0) {
        localStorage.setItem(data, JSON.stringify(result));

        const cleanedData = data.replace(/[\(\)\[\]\{\}]/g, '');
        const regex = new RegExp(`(${cleanedData})`, 'g');
        content = content.replace(
          regex,
          `<span class="highlight green">${cleanedData}</span>`,
        );
      }
    }

    this.#output.innerHTML = content;

    this.#output.querySelectorAll('.highlight.green').forEach((element) => {
      element.addEventListener('click', (event) => {
        this.#clickedElement = event.target;
        const data = localStorage.getItem(event.target.innerText);
        this.#popup.showNewWord(JSON.parse(data), this.updateSelectedValue);
      });
    });
  };

  getWords = async (word) => {
    const url = `${window.kopilotConfig.API_BASE_URL}/clova/partial-modification`;
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

  changeToRepetitiveMode = () => {
    if (this.#mode === this.#APPLY_BTN_OPTION) {
      this.changeMode(this.#REPETITIVE_BTN_OPTION);
    }
  };

  changeMode = (mode) => {
    this.#btn.innerText = mode;
    this.#mode = mode;
  };
}
