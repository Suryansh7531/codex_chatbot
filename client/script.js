import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

//to type each letter one by one like robot style 
function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    //23:52 currently we are giving it an empty string becoz it is going to be filled up later on right here(loader)
    //remember we are filling it up as we are loading  the actual message 
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    //now as the user types we want to keep scrooling downto see that message\
    //this is going to put new message in view
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    //finallly we have to turn on the loader
    loader(messageDiv)
    //loader chalao jab tak response nahi aa jata

    //now go to form.eventlistener to call handle submit and check if it working fine
    //this is part2 connecting server to client
    //now we start making our backend 
    ///now making a call to open ai api to fetch the response
    // now create server folder
    //fetch data from server->bot's response
    // const response = await fetch('https://codex-im0y.onrender.com/', {
    // const response = await fetch('http://localhost:5000', {
    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    // after getting response we want to clear the interval
    clearInterval(loadInterval);
    //cuz we are no longer loading 
    // messageDiv.innerHTML = " "//(github mein space hai )
    messageDiv.innerHTML = "";
    // cuz we dont know at which point in the loading are we 
    //right now at the point when we fetch we might be at 1 dot 2 dots 3 dots 
    //we want to be clear to empty for us to be able to add our message
    if (response.ok) {
        const data = await response.json();
        //this is giving us actual response from the backend
        const parsedData = data.bot.trim()
        // trims any trailing spaces/'\n' 
        // console.log({parsedData});
        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        console.log(err);
        alert(err)
    }
}
// to be able to see the changes that we made to our handleSubmit   
// we have to somehow call it part 1

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {//submittin user enter key
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})


//deleted all below code
//at this point we dont need inside our script.js file 
// import './style.css'
// import javascriptLogo from './javascript.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
