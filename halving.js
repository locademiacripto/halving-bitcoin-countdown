const halving = document.getElementById("halving-block");
const height = document.getElementById("current-block-height");
const remaining = document.getElementById("remaining-blocks");
const timeEstimate = document.getElementById("time-estimate");
const halvingDate = document.getElementById("halving-date");

const apiArray = [
    {
        name: "Blockchair",
        url: 'https://api.blockchair.com/bitcoin/stats'
    },
    {
        name: "Blockchain",
        url: 'https://blockchain.info/q/getblockcount'
    },
    {
        name: "Blockstream",
        url: "https://blockstream.info/api/blocks/tip/height"
    }
];

async function getCurrentBlockHeight() {
    function isNumber(value) {
        return typeof(value) === 'number' && isFinite(value);
    }

    for(let api of apiArray) {
        try {
            let response = await fetch(api.url);
            let data = await response.json();

            console.log(api.name, data);

            if(api.url == 'https://api.blockchair.com/bitcoin/stats') {
                if(isNumber(data.data.blocks)) {
                    return data.data.blocks;
                }
            } else if (api.url == 'https://blockchain.info/q/getblockcount' || api.url == 'https://blockstream.info/api/blocks/tip/height') {
                if(isNumber(data)) {
                    return data;
                }
            } 
        } catch (error) {
            console.error(`Error fetching current block height from: ${api.name}, ${error.message}`);
        }
    }

    console.error(`Error fetching current block height from all APIs!`);
    throw new Error('Error fetching current block height from all APIs');
}

function calculateNextHalving(currentBlock) {
    const halvingInterval = 210000;
    const blocksRemaining = halvingInterval - (currentBlock % halvingInterval);
    const remainingTime = estimateTimeRemaining(blocksRemaining);
    const currentDate = new Date();
    const nextHalvingDate = new Date(currentDate.getTime() + remainingTime * 1000);

    halving.textContent = currentBlock + blocksRemaining;
    height.textContent = currentBlock;
    remaining.textContent = blocksRemaining;
    halvingDate.textContent = `${nextHalvingDate.toDateString()} ${nextHalvingDate.toLocaleTimeString()}`;

    calculateCountdown(remainingTime);
}

function estimateTimeRemaining(remainingBlocks, averageBlockTime = 10) {
    return remainingBlocks * averageBlockTime;
}

function calculateCountdown(totalSeconds) {
    // Modificar según tus necesidades para mostrar el tiempo restante en el formato deseado
    const countdown = `${Math.floor(totalSeconds / 3600)} hours and ${Math.floor((totalSeconds % 3600) / 60)} minutes`;
    timeEstimate.textContent = countdown;
}

async function setDisplay() {
    try {
        let currentBlockHeight = await getCurrentBlockHeight();
        calculateNextHalving(currentBlockHeight);
    } catch (error) {
        console.error(`Error occurred in setDisplay(), ${error.message}`);
    }
}

window.addEventListener("load", function() {
    setDisplay();
    setInterval(() => { setDisplay(); }, 1000 * 60);
});
