# Zapit Dashboard

## A simple web application to create and manage paywalls using the Zapit Paywall API. This app allows users to generate paywall links that can be shared to request payments. Users can manage their paywalls and track the status of each paywall.

## Features

Create paywalls with custom memo, description, and amount

Auto-fill API key from localStorage if available

Remember API key option

Encrypt and decrypt API key for secure storage

Copy paywall link to clipboard

Error handling for invalid API key or user input

Wallet ID input modal with validation

## Getting Started

### Prerequisites

A modern web browser that supports ES6 and Fetch API

A valid Zapit Paywall API key

## Usage

Clone this repository or download the source code as a ZIP file and extract it.

Open the index.html file in your web browser.

Enter your Zapit Paywall API key and select whether to remember it for future use. If remembered, the API key will be encrypted and stored in your browser's localStorage.

Fill in the paywall details: URL, memo, description, and amount.

Click the "Create Paywall" button to generate the paywall link.

If successful, a "Copy Paywall Link" button will appear. Click this button to copy the paywall link to your clipboard. Share this link with users to request payments.

To input a wallet ID and navigate to the wallet page, click the "Open Modal" button and enter the wallet ID in the modal input field. Click the "Go to Wallet" button to navigate to the wallet page.

## Contributing

If you would like to contribute to this project, please fork this repository, create a new branch, and submit a pull request with your changes.

## License

This project is licensed under the MIT License. 
