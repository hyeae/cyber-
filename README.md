# 📞 Spam Call Detector

A simple web-based Spam Call Detector built using HTML, CSS, and JavaScript. The application allows users to check whether a phone number is likely spam, view caller details, report numbers, and maintain a history of recent checks.

## 🚀 Features

- Check if a phone number is spam
- Caller location detection using area codes
- Community-based spam reporting
- Report numbers as Spam or Legitimate
- Local storage for recent checks
- Responsive design for desktop and mobile
- Detailed caller information panel

## 📂 Project Structure

```
Spam-Call-Detector/
│
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # Application logic
└── README.md       # Documentation
```

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Local Storage API

## 📋 How It Works

1. Enter a phone number.
2. Click **Check**.
3. The application:
   - Checks the spam database.
   - Detects suspicious patterns.
   - Verifies area code reputation.
   - Reviews community reports.
4. Displays whether the number is:
   - ✅ Legitimate
   - ⚠️ Potential Spam

## 🔍 Spam Detection Rules

The detector identifies spam numbers based on:

- Known spam database matches
- Repeated digit patterns
- Toll-free numbers
- Premium-rate numbers
- Suspiciously short numbers
- Community spam reports

## 📱 Responsive Design

The interface adapts automatically for:

- Desktop


## 🚀 Running the Project

### Option 1: Open Directly

Simply open `index.html` in your browser.

### Option 2: VS Code Live Server

1. Install **Live Server** extension.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

## 📈 Future Improvements

- Real API integration
- Caller ID lookup
- User authentication
- Cloud database support
- AI-based spam prediction
- International phone number support

