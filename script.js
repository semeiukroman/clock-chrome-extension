
const clock = document.createElement('div');
clock.classList.add('clock_extension', 'hide', 'draggable');
setInterval(updateClock, 1000);
updateClock();
document.body.append(clock);

chrome.storage.local.get(['display'], result => {
    if (result.display) clock.classList.remove('hide');
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    clock.classList.toggle('hide');
});

document.addEventListener('keydown', function (event) {
    if (event.code === 'Enter') {
        chrome.storage.local.set({ display: clock.classList.contains('hide') });
    }
});


function updateClock() {
    const date = new Date();
    const time = new Intl.DateTimeFormat('en-En', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(date);
    clock.innerText = time;
}

// drag-on-drop clock

dragElement(clock);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (clock) {
        /* if present, the header is where you move the DIV from:*/
        clock.onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(event) {
        event.preventDefault();
        event = event || window.event;
        // get the mouse cursor position at startup:
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(event) {
        event.preventDefault();
        event = event || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}