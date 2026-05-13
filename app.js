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

const refreshButton =
document.getElementById('refreshButton');

const fontSizeOptions =
document.querySelectorAll(
    '.fontSizeOption'
);

let selectedFontSize = 64;

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

fontSizeOptions.forEach(
    (option) => {

        option.addEventListener(
            'click',
            () => {

                fontSizeOptions.forEach(
                    (btn) => {

                        btn.classList.remove(
                            'selected'
                        );
                    }
                );

                option.classList.add(
                    'selected'
                );

                selectedFontSize =
                option.dataset.size;
            }
        );
    }
);

speedSlider.addEventListener(
    'input',
    () => {

        scrollSpeed =
        parseFloat(
            speedSlider.value
        );

        speedValue.innerText =
        scrollSpeed;

        updateSpeedUI();
    }
);

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

    prompter.style.fontSize =
    `${selectedFontSize}px`;

    prompter.style.lineHeight =
    '1.5';

    scrollSpeed =
    parseFloat(speedSlider.value);

    updateSpeedUI();

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

    localStorage.setItem(
    'prompter_fontsize',
    selectedFontSize
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

            prompterScreen.scrollTop +=
                scrollSpeed * 1.2;
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

        const processedHtml =

        html
        
        .replaceAll(
            'color:#000000',
            'color:#ffffff'
        )
        
        .replaceAll(
            'color:black',
            'color:#ffffff'
        )
        
        .replace(
            /font-size:[^;"]+;?/gi,
            ''
        );

        if (
            processedHtml !==
            currentContent
        ) {

            const currentScroll =
            prompterScreen.scrollTop;

            currentContent =
            processedHtml;

            prompter.innerHTML =
            currentContent;

            prompterScreen.scrollTop =
            currentScroll;
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
 * KEYBOARD CONTROLS
 ****************************************/

window.addEventListener(
    'keydown',
    (event) => {

    console.log(
        'KEY:',
        event.key,
        'CODE:',
        event.code
    );

    /******************************
     * BLOQUEAR F5
     ******************************/

    if (
        event.key === 'F5'
    ) {

        event.preventDefault();

        return;
    }

    switch (event.key) {

        /******************************
         * PLAY / PAUSE
         ******************************/

        case ' ':

        case 'b':

        case 'B':

            event.preventDefault();

            paused = !paused;

            playbackStatus.innerText =

                paused

                ? 'PAUSED'

                : 'PLAYING';

            break;

        /******************************
         * SPEED UP
         ******************************/

        case 'ArrowUp':

        case 'PageDown':

            event.preventDefault();

            scrollSpeed = Math.min(
                CONFIG.MAX_SPEED,
                scrollSpeed + 1
            );

            updateSpeedUI();

            break;

        /******************************
         * SPEED DOWN
         ******************************/

        case 'ArrowDown':

        case 'PageUp':

            event.preventDefault();

            scrollSpeed = Math.max(
                -CONFIG.MAX_SPEED,
                scrollSpeed - 1
            );

            updateSpeedUI();

            break;

        /******************************
         * IGNORAR SHIFT
         ******************************/

        case 'Shift':

            event.preventDefault();

            break;

        /******************************
         * FULLSCREEN
         ******************************/

        case 'f':

        case 'F':

            toggleFullscreen();

            break;

        /******************************
         * ESCAPE
         ******************************/

        case 'Escape':

            paused = true;

            playbackStatus.innerText =
            'PAUSED';

            break;
    }

});

/****************************************
 * UPDATE SPEED UI
 ****************************************/

function updateSpeedUI() {

    speedSlider.value =
    Math.max(
        1,
        scrollSpeed
    );

    speedValue.innerText =
    scrollSpeed;

    if (scrollSpeed > 0) {

        speedIndicator.innerText =
        `DOWN ${scrollSpeed}`;

    } else if (scrollSpeed < 0) {

        speedIndicator.innerText =
        `UP ${Math.abs(scrollSpeed)}`;

    } else {

        speedIndicator.innerText =
        'PAUSED';
    }
}

/****************************************
 * MANUAL REFRESH
 ****************************************/

refreshButton.addEventListener(
    'click',
    async () => {

    await fetchPrompterData();
});

/****************************************
 * AUTO REFRESH
 ****************************************/

setInterval(
    async () => {

        if (documentId) {

            await fetchPrompterData();
        }

    },
    15000
);

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

    const savedFontSize =
    localStorage.getItem(
        'prompter_fontsize'
    );

    if (savedFontSize) {

        selectedFontSize =
        savedFontSize;

        fontSizeOptions.forEach(
            (btn) => {

                btn.classList.remove(
                    'selected'
                );

                if (
                    btn.dataset.size ===
                    savedFontSize
                ) {

                    btn.classList.add(
                        'selected'
                    );
                }
            }
        );
    }

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
