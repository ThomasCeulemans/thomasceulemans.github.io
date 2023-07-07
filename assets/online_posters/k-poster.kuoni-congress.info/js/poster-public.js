document.body.addEventListener('keydown', key => {
    const body = document.body;
    if(key.code === 'Escape'){
        /** close lightbox */
        if(body.classList.contains('light-box-open')) {
            document.getElementById('light-box').remove();
            body.classList.remove('light-box-open');
        }

        /** close pdf frame */
        else if(body.classList.contains('pdf-frame-open')) {
            document.getElementById('pdf-frame').remove();
            body.classList.remove('pdf-frame-open');
        }

        /** close popup */
        else if(body.classList.contains('popup-open')) {
            closeArticle();
        }
    }
});

/** adjust title font size */
downSize(document.getElementById('poster-header-title'));
function downSize(elmt) {
    elmt.style.opacity = 0;
    let {fontSize} = getComputedStyle(elmt);
    fontSize = parseFloat(fontSize);
    const ref = document.createElement('span');
    ref.innerText = '.';
    elmt.append(ref);
    while(fontSize > 9 && !ref.isVisibleIn(elmt)) {
        fontSize -= .2;
        elmt.style.fontSize = `${fontSize}px`;
    }
    ref.remove();
    elmt.style.opacity = 1;
}

function initArticleSize() {
    document.querySelectorAll('.expandable-article').forEach(article => {
        const {top, width, height, left} = article.getBoundingClientRect();
        article.style.setProperty('--top', top + 'px');
        article.style.setProperty('--width', width + 'px');
        article.style.setProperty('--height', height + 'px');
        article.style.setProperty('--left', left + 'px');
    });
}
initArticleSize();

/* TODO add debounce */
window.addEventListener('resize', initArticleSize);

/** lightbox */
class lightBox extends HTMLElement {
    constructor(src) {
        super();
        this.id = 'light-box';
        this.className = 'overlay overlay-light-box icon-cancel';
        const border = 80; /** this must match CSS border-width (x2) */

        /** lightbox opens only when popup is open */
        const img = new Image();
        img.src = src;
        this.append(img);
        let longer, Longer; /** longer side of the img 'width' or 'height', Longer is the same capitalized */
        img.addEventListener('load', evt => {
            longer = img.width > img.height ? 'width' : 'height';
            Longer = longer.replace(/[w|h]/, c => c.toUpperCase());
            this.original = img[longer];
            longer = Math.min(window[`inner${Longer}`] - border, img[longer]);
            if(longer === 'width') {
                img.style.width = `${longer}px`;
            } else {
                img.style.height = `${longer}px`;
            }
            this.style.display = 'grid';
            document.body.append(this);
            document.body.classList.add('light-box-open');
        });

        img.addEventListener('click', evt => {
            if (!evt.shiftKey) {
                /** zoom IN */
                longer = Math.min(this.original, 1.1 * longer);
            } else {
                /** zoom OUT */
                longer = Math.max(Math.min(this.original, window[`inner${Longer}`] - border), .9 * longer);
            }

            if(longer === 'width') {
                img.style.width = `${longer}px`;
            } else {
                img.style.height = `${longer}px`;
            }
        });

        /** closing lightbox */
        this.addEventListener('click', evt => {
            if(evt.target !== img) {
                this.remove();
            };
        });
    }
};
customElements.define('light-box', lightBox);

[...document.getElementsByClassName('light-box-enable')].forEach(img => {
    img.addEventListener('click', evt => {
        if(document.body.classList.contains('popup-open')) {
            new lightBox(img.src);
        }
    });
});

/**
 * Call the MathJax is ready
 */
function pageReady() {
    customElements.define('mathjax-latex', class extends HTMLElement {
        constructor() {
            super();
            MathJax.startup.output.clearCache();
            this.innerHTML = MathJax.tex2chtml(this.textContent).innerHTML;
            this.prepend(MathJax.chtmlStylesheet());
            this.classList.remove('rendering-latex', 'icon-latex');
        }
    });
}

/**  MathJax */
MathJax = {
    startup: {
        pageReady: () => {
            pageReady();
            MathJax.typeset();
        },
    }
};

/** narration play / pause */
document.querySelectorAll('.article-narration-icon').forEach(icon => {
    const audio = icon.querySelector('audio');
    const id = icon.dataset.id;
    const player = document.getElementById(`player-${id}`);
    const action = document.getElementById(`player-action-${id}`);
    const current = document.getElementById(`player-current-${id}`);
    const duration = document.getElementById(`player-duration-${id}`);
    const progress = document.getElementById(`player-progress-${id}`);

    audio.addEventListener('loadeddata', evt => {
        duration.innerText = audio.duration.toTime();

    });

    audio.addEventListener('timeupdate', evt => {
        const time = audio.currentTime;
        const duration = audio.duration;
        current.innerText = time.toTime();
        player.style.setProperty('--progress', 100 * time / duration);
    });

    audio.addEventListener('ended', evt => {
        icon.classList.remove('play');
        player.classList.remove('play');
        current.innerText = '00:00';
        player.style.setProperty('--progress', 0);
        action.classList.remove('icon-pause');
    });

    icon.addEventListener('click', evt => {
        const play = icon.classList.toggle('play');
        if(play) {
            audio.play();
        } else {
            audio.pause();
        }
        player.classList.toggle('play', play);
        action.classList.toggle('icon-pause', play);
    });

    icon.addEventListener('click', evt => {
        console.log('icon');
        player.style.display = 'block';
    }, {once: true});

    action.addEventListener('click', evt => {
        const play = icon.classList.toggle('play');
        if(play) {
            audio.play();
        } else {
            audio.pause();
        }
        player.classList.toggle('play', play);
        action.classList.toggle('icon-pause', play);
    });

    progress.addEventListener('click', evt => {
        let {width} = getComputedStyle(progress);
        width = parseFloat(width);
        const offset = evt.offsetX;
        audio.currentTime = audio.duration * offset / width;
    });

});

/** PDF */
class pdfFrame extends HTMLElement {
    constructor(src) {
        super();
        this.id = 'pdf-overlay';
        this.className = 'overlay overlay-light-box icon-cancel';
        const iframe = document.createElement('iframe');
        iframe.id = 'pdf-iframe';
        iframe.setAttribute('frameBorder', 0);
        iframe.src = src;
        this.append(iframe);

        this.addEventListener('click', evt => this.remove());

        document.body.classList.add('pdf-frame-open');
        document.body.append(this);
    }
}
customElements.define('pdf-frame', pdfFrame);
customElements.define('pdf-preview', class extends HTMLImageElement {
    constructor() {
        super();
        this.addEventListener('click', evt => {
            // if(document.body.classList.contains('popup-open')) {
            new pdfFrame(evt.target.dataset.pdf);
            // }
        });
    }
}, {extends: 'img'});

/* twitter */
document.getElementById('visitor-action-share-twitter').addEventListener('click', evt => {
    const text = encodeURIComponent('Check out this K-Poster®\n');
    const hashtags = encodeURIComponent(event.twitter_hashtag.slice(1));
    const shareUrl = `https://twitter.com/intent/tweet?url=${location.href}&text=${text}&hashtags=${hashtags}`;
    const winOptions = `resizable,scrollbars,status,height=${350},width=${500},left=${(window.innerWidth - 500) / 2},top=${(window.innerHeight - 350) / 2}`;
    const win = window.open(shareUrl, 'ShareOnTwitter', winOptions);
    win.opener = null;
});

/* share-link */
document.getElementById('visitor-action-share-ink').addEventListener('click', evt => {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(location.href)
            .then(_ =>  {
                message(`K-Poster's URL has been copied in your clipboard`);
            })
            .catch(_ => {
                prompt('Copy the K-Poster® URL above:', location.href);
            });
    } else {
        prompt('Copy the K-Poster® URL above:', location.href);
    }
});

/* contact-author */
const contactAuthorForm = document.getElementById('contact-author-form');

document.getElementById('visitor-action-contact-author').addEventListener('click', evt => {
    contactAuthorForm.classList.add('open');
});

contactAuthorForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const body = new FormData(contactAuthorForm);
    const btns = contactAuthorForm.querySelectorAll('button');
    btns.forEach(btn => btn.disabled = true);
    fetch(contactAuthorForm.action, {method: "POST", body})
        .then(response => response.status)
        .then(status => {
            if(status === 204) {
                message('Your message has been sent to the author.');
                contactAuthorForm.reset();
            } else {
                throw ' ';
            }
        })
        .catch(err => {
            message( `<b>Oops!</b><br>Something went wrong, we couldn't send your message.`, 'error');
        })
        .finally(_ => {
            btns.forEach(btn => btn.disabled = false);
        });
});

contactAuthorForm.addEventListener('reset', evt => {
    contactAuthorForm.classList.remove('open');
});


/* share-message */
const shareMessageForm = document.getElementById('share-message-form');

document.getElementById('visitor-action-share-message').addEventListener('click', evt => {
    shareMessageForm.classList.add('open');
});
shareMessageForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const body = new FormData(shareMessageForm);
    const btns = shareMessageForm.querySelectorAll('button');
    btns.forEach(btn => btn.disabled = true);
    fetch(shareMessageForm.action, {method: "POST", body})
        .then(response => response.status)
        .then(status => {
            if(status === 204) {
                message('The poster URL has been send');
                shareMessageForm.reset();
                shareMessageForm.classList.remove('open');
            } else {
                throw 'response not 204';
            }
        })
        .catch(err => {
            console.log('error:', err);
            message( `<b>Oops!</b><br>Something went wrong, we couldn't send the poster URL.`, 'error', 10000);
        })
        .finally(_ => {
            btns.forEach(btn => btn.disabled = false);
        });
});

shareMessageForm.addEventListener('reset', evt => {
    shareMessageForm.classList.remove('open');
});

/* play / pause poster narration */
const audio = document.getElementById('poster-narration-audio');
if(audio){
    const player = document.getElementById('poster-narration-player');
    const action = document.getElementById('poster-narration-player-action');
    const current = document.getElementById('poster-narration-player-current');
    const duration = document.getElementById('poster-narration-player-duration');
    const progress = document.getElementById('poster-narration-player-progress');
    const btn = document.getElementById('visitor-action-narration');

    audio.addEventListener('loadeddata', evt => {
        duration.innerText = audio.duration.toTime();
    });

    audio.addEventListener('timeupdate', evt => {
        const time = audio.currentTime;
        const trackDuration = audio.duration;
        /** update duration if not the case */
        if(duration.innerText === '--:--') {
            duration.innerText = audio.duration.toTime();
        }
        current.innerText = time.toTime();
        player.style.setProperty('--progress', 100 * time / trackDuration);
    });

    audio.addEventListener('ended', evt => {
        player.classList.remove('play');
        current.innerText = '00:00';
        player.style.setProperty('--progress', 0);
        action.classList.remove('icon-pause');
    });

    btn.addEventListener('click', evt => {
        const playerVisible = player.classList.toggle('visible');
        const play = btn.classList.contains('play');
        if(playerVisible || !playerVisible && play) {
            play_pause();
        }
    });

    action.addEventListener('click', play_pause);

    function play_pause() {
        const play = btn.classList.toggle('play');
        if(play) {
            audio.play();
        } else {
            audio.pause();
        }
        player.classList.toggle('play', play);
        action.classList.toggle('icon-pause', play);
    }

    progress.addEventListener('click', evt => {
        let {width} = getComputedStyle(progress);
        width = parseFloat(width);
        const offset = evt.offsetX;
        audio.currentTime = audio.duration * offset / width;
    });
}
