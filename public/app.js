const translateButton = document.getElementById('translate');
const charCountDiv = document.getElementById('word-count');
const [sourceSelect, targetSelect] = document.getElementsByTagName('select');
const [sourceTextArea, targetTextArea] = document.getElementsByTagName('textarea');

function updateCharCount() {
    const text = sourceTextArea.value;
    const charCount = text.length;
    charCountDiv.innerText = `${charCount}`;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        updateCharCount();
        targetTextArea.innerText = `Translating...`;
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function compareLang(lang1, lang2) {
    if(lang1 === lang2) {
        targetTextArea.innerText = sourceTextArea.value;
        return true;
    }
    return false;
}

const changeSelect = (lang, select) => {
    if(lang === "ko") {
        select.options[1].selected = true;
    } else if(lang === "en") {
        select.options[2].selected = true;
    } else if(lang === "jp") {
        select.options[3].selected = true;
    } else {
        select.options[0].selected = true;
    }
}

async function detectLang(text) {
    const response = await fetch('/detectLangs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query:`query=${text}`})
    });
    const data = await response.json();
    return [data.statusCode, data.langCode];
}    

async function translate(source, target, text) {
    const response = await fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ source:source, target:target, text:text }) //
    });
    const data = await response.json();
    return data.message.result.translatedText;
}

// Listener
sourceTextArea.addEventListener('input', debounce(async () => {
    if(sourceTextArea.value === '') {
        targetTextArea.innerText = '';
        return;
    }
    
    try {
        const [responseCode, langCode] = await detectLang(sourceTextArea.value);
        console.log(responseCode, langCode);
        changeSelect(langCode, sourceSelect);
        if(responseCode === 200) {
            if(compareLang(sourceSelect.value, targetSelect.value)) return;
            let text = ``;
            try {
                const translateRes = await translate(sourceSelect.value, targetSelect.value, sourceTextArea.value);
                text = `${translateRes}`;  
            } catch (error) {
                changeSelect('error', sourceSelect);
                text = `Error Translate language: ${error}`;
                console.error(error);
            }
            targetTextArea.innerText = text;
        }        
    } catch (error) {
        targetTextArea.innerText = `Error Detect language: ${error}`;
        console.error(error);
    }
}, 500));

translateButton.addEventListener('click', async () => {
    let text = ``;
    if(compareLang(sourceSelect.value, targetSelect.value)) return;
    try {
        const translateRes = await translate(sourceSelect.value, targetSelect.value, sourceTextArea.value);
        text = `${translateRes}`;
    } catch (error) {
        changeSelect('error', sourceSelect);
        text = `Error Translate language: ${error}`;
        console.error(error);
    }
    targetTextArea.innerText = text;

});





