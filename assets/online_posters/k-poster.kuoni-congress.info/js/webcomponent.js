customElements.define('custom-snippet', class extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'closed'});

        this.styleInit = document.createElement('style');
        this.styleInit.textContent = 'body{all:initial}';
        shadowRoot.append(this.styleInit);

        this.styleElement = document.createElement('style');
        shadowRoot.append(this.styleElement);

        this.bodyElement = document.createElement('body');
        shadowRoot.append(this.bodyElement);

    }

    static get observedAttributes() {
        return ['html', 'css'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {

        switch(attrName){
            case 'html':
                this.bodyElement.innerHTML = newValue;
                break;

            case 'css':
                this.styleElement.textContent = newValue;
                break;
        }
    }
});

/**
 * This component allow to `scope` the style associated to LaTex
 * If MathJax is loaded and ready, typeset method render LaTex, if not the call is stacked
 * and render when MathJax is ready.
 */
customElements.define('vue-mathjax-latex', class extends HTMLElement {
    static get observedAttributes() {
        return ['raw-latex'];
    }

    constructor() {
        super();
        this.typeset = rawLaTex => {
            /* first check if MathJax has been initialized … */
            if(MathJax.startup.output && MathJax.tex2chtml) {
                MathJax.startup.output.clearCache();
                this.innerHTML = MathJax.tex2chtml(rawLaTex).innerHTML;
                this.prepend(MathJax.chtmlStylesheet());
            }

            /* … if this is not the case the update requests are stacked */
            else {
                if(!window.mathJaxTypesetStack) {
                    window.mathJaxTypesetStack = [];
                }
                mathJaxTypesetStack.push({rawLaTex, component: this});
                this.innerHTML = 'Rendering LaTex …';
            }
        }
    }

    attributeChangedCallback(attName, old, rawLaTex) {
        if(attName === 'raw-latex') {
            rawLaTex && this.typeset(rawLaTex);
        }
    }
});

customElements.define('show-more', class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', evt => {
            const body = this.closest('body');
            if(!body.classList.contains('article-expanded')) {
                const popup = this.closest('.popup');
                popup.classList.add('popup-fixed');
                setTimeout(() => {
                    body.classList.add('article-expanded');
                    popup.classList.add('show');
                });
            } else {
                closeArticle(evt);
            }
        });
    }
});

customElements.define('overlay-articles', class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', closeArticle);
    }
});

function closeArticle(evt){
    const body = evt.target.closest('body');
    if(body.classList.contains('article-expanded')){
        body.classList.remove('article-expanded');
        const popup = body.querySelector('.popup-fixed.show');
        popup.classList.remove('show');
        setTimeout(() => {
            popup.classList.remove('popup-fixed');
        }, 400);
    }
}
