// A standard clean country pair setup mapping for open-source translation APIs
const countries = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "ja": "Japanese",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "pt": "Portuguese",
    "ru": "Russian"
};

const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("#translate-btn");
const icons = document.querySelectorAll(".row i");

// Populate the select dropdown menus dynamically
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected = id == 0 ? (country_code == "en" ? "selected" : "") : (country_code == "es" ? "selected" : "");
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange text and language selection when clicking the swap icon
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

// Core function to fetch data from the Translation API
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value; 
    let translateTo = selectTag[1].value;   
    
    if(!text) return;
    toText.placeholder = "Translating...";
    
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            toText.placeholder = "Translation";
        })
        .catch(error => {
            console.error("Error with Translation API:", error);
            toText.placeholder = "Translation failed. Try again.";
        });
});

// Clean target handling using specific positional classes
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value && !toText.value) return;
        
        // Handle Copying functionality
        if(target.classList.contains("fa-copy")) {
            if(target.classList.contains("btn-from")) {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            // Handle Text-to-Speech functionality
            let utterance;
            if(target.classList.contains("btn-from")) {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            window.speechSynthesis.speak(utterance);
        }
    });
});
