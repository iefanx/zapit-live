const form = document.getElementById('paywall-form');

// Auto-fill userAPI key if available
const apiKeyField = form.elements['api-key'];
const storedApiKey = localStorage.getItem('apiKey');
if (storedApiKey) {
  const decryptedApiKey = decrypt(storedApiKey);
  apiKeyField.value = decryptedApiKey;
}

const walletIdField = form.elements['wallet-id'];
const storedWalletId = localStorage.getItem('walletId');
if (storedWalletId) {
  const decryptedWalletId = decrypt(storedWalletId);
  walletIdField.value = decryptedWalletId;
}

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  
  const { url, memo, description, amount, remembers, rememberApiKey, walletId } = getFormData();
  const apiKey = apiKeyField.value;

  createPaywall({
    url,
    memo,
    description,
    amount,
    remembers,
    apiKey
  })
  .then(showPaywallLink)
  .catch(handleError);

  if (rememberApiKey) {
    saveApiKey(apiKey);
    if (walletId) {
      saveWalletId(walletId);
    }
  }
}



function getFormData() {
  return {
    url: form.elements.url.value,
    memo: form.elements.memo.value,
    description: form.elements.description.value,
    amount: form.elements.amount.value,
    remembers: form.elements.remembers.checked,
    rememberApiKey: form.elements.rememberApiKey.checked,
    walletId: form.elements['wallet-id'].value
  };
}


function createPaywall({ url, memo, description, amount, remembers, apiKey }) {
  return fetch('https://pay.zapit.live/paywall/api/v1/paywalls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey
    },
    body: JSON.stringify({
      url,
      memo,
      description,
      amount,
      remembers
    })
  })
  .then(response => response.json());
}

function showPaywallLink(data) {
  const paywallId = data.id;
  const responseElement = document.getElementById('response');
  if (typeof paywallId === 'undefined') {
    responseElement.innerText = 'Please check your Login Key by pressing "Login" button';
  } else {
    responseElement.innerHTML = `
      <button id="copyBtn">Copy Paywall link</button>
    `;
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.addEventListener('click', () => {
      copyToClipboard(`https://pay.zapit.live/paywall/${paywallId}`);
      showCopiedMessage(copyBtn);
    });
  }
  showElement(responseElement);
}


function handleError(error) {
  console.error(error);
  // handle the error
}

function showElement(element) {
  element.style.display = "block";
}

function copyToClipboard(text) {
  const tempElement = document.createElement('textarea');
  tempElement.value = text;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);
}

function showCopiedMessage(button) {
  button.innerText = 'Copied!';
  setTimeout(() => {
    button.innerText = 'Copy Paywall Link';
  }, 1000);
}

function encrypt(data) {
  // TODO: implement encryption algorithm
  return data;
}

function decrypt(data) {
  // TODO: implement decryption algorithm
  return data;
}

function saveApiKey(apiKey) {
  const encryptedApiKey = encrypt(apiKey);
  localStorage.setItem('apiKey', encryptedApiKey);
}

function saveWalletId(walletId) {
  const encryptedWalletId = encrypt(walletId);
  localStorage.setItem('walletId', encryptedWalletId);
}






const toggleButton = document.getElementById('toggleButton');
const hiddenElements = document.getElementById('hiddenElements');

toggleButton.addEventListener('click', () => {
  hiddenElements.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!hiddenElements.contains(event.target) && !toggleButton.contains(event.target) && !hiddenElements.classList.contains('hidden')) {
    hiddenElements.classList.add('hidden');
  }
});


const deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', handleDeleteClick);


function handleDeleteClick() {
  deleteApiKey();
  deleteWalletId();
}


function deleteApiKey() {
  localStorage.removeItem('apiKey');
  apiKeyField.value = '';
}

function deleteWalletId() {
  localStorage.removeItem('walletId');
  walletIdField.value = '';
}

// Add an event listener to the button in your JavaScript code

const openWalletBtn = document.getElementById('open-wallet-btn');
openWalletBtn.addEventListener('click', handleOpenWalletClick);


// Create a function to handle the open wallet button click event:
function handleOpenWalletClick() {
  const walletId = walletIdField.value;
  if (walletId) {
    const walletUrl = `${walletId}`; // Replace with the actual wallet URL format
    window.open(walletUrl, '_blank');
  } else {
    alert('Please enter a Wallet ID');
  }
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}


// JavaScript code to prompt the user to install the PWA when they click the button
