class SetHotkeys {
  constructor(hotkeys) {
    this.hotkeys = hotkeys;
    this.buffer = [];
  }

  keyFromKeyboardEvent(event) {
    let key = null;
    if (event.key) key = event.key;
    else {
      const identifier = event.keyIdentifier;
      if (identifier.search(/^U\+/) === -1) key = identifier;
      else
        key = String.fromCharCode(parseInt(identifier.replace(/^U\+/, ''), 16));
    }
    return key.toLowerCase();
  }

  isTyping(active = document.activeElement) {
    return active.tagName == 'TEXTAREA' || active.tagName == 'INPUT';
  }

  isMetaKeys() {
    return (
      this.buffer.includes('control') ||
      this.buffer.includes('alt') ||
      this.buffer.includes('shift')
    );
  }

  start(ignoreTyping = false) {
    window.addEventListener(
      'keydown',
      event => {
        const isTyping = ignoreTyping ? false : this.isTyping();
        const key = this.keyFromKeyboardEvent(event);
        if (!this.buffer.includes(key)) {
          this.buffer.push(key);
          if (this.hotkeys.has(key) && !isTyping && !this.isMetaKeys()) {
            this.hotkeys.get(key)();
          }
        }
      },
      true,
    );

    window.addEventListener(
      'keyup',
      event => {
        const key = this.keyFromKeyboardEvent(event);

        if (this.buffer.includes(key))
          this.buffer = this.buffer.filter(elem => {
            return elem !== key;
          });
      },
      true,
    );

    window.addEventListener('focus', event => {
      this.buffer = [];
    });
  }
}
