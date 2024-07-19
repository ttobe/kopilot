import { AutoCompleteSettings } from './autoComplete/autoCompleteSettings.js';
import { CursorBox } from './components/cursorBox.js';
import { FeedbackPopup } from './components/feedbackPopup.js';
import { Textarea } from './components/textarea.js';

const textareaHolder = document.getElementById('textarea');

const cursorBox = new CursorBox(
  document.getElementById('cursor-box'),
  textareaHolder,
);

const autoCompleteSettings = new AutoCompleteSettings(cursorBox);

const textarea = new Textarea(textareaHolder, autoCompleteSettings);

const endingChoice = document.getElementById('ending-choice');
endingChoice.addEventListener('change', (event) =>
  textarea.changeEndingType(event.target.value),
);

const feedbackBtn = document.getElementById('feedback-btn');

const feedbackPopup = new FeedbackPopup(
  document.getElementById('feedback-popup'),
  document.getElementById('overlay'),
);

feedbackBtn.addEventListener('click', () => {
  feedbackPopup.show();
});