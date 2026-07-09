const sumElement = document.getElementById('sum');

function updateTotal(delta) {
    sumElement.textContent = parseInt(sumElement.textContent) + delta;
}

class ModifierItem extends HTMLElement {
    points = 0;

    constructor() {
        super();
        this.addEventListener('click', () => {
            this.checked = !this.checked;
        });
        if (this.children.length > 0) {
            const pointsElement = this.getElementsByTagName('modifier-points')[0];
            if (pointsElement) {
                this.points = parseInt(pointsElement.textContent);
                this.setAttribute('points', this.points);
            }
        }
    }


    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '');
        }
        else {
            this.removeAttribute('checked');
        }

        if (this.hasAttribute('points')) {
            updateTotal(this.checked ? this.points : -this.points);
        }
    }
}

customElements.define('modifier-item', ModifierItem);