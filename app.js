const prompter = document.getElementById('prompter');
const connectionStatus = document.getElementById('connectionStatus');

let currentContent = '';

let scrollSpeed = CONFIG.DEFAULT_SPEED;

let paused = false;

let animationFrame;

/*****
 * SCROLL ENGINE
 *****/

function startScrollEngine() {

    function animate() {

        if (!paused) {
            window.scrollBy(0, scrollSpeed * 0.4);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

startScrollEngine();

/*****
 * FETCH REMOTO
 *****/

async function fetchPrompterData() {

    try {
        const response = await fetch(
            CONFIG.API_URL + '&t=' + Date.now()
            {
                cache: 'no-store',
            }
        );

        const html = await response.text();
        if (html !== currentContent) {

            const currentScroll = window.scrollY;

            currentContent = html;

            prompter.innerHTML = currentContent;

            window.scrollTo(0, currentScroll);
        }

        connectionStatus.innerText = 'LIVE';
        connectionStatus.style.color = '#00ff99';
    } catch (error) {

        console.error('Error fetching prompter data:', error);

        connectionStatus.innerText = 'OFFLINE';
        connectionStatus.style.color = '#ff4d4d';
    }

}

setInterval(fetchPrompterData, CONFIG.REFRESH_INTERVAL);

fetchPrompterData();

/*****
 * CONTROLES PUNTERO USB/BLUETOOTH
 *****/

window.addEventListener('keydown', (event) => {

    switch (event.key) {

        case 'ArrowDown':
            scrollSpeed += 0.5;
            break;

        case 'ArrowUp':
            scrollSpeed -= 0.5;
            break;
        
        case ' ':
            paused = !paused;
            break;
        
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
    }

    scrollSpeed = Math.max(
        CONFIG.MIN_SPEED,
         Math.min(CONFIG.MAX_SPEED, scrollSpeed)
        );

});  

/*****
 * CONTROLES PUNTERO USB/BLUETOOTH
 *****/

async function toggleFullscreen() {

    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
}
