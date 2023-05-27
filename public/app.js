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
    alert('Please enter a Wallet ID in "Login');
  }
}


const otherButton = document.getElementById('otherButton');
otherButton.addEventListener('click', handleOtherButtonClick);

// Create a function to handle the other button click event:
function handleOtherButtonClick() {
  const walletIdField = document.getElementById('wallet-id');
  const walletId = walletIdField.value;
  if (walletId) {
    const modifiedWalletId = walletId.replace('wallet', 'market');
    const walletUrl = `${modifiedWalletId}`; // Replace with the actual wallet URL format for the other button
    window.open(walletUrl, '_blank');
  } else {
    alert('Please enter a Wallet ID in "Login');
  }
}

const opensplit = document.getElementById('opensplit');
opensplit.addEventListener('click', handleOtherButtonClick);

// Create a function to handle the other button click event:
function handleOtherButtonClick() {
  const walletIdField = document.getElementById('wallet-id');
  const walletId = walletIdField.value;
  if (walletId) {
    const modifiedWalletId = walletId.replace('wallet', 'splitpayments');
    const walletUrl = `${modifiedWalletId}`; // Replace with the actual wallet URL format for the other button
    window.open(walletUrl, '_blank');
  } else {
    alert('Please enter a Wallet ID in "Login');
  }
}


let deferredPrompt;

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Store the event to use later
  deferredPrompt = e;
  // Show the "Install" button
  document.getElementById('installPWA').style.display = 'block';
});

// Attach a click event listener to the "Install" button
document.getElementById('installPWA').addEventListener('click', (e) => {
  // If there is a deferred prompt, show it
  if (deferredPrompt) {
    deferredPrompt.prompt();
    // Check the user's choice
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  }
});


// Detect when the PWA is installed and update the UI
window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
  console.log('PWA installed successfully.');
});


const createLinkBtn = document.getElementById('createLinkBtn');
const newButton = document.getElementById('newButton');
const modal = document.getElementById('myModal');
const newModal = document.getElementById('newModal');
const closeModal = document.querySelectorAll('.close');

// Open the modal when the "Create Link" button is clicked
createLinkBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Open the newModal when the "New Button" is clicked
newButton.addEventListener('click', () => {
  newModal.style.display = 'block';
});

// Close the modal when the "X" button is clicked
closeModal.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.closest('.modal')) {
      btn.closest('.modal').style.display = 'none';
    }
  });
});

closeModal.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.closest('.modal3')) {
      btn.closest('.modal3').style.display = 'none';
    }
  });
});
closeModal.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.closest('.modal2')) {
      btn.closest('.modal2').style.display = 'none';
    }
  });
});
// Close the modal when the user clicks outside the modal content
[modal2, newModal].forEach(targetModal => {
  targetModal.addEventListener('click', (event) => {
    if (event.target === targetModal) {
      targetModal.style.display = 'none';
    }
  });
});
