import { DIRECT_COMMAND_GUIDE } from '../constants/editorBoxPrompt.js';
import { DomManager } from '../utils/domManager.js';
import { fetchServer } from '../utils/fetchServer.js';
import { AlertPopup } from './alertPopup.js';
import { BaseComponent } from './baseComponent.js';
import { BaseInput } from './baseInput.js';
import { RadioBtnGroup } from './radioBtnGroup.js';
import { Spinner } from './spinner.js';

const DIRECT_COMMAND = 'DIRECT_COMMAND';
const SYNONYM = 'SYNONYM';
const SPACE = '&nbsp;';
const ERROR_REGEX = /{"error"\s*:\s*"([^"]*)"[^{}]*}/;

export class EditorBox extends BaseComponent {
  #inputBox;
  #radioBtnGroup;
  #spinner;

  #aiBtn;
  #applyBtn;
  #cancelBtn;

  #alertPopup;

  #input;
  #command;
  #position;

  #decoder = new TextDecoder();

  constructor(applyCallback) {
    super(document.getElementById('editor-box'));

    this.#inputBox = new BaseInput(this.holder.querySelector('textarea'));
    this.#spinner = new Spinner(this.holder.querySelector('.spinner-wrap'));
    this.#radioBtnGroup = new RadioBtnGroup(
      this.holder.querySelector('.radio-btn-group'),
    );
    this.#alertPopup = new AlertPopup(
      this.holder.parentElement.querySelector('.popup.alert'),
    );

    this.#init(applyCallback);
  }

  show(text, command, length, position, stream, label) {
    this.hide();

    if (!this.#isValidInput(text, command, length)) {
      this.#alertPopup.pop(
        `
        "<span class='em'>${label}</span>"은(는)${SPACE}
        <span class='em'>${length}자 이상</span>${SPACE}작성해주세요!`,
      );
      return;
    }

    this.#reset();
    this.#input = text;
    this.#command = command;
    this.#position = position;

    const h4 = this.holder.querySelector('h4');
    h4.innerHTML = this.#makeTitle(label);

    if (this.#command === DIRECT_COMMAND) {
      this.#showDirectCommandView();
      return;
    }

    this.#request(stream);
    super.show();
  }

  #isValidInput(text, command, length) {
    return text.length >= length || command === DIRECT_COMMAND;
  }

  #showDirectCommandView() {
    this.#showGuide();
    super.show();

    DomManager.showElement(this.#aiBtn);
    DomManager.overrideClickEvent(this.#aiBtn, () => {
      this.#inputBox.hide();
      this.#request(true);
    });
  }

  async #request(stream) {
    this.#spinner.show();
    DomManager.hideElement(this.#aiBtn);

    const url = this.#makeUrl(stream);
    const body = JSON.stringify({
      input: this.#input,
      command: this.#command,
      systemMessage: this.#inputBox.getValue() ?? null,
    });

    const response = await fetchServer(
      url,
      'post',
      'json',
      body,
      'partial modification error',
    );

    this.#inputBox.initializeValue();

    if (stream) {
      this.#handleStream(response.body.getReader());
    } else {
      const { result } = await response.json();
      this.#handleApi(result);
    }
  }

  #handleApi(result) {
    this.#spinner.hide();
    if (result.length === 0) {
      this.#alertPopup.pop('유의어가 발견되지 않았습니다.');
      this.hide();
      return;
    }
    this.#radioBtnGroup.addButtons(result, 'synonym');
    this.#radioBtnGroup.show();

    DomManager.showElement(this.#applyBtn);
  }

  #handleStream(reader) {
    this.#inputBox.disable();

    let isFirstChunk = false;

    const processStream = async ({ done, value }) => {
      if (done) {
        this.#inputBox.enable();
        DomManager.showElement(this.#applyBtn);
        return;
      }

      const chunk = this.#decoder.decode(value, { stream: true });

      if (!isFirstChunk) {
        this.#spinner.hide();
        isFirstChunk = true;
      }

      if (this.#hasStreamError(chunk)) {
        return;
      }
      await this.#inputBox.typeText(chunk);

      reader.read().then(processStream);
    };

    reader.read().then(processStream);

    this.#inputBox.show();
  }

  #hasStreamError(chunk) {
    const match = chunk.match(ERROR_REGEX);
    if (!match) {
      return false;
    }
    this.#inputBox.enable();
    this.#alertPopup.pop(match[1], -1);
    DomManager.showElement(this.#applyBtn);
    return true;
  }

  #makeUrl(stream) {
    const url = `${window.kopilotConfig.API_BASE_URL}/clova/partial-modification`;
    return stream ? `${url}/stream` : url;
  }

  #makeTitle(label) {
    const text = this.#input;
    return `
    "<span class='em'>${text.length < 20 ? text : text.substring(0, 10) + ' ... ' + text.substring(text.length - 6)}</span>"을(를) 
    "<span class='em'>${label}</span>"중이에요!`;
  }

  #makeResult() {
    const originalData = this.#input;
    const newData =
      this.#command === SYNONYM
        ? this.#radioBtnGroup.getSelectedBtn().value
        : this.#inputBox.getValue();

    switch (this.#position) {
      case 'BEFORE':
        return `${newData}\n\n${originalData}`;
      case 'AFTER':
        return `${originalData}\n\n${newData}`;
      default:
        return newData;
    }
  }

  #reset() {
    this.#inputBox.reset();
    this.#radioBtnGroup.hide();
    this.#spinner.hide();

    DomManager.hideElement(this.#applyBtn);
    DomManager.hideElement(this.#aiBtn);
  }

  #showGuide() {
    this.#inputBox.showPlaceholder(DIRECT_COMMAND_GUIDE);
  }

  #init(applyCallback) {
    this.#applyBtn = this.holder.querySelector('.apply-btn');
    this.#applyBtn.addEventListener('click', () => {
      const replaceText = this.#makeResult();
      applyCallback(replaceText);
    });

    this.#aiBtn = this.holder.querySelector('.direct-ai-btn');

    this.#cancelBtn = this.holder.querySelector('.cancel-btn');
    this.#cancelBtn.addEventListener('click', () => this.hide());
  }
}
