const AATester = class {
  tester = null
  dialog = null
  editor = null
  viewer = null
  checker = null
  cssSettings = null
  constructor() {
    this.tester = document.querySelector('section.aatester');
    if (!this.tester) return;

    this.dialog = document.querySelector('dialog#tester_settings');
    this.editor = this.tester.querySelector('textarea.aaedit');
    this.viewer = this.tester.querySelector('div.aaviewer');
    this.checker = this.dialog.querySelector('input[name=checkspace]');
    if (!this.checker) {
      this.checker = document.createElement('input');
    }

    this.cssSettings = (function() {
      for (const ss of document.styleSheets) {
	if (ss.title=='aatester') {
	  for (const rule of ss.cssRules) {
	    if (rule.selectorText=='section.aatester') {
	      for (const r of rule.cssRules) {
		if (r.selectorText.match('div.aaviewer')) return r;
	      }
	    }
	  }
	}
      }
    })();

    if (this.cssSettings) {
      if (this.dialog) {
	this.dialog.querySelector('#tester_fontsize').value = this.cssSettings.style.fontSize;
	this.dialog.querySelector('#tester_fontfamily').value = this.cssSettings.style.fontFamily;
	this.dialog.querySelector('#tester_lineheight').value = this.cssSettings.style.lineHeight;
	this.dialog.querySelector('#tester_color').value = this.cssSettings.style.color;
	this.dialog.querySelector('#tester_background').value = this.cssSettings.style.background;

	const setStyle = (e) => { if (e.target.closest('[name=close]')) { this.setStyle(); } };
	this.dialog.addEventListener('click',setStyle,false);

	const menu = document.querySelector('nav span[name=openSettings]');
	if (menu) {
	  const openmenu = ()=>{ this.dialog.showModal(); };
	  menu.addEventListener('click',openmenu,false);
	}
      }
    }

    if (this.editor) {
      const updateText = (e) => { this.update(e.target.value); };
      this.editor.addEventListener('input',updateText,false);
      const clearbtn = this.editor.closest('form').querySelector('input[type=reset]');
      if (clearbtn) {
	const eraseText = () => { this.update(''); };
	clearbtn.addEventListener('click',eraseText,false);
      }

      if (this.editor.value != '') this.update(this.editor.value);
    }
  }
  update(value) {
    if (!this.viewer) return;
    this.viewer.innerText = '';
    value.split(/\r*\n/).forEach((v)=>{
      if (this.checker.checked) {
	v = v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	this.viewer.insertAdjacentHTML('beforeend',this.check(v));
      } else {
	this.viewer.append(v);
      }
      this.viewer.append(document.createElement('br'));
    });
    return;
  }
  setStyle() {
    this.cssSettings.style.fontSize = this.dialog.querySelector('#tester_fontsize').value;
    this.cssSettings.style.fontFamily = this.dialog.querySelector('#tester_fontfamily').value;
    this.cssSettings.style.lineHeight = this.dialog.querySelector('#tester_lineheight').value;
    this.cssSettings.style.color = this.dialog.querySelector('#tester_color').value;
    this.cssSettings.style.background = this.dialog.querySelector('#tester_background').value;
    this.dialog.close();
    return;
  }
  check(value) {
    return value.replace(/(^[ ]{1,})/,'<span class="firstspc">$1</span>').replace(/([ ]{2,})/g,'<span class="dblspc">$1</span>');
  }
}

