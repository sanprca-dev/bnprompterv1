const prompter =
document.getElementById('prompter');

const connectionStatus =
document.getElementById('connectionStatus');

const playbackStatus =
document.getElementById('playbackStatus');

const speedIndicator =
document.getElementById('speedIndicator');

const setupScreen =
document.getElementById('setupScreen');

const prompterScreen =
document.getElementById('prompterScreen');

const docLinkInput =
document.getElementById('docLinkInput');

const speedSlider =
document.getElementById('speedSlider');

const speedValue =
document.getElementById('speedValue');

const orientationSelect =
document.getElementById('orientationSelect');

const startButton =
document.getElementById('startButton');

const setupError =
document.getElementById('setupError');

/****************************************
 * STATE
 ****************************************/

let currentContent = '';

let scrollSpeed =
CONFIG.DEFAULT_SPEED;

let paused = false;

let animationFrame;

let documentId = '';

let orientation = 'normal';

/****************************************
 * UI INIT
 ****************************************/

speedSlider.addEventListener('input', () => {

    scrollSpeed =
    parseFloat(speedSlider.value);

    speedValue.innerText =
    scrollSpeed;

    speedIndicator.innerText =
    `SPEED ${scrollSpeed}`;
});

/****************************************
 * EXTRACT GOOGLE DOC ID
 ****************************************/

function extractGoogleDocId(url) {

    const regex =
    /\/document\/d\/([a-zA-Z0-9-_]+)/;

    const match =
    url.match(regex);

    if (match && match[1]) {

        return match[1];
    }

    return null;
}

/****************************************
 * START BUTTON
 ****************************************/

startButton.addEventListener('click', async () => {

    setupError.innerText = '';

    const url =
    docLinkInput.value.trim();

    if (!url) {

        setupError.innerText =
        'Paste a Google Docs URL';

        return;
    }

    const extractedId =
    extractGoogleDocId(url);

    if (!extractedId) {

        setupError.innerText =
        'Invalid Google Docs URL';

        return;
    }

    documentId = extractedId;

    orientation =
    orientationSelect.value;

    applyOrientation();

    scrollSpeed =
    parseFloat(speedSlider.value);

    speedIndicator.innerText =
    `SPEED ${scrollSpeed}`;

    localStorage.setItem(
        'prompter_doc',
        url
    );

    localStorage.setItem(
        'prompter_orientation',
        orientation
    );

    localStorage.setItem(
        'prompter_speed',
        scrollSpeed
    );

    setupScreen.style.display =
    'none';

    prompterScreen.style.display =
    'block';

    await fetchPrompterData();

    startScrollEngine();

});

/****************************************
 * APPLY ORIENTATION
 ****************************************/

function applyOrientation() {

    prompter.classList.remove(
        'normal',
        'mirror-x',
        'mirror-y',
        'mirror-both'
    );

    prompter.classList.add(
        orientation
    );
}

/****************************************
 * SCROLL ENGINE
 ****************************************/

function startScrollEngine() {

    function animate() {

        if (!paused) {

            window.scrollBy(
                0,
                scrollSpeed * 0.4
            );
        }

        animationFrame =
        requestAnimationFrame(
            animate
        );
    }

    animate();
}

/****************************************
 * FETCH REMOTE
 ****************************************/

async function fetchPrompterData() {

    try {

        const finalUrl =

            CONFIG.API_URL +

            '?doc=' +

            documentId +

            '&t=' +

            Date.now();

        const response =
        await fetch(finalUrl, {

            cache: 'no-store'
        });

        const html =
        await response.text();

        if (
            html !== currentContent
        ) {

            const currentScroll =
            window.scrollY;

            currentContent =
            html;

            prompter.innerHTML =
            currentContent;

            window.scrollTo(
                0,
                currentScroll
            );
        }

        connectionStatus.innerText =
        'LIVE';

        connectionStatus.style.color =
        '#00ff99';

    } catch (error) {

        console.error(error);

        connectionStatus.innerText =
        'OFFLINE';

        connectionStatus.style.color =
        '#ff4d4d';
    }
}

/****************************************
 * AUTO REFRESH
 ****************************************/

setInterval(() => {

    if (documentId) {

        fetchPrompterData();
    }

}, CONFIG.REFRESH_INTERVAL);

/****************************************
 * KEYBOARD CONTROLS
 ****************************************/

window.addEventListener(
    'keydown',
    (event) => {

    switch (event.key) {

        case ' ':

            event.preventDefault();

            paused = !paused;

            playbackStatus.innerText =

                paused

                ? 'PAUSED'

                : 'PLAYING';

            break;

        case 'ArrowUp':

            scrollSpeed = Math.min(
                CONFIG.MAX_SPEED,
                scrollSpeed + 1
            );

            updateSpeedUI();

            break;

        case 'ArrowDown':

            scrollSpeed = Math.max(
                CONFIG.MIN_SPEED,
                scrollSpeed - 1
            );

            updateSpeedUI();

            break;

        case 'f':

        case 'F':

            toggleFullscreen();

            break;
    }

});

/****************************************
 * UPDATE SPEED UI
 ****************************************/

function updateSpeedUI() {

    speedSlider.value =
    scrollSpeed;

    speedValue.innerText =
    scrollSpeed;

    speedIndicator.innerText =
    `SPEED ${scrollSpeed}`;
}

/****************************************
 * FULLSCREEN
 ****************************************/

async function toggleFullscreen() {

    if (
        !document.fullscreenElement
    ) {

        await document
        .documentElement
        .requestFullscreen();

    } else {

        await document
        .exitFullscreen();
    }
}

/****************************************
 * LOAD SAVED SETTINGS
 ****************************************/

window.addEventListener(
    'load',
    () => {

    const savedDoc =
    localStorage.getItem(
        'prompter_doc'
    );

    const savedOrientation =
    localStorage.getItem(
        'prompter_orientation'
    );

    const savedSpeed =
    localStorage.getItem(
        'prompter_speed'
    );

    if (savedDoc) {

        docLinkInput.value =
        savedDoc;
    }

    if (savedOrientation) {

        orientationSelect.value =
        savedOrientation;
    }

    if (savedSpeed) {

        speedSlider.value =
        savedSpeed;

        speedValue.innerText =
        savedSpeed;
    }
});
