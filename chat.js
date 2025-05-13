const HeaderHTML = document.querySelector('.head-container');
const pageContainer = document.querySelector('.chat-container')
const chatBodyContianer = document.querySelector('.js-chatbody');
const textArea = document.querySelector('.js-text-area textarea');
const sendChatBtn = document.querySelector('.js-sendBtn');
const mediaHtml = document.querySelector('.js-media');
let timer; 

/* render conversation on page-load and set height of the page */
 handlePageHeight()
 renderChat()
//  autoChat()

/* listen for viewport change resize*/
let timeout;
window.visualViewport.addEventListener('resize', () => {
  
  clearTimeout(timeout)
  setTimeout(() => {
    handlePageHeight()
    if (window.scrollY !== 0) {
    HeaderHTML.style.position = 'sticky';
    HeaderHTML.style.top = `${window.scrollY - 50}px`
  } else {
    HeaderHTML.style.position = 'fixed';
    HeaderHTML.style.top = '0px'
  }
  }, 300)

  // document.querySelector('body').style.transform = `translateY(${window.scrollY}px)`
})

/* resize when input gets focuse and lose focus*/
textArea.addEventListener('focus', () => {
  
});

// let clear;
// textArea.addEventListener('blur', () => {
//   clearTimeout(clear)
//   clear = setTimeout(() => {
//        document.querySelector('body').style.transform = `translateY(-${window.scrollY}px)`
//     }, 100)
// })


/* this array contains list of chats been retrieved from the browser storage and defaul value of [] is set if null is returned*/
const conversation = JSON.parse(localStorage.getItem('conversation')) ?? [];

textArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleChat()
    textArea.value = ''
    const lastMsg = document.getElementById('chat-item0');
    lastMsg.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
  }
});

textArea.addEventListener('input', () => {
  if (textArea.value !== '') {
    sendChatBtn.classList.add('showSendBtn');
    mediaHtml.classList.add('hideMedia')
  } else {
    sendChatBtn.classList.remove('showSendBtn');
    mediaHtml.classList.remove('hideMedia')
  }
});

sendChatBtn.addEventListener('click', () => {
  handleChat()
  textArea.value = ''
  textArea.focus()
  const lastMsg = document.getElementById('chat-item0');
  lastMsg.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
})

const lastMsg = document.getElementById('chat-item0');
console.log(lastMsg)
/* FUNCTIONS SECTION */
function handleChat() {
  addToChat()
  renderChat()
}

function handlePageHeight() {
  document.documentElement.style.setProperty('--windowHeight', `${window.visualViewport.height}px`)
  document.documentElement.style.setProperty('--windowWidth', `${window.visualViewport.width}px`);
}

function saveToStorage() {
  localStorage.setItem('conversation', JSON.stringify(conversation))
}

function addToChat() {
  if (textArea.value.trim() !== '') {
    conversation.unshift({type: 'sender', value: textArea.value})
    saveToStorage()
  }
}

function renderChat () {
  const chats = JSON.parse(localStorage.getItem('conversation')) ?? [];
  const conversation = chats.map((item, index) => {
    const class1 = (item.type === 'sender') ? 'sender': 'receiver';
    const time = getCurrentTime()
    return (
       `<div class="chat-item ${class1}" id="chat-item${index}">
          <div>${item.value}</div>
          <span>${time}</span>
       </div>`
    )

  })
  chatBodyContianer.innerHTML = conversation.join('')
}

function getCurrentTime() {
  const hour = new Date().getHours();
  const formatedHour = hour > 12 ? hour - 12 : hour
  const qualifier = hour > 12 ? 'PM' : 'AM'
  const minute = new Date().getMinutes()
  const formatedMinute = minute < 10 ?`0${minute}` : minute;
  const currentTime = `${formatedHour}:${formatedMinute} ${qualifier}`

  return currentTime
}

/* function that automatically add msg to the conversation array*/

async function autoChat() {
  clearInterval(timer);
  await new Promise((resolve) => {
    timer = setInterval(() => {
      conversation.unshift({type: 'receiver', value: 'Hey, I am a Bot'});
      saveToStorage();
      renderChat()
      resolve()
    }, 20000);
  });
}

// conseole.log(localStorage)