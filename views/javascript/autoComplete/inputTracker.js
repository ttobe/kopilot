export class InputTracker {
  #phoneme = '';
  #word = '';

  getPhoneme() {
    return this.#phoneme;
  }

  hasPhoneme() {
    return this.#phoneme;
  }

  emptyPhoneme() {
    this.#phoneme = '';
  }

  updatePhoneme(phoneme) {
    this.#phoneme = phoneme;
  }

  backspacePhoneme() {
    this.#phoneme = this.#phoneme.slice(0, -1);
  }

  getLastCharacter() {
    return this.#word.slice(-1) || null;
  }

  getWord() {
    return this.#word;
  }

  updateWord() {
    this.#word += this.#phoneme;
  }

  backspaceWord() {
    this.#word = this.#word.slice(0, -1);
  }

  reset() {
    this.#phoneme = '';
    this.#word = '';
  }

  isCharacterComposing() {
    return this.getPhoneme() && !this.getWord();
  }

  isWordComposing() {
    return this.getWord() && this.getPhoneme() !== this.getLastCharacter();
  }

  isComposing() {
    return this.isCharacterComposing() || this.isWordComposing();
  }
}
