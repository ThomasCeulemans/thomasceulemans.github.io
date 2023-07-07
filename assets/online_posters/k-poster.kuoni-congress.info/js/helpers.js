/**
 * Returns the max int key of a given object
 * @returns {number}
 */
function maxKey(obj) {
    obj = obj || {};
    return Object.keys(obj).reduce((max, key) => {
        if (typeof key !== 'number') {
            key = parseInt(key, 10);
            key = isNaN(key) ? 0 : key;
        }
        return Math.max(max, key);
    }, 0);
}

/**
 * flat a given object
 * IN = {a: 'cedric',b: {c: 'eliane',d: {e: 'marius'}}};
 * OUT = {a: 'cedric', c: 'eliane', e: 'marius'};
 *
 * @param obj
 * @param fnc function applied to each object param
 */
function flatObject(obj, fnc = x => x) {
    let flat = {};
    Object.keys(obj).forEach(prop => {
        if(obj[prop] !== null){
            if (typeof obj[prop] === 'object') {
                flat = {...flat, ...flatObject(obj[prop], fnc)};
            } else {
                flat[fnc(prop)] = obj[prop];
            }
        }
    });
    return flat;
}

/**
 * for a given grid return the width of a single column and the height of a single row
 * @param domRect {width, height}
 * @param colNb
 * @param rowNb
 * @param colGap
 * @param rowGap
 * @returns {{col: number, row: number}}
 */
function gridSize({width, height}, colNb, rowNb, colGap, rowGap = colGap) {
    return {
        col: (width - colGap * (colNb - 1)) / colNb,
        row: (height - rowGap * (rowNb - 1)) / rowNb
    };
}

/**
 * Return the overlapping surface [px2] between 2 given elements
 * @param elm1
 * @param elm2
 * @returns {number}
 */
function overlap(elm1, elm2) {

    const {
        top: t1,
        bottom: b1,
        left: l1,
        right: r1
    } = elm1.getBoundingClientRect();

    const {
        top: t2,
        bottom: b2,
        left: l2,
        right: r2
    } = elm2.getBoundingClientRect();

    const width = Math.max(0, Math.min(r1, r2) - Math.max(l1, l2));
    const height = Math.max(0, Math.min(b1, b2) - Math.max(t1, t2));

    return width * height;
}

/**
 * shorthand for fetch
 * @param state
 * @param action
 * @param method
 * @param inputs
 * @returns {Promise<any>}
 */
function queryDB(action, method = 'GET', inputs = {}) {

    store.state.loading = true;

    const body = JSON.stringify({
        ...inputs,
        eventCode,
        '_token': document.getElementById('csrf-token').content
    });

    const headers = new Headers({
        'Content-Type': 'application/json'
    });

    return fetch(action, {method, body, headers})
        .then(response => {
            store.state.loading = false;
            if (response.status < 500) {
                return response;
            } else {
                message(`<b>Oops!</b><br>Something when wrong, please try again later.`, 'error');
            }
        });
}

/**
 * Is called when MathJax is ready
 */
function pageReady(){
    if(window.mathJaxTypesetStack) {
        window.mathJaxTypesetStack.forEach(({rawLaTex, component}) => component.typeset(rawLaTex));
        delete window.mathJaxTypesetStack;
    }
    MathJax.typeset();
}
