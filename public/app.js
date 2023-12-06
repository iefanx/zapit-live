// Encapsulate code in an IIFE to limit scope
(function () {
  const form = document.getElementById("paywall-form");
  const apiKeyField = form.elements["api-key"];
  const walletIdField = form.elements["wallet-id"];

  // Auto-fill user API key and wallet ID if available
  autoFillField(apiKeyField, "apiKey", decrypt);
  autoFillField(walletIdField, "walletId", decrypt);

  form.addEventListener("submit", handleFormSubmit);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const {
      url,
      memo,
      description,
      amount,
      remembers,
      rememberApiKey,
      walletId,
    } = getFormData();
    const apiKey = apiKeyField.value;

    try {
      const data = await createPaywall({
        url,
        memo,
        description,
        amount,
        remembers,
        apiKey,
      });
      showPaywallLink(data);
      if (rememberApiKey) {
        saveApiKey(apiKey);
        if (walletId) {
          saveWalletId(walletId);
        }
      }
    } catch (error) {
      handleError(error);
    }
  }

  function autoFillField(field, storageKey, decryptFunction) {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      const decryptedValue = decryptFunction(storedValue);
      field.value = decryptedValue;
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
      walletId: form.elements["wallet-id"].value,
    };
  }

  async function createPaywall({
    url,
    memo,
    description,
    amount,
    remembers,
    apiKey,
  }) {
    const response = await fetch(
      "https://pay.zapit.live/paywall/api/v1/paywalls",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({ url, memo, description, amount, remembers }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create paywall. Status: ${response.status}`);
    }

    return response.json();
  }

  function showPaywallLink(data) {
    const paywallId = data.id;
    const responseElement = document.getElementById("response");
    if (typeof paywallId === "undefined") {
      responseElement.innerText =
        'Please check your Login Key by pressing "Login" button';
    } else {
      responseElement.innerHTML = `
        <button id="copyBtn">Copy Paywall link</button>
      `;
      const copyBtn = document.getElementById("copyBtn");
      copyBtn.addEventListener("click", () => {
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
    const tempElement = document.createElement("textarea");
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
  }

  function showCopiedMessage(button) {
    button.innerText = "Copied!";
    setTimeout(() => {
      button.innerText = "Copy Paywall Link";
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
    localStorage.setItem("apiKey", encryptedApiKey);
  }

  function saveWalletId(walletId) {
    const encryptedWalletId = encrypt(walletId);
    localStorage.setItem("walletId", encryptedWalletId);
  }

  const toggleButton = document.getElementById("toggleButton");
  const hiddenElements = document.getElementById("hiddenElements");

  toggleButton.addEventListener("click", () => {
    hiddenElements.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    if (
      !hiddenElements.contains(event.target) &&
      !toggleButton.contains(event.target) &&
      !hiddenElements.classList.contains("hidden")
    ) {
      hiddenElements.classList.add("hidden");
    }
  });

  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", handleDeleteClick);

  function handleDeleteClick() {
    deleteApiKey();
    deleteWalletId();
  }

  function deleteApiKey() {
    localStorage.removeItem("apiKey");
    apiKeyField.value = "";
  }

  function deleteWalletId() {
    localStorage.removeItem("walletId");
    walletIdField.value = "";
  }

  const openWalletBtn = document.getElementById("open-wallet-btn");
  openWalletBtn.addEventListener("click", handleOpenWalletClick);

  function handleOpenWalletClick() {
    const walletId = walletIdField.value;
    if (walletId) {
      const walletUrl = `${walletId}`; // Replace with the actual wallet URL format
      window.open(walletUrl, "_blank");
    } else {
      alert('Please enter a Wallet ID in "Login');
    }
  }

  const otherButton = document.getElementById("otherButton");
  otherButton.addEventListener("click", handleOtherButtonClick);

  function handleOtherButtonClick() {
    const walletIdField = document.getElementById("wallet-id");
    const walletId = walletIdField.value;
    if (walletId) {
      const modifiedWalletId = walletId.replace("wallet", "market");
      const walletUrl = `${modifiedWalletId}`; // Replace with the actual wallet URL format for the other button
      window.open(walletUrl, "_blank");
    } else {
      alert('Please enter a Wallet ID in "Login');
    }
  }

  const opensplit = document.getElementById("opensplit");
  opensplit.addEventListener("click", handleOpenSplitClick);

  function handleOpenSplitClick() {
    const walletIdField = document.getElementById("wallet-id");
    const walletId = walletIdField.value;
    if (walletId) {
      const modifiedWalletId = walletId.replace("wallet", "splitpayments");
      const walletUrl = `${modifiedWalletId}`; // Replace with the actual wallet URL format for the other button
      window.open(walletUrl, "_blank");
    } else {
      alert('Please enter a Wallet ID in "Login');
    }
  }

  // Detect when the PWA is installed and update the UI
  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
    console.log("PWA installed successfully.");
  });

  const createLinkBtn = document.getElementById("createLinkBtn");
  const newButton = document.getElementById("newButton");
  const modal = document.getElementById("myModal");
  const newModal = document.getElementById("newModal");
  const closeModal = document.querySelectorAll(".close");

  function closeModalFunction(targetModal) {
    targetModal.style.display = "none";
  }

  function setupModal(modalBtn, modal) {
    modalBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });

    closeModal.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modalParent = btn.closest(".modal");
        if (modalParent) {
          closeModalFunction(modalParent);
        }
      });
    });

    [modal, newModal].forEach((targetModal) => {
      targetModal.addEventListener("click", (event) => {
        if (event.target === targetModal) {
          closeModalFunction(targetModal);
        }
      });
    });
  }

  setupModal(createLinkBtn, modal);
  setupModal(newButton, newModal);
})();
