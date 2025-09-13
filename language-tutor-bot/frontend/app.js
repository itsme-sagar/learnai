const apiBase = "http://localhost:5000/api";

const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const languageSelect = document.getElementById('language');
const scenarioSelect = document.getElementById('scenario');
const lastCorrection = document.getElementById('lastCorrection');
const themeToggle = document.getElementById('themeToggle');
const clearBtn = document.getElementById('clearBtn');

function appendBubble(text, who='bot', correction=null){
  const div = document.createElement('div');
  div.className = 'bubble ' + (who==='user' ? 'from-user' : 'from-bot');
  div.innerHTML = text.replace(/\n/g,'<br>');
  chatWindow.appendChild(div);
  if (correction){
    const corr = document.createElement('div');
    corr.className = 'correction';
    corr.innerHTML = '<strong>Correction:</strong> ' + correction;
    chatWindow.appendChild(corr);
    lastCorrection.innerText = 'Last correction: ' + correction;
  }
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage(){
  const msg = messageInput.value.trim();
  if (!msg) return;
  appendBubble(msg, 'user');
  messageInput.value = '';
  // show typing indicator
  const typing = document.createElement('div');
  typing.className = 'bubble from-bot';
  typing.id = 'typing';
  typing.innerText = 'Tutor is typing...';
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const res = await fetch(apiBase + '/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        message: msg,
        language: languageSelect.value,
        scenario: scenarioSelect.value
      })
    });
    const data = await res.json();
    document.getElementById('typing')?.remove();
    appendBubble(data.reply, 'bot', data.correction || null);
    // optional TTS
    if ('speechSynthesis' in window){
      const utter = new SpeechSynthesisUtterance(data.reply);
      // set voice/lang based on selected language (best-effort)
      try {
        const lang = {
          'French':'fr-FR','Spanish':'es-ES','Nepali':'ne-NP','English':'en-US'
        }[languageSelect.value] || 'en-US';
        utter.lang = lang;
      } catch(e){}
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  } catch(err){
    document.getElementById('typing')?.remove();
    appendBubble('Error contacting server. See console for details.', 'bot');
    console.error(err);
  }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') sendMessage(); });

// Mic / Voice input using Web Speech API
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.onresult = (e)=>{
    const t = e.results[0][0].transcript;
    messageInput.value = t;
    sendMessage();
  };
  recognition.onerror = (e)=>{ console.warn('Speech error', e); };
} else {
  micBtn.style.opacity = 0.4;
  micBtn.title = 'Voice input not supported in this browser';
}

micBtn.addEventListener('click', ()=>{
  if (!recognition) return;
  recognition.start();
});

// Theme toggle
themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('dark');
});

clearBtn.addEventListener('click', ()=>{
  chatWindow.innerHTML = '';
  lastCorrection.innerText = '';
});

// Seed welcome message
appendBubble('Salut! I am your AI tutor. Say something in the selected language to start.', 'bot');
