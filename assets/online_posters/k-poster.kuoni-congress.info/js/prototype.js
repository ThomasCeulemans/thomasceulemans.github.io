/**
 * Returns a given string with the first letter capitalized and the rest in lower case
 * @returns {string}
 */
String.prototype.toProperCase = function() {
    return this[0].toUpperCase() + this.substring(1).toLowerCase();
};

/**
 * convert a given kebab case string to camel case
 * @returns {string}
 */
String.prototype.toCamelCase = function() {
    return this.replace(/-([a-z])/g, c =>  c[1].toUpperCase());
};

/**
 * convert a given camel case string to Kebab case
 * @returns {string}
 */
String.prototype.toKebablCase = function() {
    return this.replace(/([A-Z])/g, c =>  `-${c.toLowerCase()}`);
};

/**
 * remove all class 'className' than add to the elm so this class is unique
 */
DOMTokenList.prototype.unique = function(className){
    [...document.getElementsByClassName(className)].forEach(elm => {
        elm.classList.remove(className);
    });
    this.add(className);
};

/**
 * for a given array of numbers returns the number of consecutive first zero
 * example: [0, 0, 1, 0].firstZero() returns 2
 * @returns {number}
 */
Array.prototype.firstZero = function(){
    for(let i = 0, c = this.length; i < c; i++){
        if(this[i]){return i}
    }
    return this.length;
};

/**
 * for a given array of numbers returns the number of consecutive last zero
 * example: [0, 0, 1, 0, 0, 0].lastZero() returns 3
 * @returns {number}
 */
Array.prototype.lastZero = function(){
    return this.reverse().firstZero();
};

/**
 * convert a Number to [hh:]mm:ss
 */
Number.prototype.toTime = function() {
    let h = Math.floor(this / 3600 );
    let m = Math.floor(this / 60 - h * 60);
    let s = Math.floor( this - 3600 * h - 60 * m);
    h = h ? (h < 10 ? `0${h}:` : `${h}:`) : '';
    m = m < 10 ? `0${m}` : `${m}`;
    s = s < 10 ? `0${s}` : `${s}`;

    return `${h}${m}:${s}`;
};

/**
 * Convert String `hh:mm:ss` to a Number (of seconds)
 */
String.prototype.toSec = function() {
    let [h, m, s] = this.split(':');
    return 60 * 60 * parseInt(h) + 60 * parseInt(m) + parseInt(s);
}

/**
 * set attribute disabled to a collection of elements (NodeList)
 * @param val {boolean}
 */
NodeList.prototype.disabled = function(val) {
    this.forEach(node => node.disabled = val);
}

HTMLElement.prototype.isVisibleIn = function(elmt) {
    const {
        top: t1,
        bottom: b1,
        left: l1,
        right: r1,
        width: w,
        height: h
    } = this.getBoundingClientRect();
    const {
        top: t2,
        bottom: b2,
        left: l2,
        right: r2,
    } = elmt.getBoundingClientRect();
    const s = w * h;
    const width = Math.max(0, Math.min(r1, r2) - Math.max(l1, l2));
    const height = Math.max(0, Math.min(b1, b2) - Math.max(t1, t2));

    return width * height === s;
}
