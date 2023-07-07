function message(html, type = 'success', delay = 4000){
    const msg = document.createElement('div');
    msg.innerHTML = html;
    msg.className = `message message-start message-${type}`;
    msg.addEventListener('click', removeMsg);
    document.body.append(msg);
    setTimeout(() => {
        msg.classList.remove('message-start');
    }, 10);

    if(delay !== Infinity){
        setTimeout(() => {
            removeMsg();
        }, delay);
    }

    function removeMsg(){
        msg.classList.add('message-end');
        const transition = 1000 * parseFloat(window.getComputedStyle(msg).transitionDuration) + 10;
        setTimeout(() => {
            msg.remove();
        }, transition);
    }
}
