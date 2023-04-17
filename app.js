const form = document.getElementById('paywall-form');

// Auto-fill userAPI key if available
const apiKeyField = form.elements['api-key'];
const storedApiKey = localStorage.getItem('apiKey');
if (storedApiKey) {
  const decryptedApiKey = decrypt(storedApiKey);
  apiKeyField.value = decryptedApiKey;
}

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  
  const { url, memo, description, amount, remembers, rememberApiKey } = getFormData();
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
  }
}

function getFormData() {
  return {
    url: form.elements.url.value,
    memo: form.elements.memo.value,
    description: form.elements.description.value,
    amount: form.elements.amount.value,
    remembers: form.elements.remembers.checked,
    rememberApiKey: form.elements.rememberApiKey.checked
  };
}
// ... rest of the JavaScript code

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
    responseElement.innerText = 'Please check your Login Key';
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


// Get the modal element
// Get the modal element
var modal = document.getElementById("myModal");

// Get the open modal button
var openModalBtn = document.getElementById("open-modal-btn");

// Get the element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Function to open the modal
function openModal() {
  modal.style.display = "block";
  openModalBtn.style.display = "none";

  // Add an event listener to the window object that listens for clicks
  window.addEventListener('click', closeModalOutside);
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
  openModalBtn.style.display = "block";

  // Remove the event listener from the window object
  window.removeEventListener('click', closeModalOutside);
}

// Function to close the modal when the user clicks outside of it
function closeModalOutside(event) {
  if (event.target === modal) {
    closeModal();
  }
}

// When the user clicks on the close button (x), close the modal
span.onclick = closeModal;

// Get the modal input element and the modal button element
const modalInput = document.getElementById('modal-input');
const modalButton = document.querySelector('.modal-button');

// Add a click event listener to the modal button
modalButton.addEventListener('click', () => {
  // Get the user's input from the modal input field
  const userInput = modalInput.value.trim();

  // Check if the user's input is empty or less than two digits
  if (userInput.length < 10) {
    // If the user's input is invalid, alert the user and return early
    alert('Invalid wallet id.');
    return;
  }

  // Construct the URL by concatenating the user's input with the base URL
  const url = `https://pay.zapit.live/wallet?${userInput}`;

  // Add the URL to the address bar and navigate to it
  window.location.href = url;
});






