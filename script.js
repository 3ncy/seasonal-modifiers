const sumElement = document.getElementById('sum');

function updateTotal(delta) {
    const total = parseInt(sumElement.textContent) + delta;
    sumElement.textContent = total;
    if (total < 0) {
        sumElement.setAttribute('bad', '');
    } else {
        sumElement.removeAttribute('bad');
    }
}

class ModifierItem extends HTMLElement {
    points = 0;
    group = undefined;

    constructor() {
        super();

        if (this.children.length > 0) {
            const pointsElement = this.getElementsByTagName('modifier-points')[0];
            if (pointsElement) {
                this.points = parseInt(pointsElement.textContent);
                this.setAttribute('points', this.points);
            }
        }

        if (this.hasAttribute('group')) { this.group = this.getAttribute('group'); }

        this.addEventListener('click', () => this.#click());
    }

    #click() {
        if (this.disabled) return;
        this.checked = !this.checked;
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '');

            if (this.group) {
                const groupItems = document.querySelectorAll(`modifier-item[group="${this.group}"]`);
                for (const item of groupItems) {
                    if (item === this) continue;
                    if (item.checked) { item.#click(); }
                    item.blocked = true;
                }
            }
        }
        else {
            this.removeAttribute('checked');

            if (this.group) {
                const groupItems = document.querySelectorAll(`modifier-item[group="${this.group}"]`);
                for (const item of groupItems) {
                    if (item === this) continue;
                    item.blocked = false;
                }
            }
        }

        if (this.hasAttribute('points')) {
            updateTotal(this.checked ? this.points : -this.points);
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    get blocked() {
        return this.hasAttribute('blocked');
    }

    set blocked(value) {
        if (value) {
            this.setAttribute('blocked', '');
        }
        else {
            this.removeAttribute('blocked');
        }
    }
}

customElements.define('modifier-item', ModifierItem);

function resetSelected() {
    const items = document.querySelectorAll('modifier-item');
    for (const item of items) {
        if (item.checked) { item.checked = false; }
    }
}

// Set correct theme switch icon after it loads
document.querySelector('theme-switch')?.setContent(ThemeSwitch.theme === 'dark');