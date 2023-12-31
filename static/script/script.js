const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

//Hamburger Menu
const navToggle = document.querySelector('.burger-menu');
const navLinks = document.querySelector('nav ul');
const nav = document.querySelector('nav');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    nav.classList.toggle('show');
    navToggle.classList.toggle('cross');
});

//Montrer le contenu au fur et a mesure qu'on scroll
window.addEventListener('scroll', () => {
    const intro = document.querySelector('.IntroArea');
    const discussion = document.querySelector('.Discussion');
    const msger = document.querySelector('.msger');

    if (intro.getBoundingClientRect().top < window.innerHeight * 0.5) {
        intro.classList.add('show');
    }
    if (discussion.getBoundingClientRect().top < window.innerHeight * 0.5) {
        discussion.classList.add('show');
    }
    if (msger.getBoundingClientRect().top < window.innerHeight * 0.5) {
        msger.classList.add('show');
    }
});


//Changer le theme
const themeLink = document.querySelector('.Links .Theme');
const body = document.querySelector('body');

themeLink.addEventListener('click', function() {
    if (body.classList.contains('Light-Theme')) {
        body.classList.remove('Light-Theme');
        body.classList.add('Dark-Theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('Dark-Theme');
        body.classList.add('Light-Theme');
        localStorage.setItem('theme', 'light');
    }
});

// On page load, check for the theme in local storage and apply it
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.remove('Light-Theme');
    body.classList.add('Dark-Theme');
} else {
    body.classList.remove('Dark-Theme');
    body.classList.add('Light-Theme');
}



// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "Little Bot";
const PERSON_IMG = "user";
const BOT_NAME = "Poly-IA";
const PERSON_NAME = "Vous";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    botResponse(msgText);
});

function appendMessage(name, img, side, text) {
    // Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img"><img src="/static/img/${img}.png" alt="Bot" width="50px" height="50px"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text" id="${side}">${text}</div>
        </div>
      </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}



// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function botResponse(rawText) {
    // Bot Response
    $.get("/get", { msg: rawText }).done(function(data) {
        console.log(rawText);
        console.log(data);
        const msgText = data;
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        var write = document.querySelector('#left');
        typingEffect(write);
        write.id = ' ';
    });
}

function typingEffect(element) {
    let text = element.innerHTML;
    element.innerHTML = "";
    var i = 0;
    var timer = setInterval(function() {
        if (i < text.length) {
            element.append(text.charAt(i));
            i++;
        } else {
            clearInterval(timer);
        }
    }, 10);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}