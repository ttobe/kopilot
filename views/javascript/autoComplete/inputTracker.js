export class InputTracker {
  #char = '';
  #word = '';

  getChar() {
    return this.#char;
  }

  hasChar() {
    return this.#char;
  }

  emptyChar() {
    this.#char = '';
  }

  updateChar(char) {
    this.#char = char;
  }

  backspaceChar() {
    this.#char = this.#char.slice(0, -1);
  }

  getWord() {
    return this.#word;
  }

  emptyWord() {
    this.#word = '';
  }

  updateWord(char) {
    this.#word += char;
    this.emptyChar();
  }

  getLastChar() {
    return this.#word.slice(-1) || null;
  }

  backspaceWord() {
    this.#word = this.#word.slice(0, -1);
  }

  reset() {
    this.#char = '';
    this.#word = '';
  }

  isComposing() {
    return this.getChar() !== '' && this.getWord() === '';
    // return this.#char !== '';
  }
}
