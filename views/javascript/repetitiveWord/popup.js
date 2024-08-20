import { OutputPopup } from '../components/outputPopup.js';
import { RadioBtnGroup } from '../components/radioBtnGroup.js';
import { SPINNER } from '../constants/spinner.js';

export class RepetitiveWordPopup {
  #popup;
  #radioBtn;

  constructor() {
    this.#popup = new OutputPopup();
    this.#radioBtn = new RadioBtnGroup(
      this.#popup.holder.querySelector('.radio-btn-group'),
    );
  }

  showLoading(event, text) {
    event.stopPropagation(); // 이벤트 전파 막기

    this.#popup.set(text, SPINNER, null);
    this.hideRadioBtn();
    this.#popup.show();
  }

  denyPopup() {
    this.#popup.set(
      '글이 너무 짧습니다.',
      '글을 200자 이상 입력해주세요.',
      null,
    );
    this.#popup.show();
    this.#popup.hideApplyButton();
  }

  getSelectedWord() {
    return this.#radioBtn.getSelectedBtn();
  }

  showNewWord(data, func) {
    this.#radioBtn.addButtons(data, 'repetitive');

    this.#popup.set('다음 단어로 바꿔보세요.', null, () => {
      func(this.#radioBtn.getSelectedBtn());
      this.#popup.hide();
    });
    this.#popup.show();
    this.showRadioBtn();
  }

  hideRadioBtn() {
    this.#popup.hideButton();
    this.#radioBtn.hide();
  }

  showRadioBtn() {
    this.#popup.showButton();
    this.#radioBtn.show();
  }
}
