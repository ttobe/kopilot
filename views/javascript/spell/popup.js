import { OutputPopup } from '../components/outputPopup.js';
import { spellCheck } from './spellCheck.js';

const diffTitle = `교정된 결과가 맞는지 확인해주세요.<br>직접 수정할 수 있어요!`;
const sameTitle = `교정된 결과가 없는 입력입니다.<br>직접 수정해주세요!`;

export function showSuggestion(event, element, idx) {
  event.stopPropagation(); // 이벤트 전파 막기
  if (element.innerText === element.getAttribute('data-suggestions')) {
    showPopup(sameTitle, element, idx);
  } else {
    showPopup(diffTitle, element, idx);
  }
}

function showPopup(title, element, idx) {
  const outputPopup = new OutputPopup(
    title,
    `
      <div class="suggestion-edit-container">
        <div class="suggestion-edit-instructions">${element.innerText}</div>
        <input type="text" id="suggestion-edit" class="suggestion-edit" value="${element.getAttribute('data-suggestions')}">
      </div>
    `,
    () => {
      const editedSuggestion = document.getElementById('suggestion-edit').value;
      element.outerHTML = editedSuggestion;
      const output = document.getElementById('output');
      const textarea = document.getElementById('textarea');
      textarea.value = output.innerText;
      spellCheck.removeErrorByIndex(idx);
      outputPopup.hide();
    },
  );

  outputPopup.show();
}
