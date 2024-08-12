const INITIAL_POINTER = 0;

export class Pointer {
  #pointer = INITIAL_POINTER;

  get() {
    return this.#pointer;
  }

  set(pointer) {
    this.#pointer = pointer;
  }

  empty() {
    this.#pointer = INITIAL_POINTER;
  }
}
