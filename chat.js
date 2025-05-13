const HeaderHTML = document.querySelector('.head-container');
const pageContainer = document.querySelector('.chat-container')
const chatBodyContianer = document.querySelector('.js-chatbody');
const textArea = document.querySelector('.js-text-area textarea');
const sendChatBtn = document.querySelector('.js-sendBtn');
const mediaHtml = document.querySelector('.js-media');
let timer; 
console.log('updated')
console.log(window.visualViewport.height)
console.log(window.innerHeight)
/* render conversation on page-load and set height of the page */
 handlePageHeight()
 renderChat()
//  autoChat()

/* listen for viewport change resize*/
// window.visualViewport.addEventListener('resize', () => {
//   console.log('page resized')
//   let timeout;
//   clearTimeout(timeout)
//   timeout = setTimeout(() => {
//     handlePageHeight()
//   }, 200)
// })
/* resize when input gets focuses*/
textArea.addEventListener('focus', () => {
  // handlePageHeight();
  // HeaderHTML.classList.add('sticky')
  console.log(window.visualViewport.height)
});

/* this array contains list of chats been retrieved from the browser storage and defaul value of [] is set if null is returned*/
const conversation = JSON.parse(localStorage.getItem('conversation')) ?? [];

textArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleChat()
    textArea.value = ''
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
})


/* FUNCTIONS SECTION */
function handleChat() {
  addToChat()
  renderChat()
}

function handlePageHeight() {
  document.documentElement.style.setProperty('--windowHeight', `${window.visualViewport.height}px`)
  document.documentElement.style.setProperty('--windowWidth', `${window.visualViewport.width}px`);
  pageContainer.offsetHeight;
  pageContainer.offsetWidth;
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
  const conversation = chats.map((item) => {
    const class1 = (item.type === 'sender') ? 'sender': 'receiver';
    const time = getCurrentTime()
    return (
       `<div class="chat-item ${class1}">
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

/* function that automatically add to the  conversation */

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