
<div align="center">

# ✦ efem360 Gmail DateTime Formatter

### Automatic Date & Time Formatting for Gmail

**A lightweight, multilingual Tampermonkey userscript that standardizes Gmail date and time displays.**

Transform Gmail's localized date formats into a consistent, clean, and readable format — automatically, without changing Gmail's interface or disrupting its normal functionality.

Whether Gmail is displayed in Turkish, English, German, French, or another supported language, the script aims to provide a unified date and time presentation.

<br>

[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-2.4.0-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Gmail-DateTime-Formatter/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)

<br>

[⚡ Install with One Click](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js) · [GitHub Repository](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter) · [Release History](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)

<br>

**One Format. Every Inbox. Less Clutter.**

</div>

---

## Overview

**efem360 Gmail DateTime Formatter** is a lightweight browser userscript designed to improve how dates and times are displayed in Gmail.

Gmail uses localized date formats depending on the user's language settings. This can result in different date representations across accounts and interfaces.

This userscript standardizes supported date formats into a consistent format:

<box></box>

```text
DD.MM.YY HH:MM
```

**Example:**

```text
17.04.26 18:49
```

Instead of displaying different localized date formats, the script provides a uniform presentation directly within Gmail.

It works automatically in the background and requires no additional configuration.

### Key Highlights

- **Universal Date Presentation:** Standardizes supported localized date formats.
- **Multilingual Month Recognition:** Recognizes month abbreviations from multiple languages.
- **Automatic Time Display:** Includes the time alongside the date.
- **Dynamic Content Detection:** Detects newly loaded Gmail content.
- **MutationObserver Technology:** Monitors relevant DOM changes without continuous polling.
- **Lightweight Architecture:** Designed to minimize unnecessary browser operations.
- **Native Gmail Integration:** Modifies existing date displays without introducing additional interface elements.
- **No Configuration Required:** Works automatically after installation.

---

## 📌 About the Project

The primary purpose of this project is to make Gmail's date and time information more consistent and easier to read.

Gmail may display dates differently depending on the interface language, regional settings, and the context in which a message appears.

For example:

| Gmail Language | Localized Date | Formatted Output |
|---|---|---|
| Turkish | `17 Nis 2026 Cum 18:49` | `17.04.26 18:49` |
| English | `17 Apr 2026 Fri 18:49` | `17.04.26 18:49` |
| German | `17 Mär 2026 Di 18:49` | `17.03.26 18:49` |
| French | `17 avr 2026 ven 18:49` | `17.04.26 18:49` |

The resulting format remains consistent regardless of the recognized source language.

### Main Objectives

- Provide a consistent date and time format.
- Reduce visual inconsistencies between different Gmail language settings.
- Display the time without requiring users to open individual messages.
- Automatically process dynamically loaded email content.
- Maintain Gmail's original interface and layout.
- Keep resource consumption as low as reasonably possible.

---

## 🚀 Installation

### Requirements

The following are required:

- A supported desktop browser.
- The Tampermonkey browser extension.
- An active Gmail account.

### 1. Install Tampermonkey

Install the Tampermonkey extension for your browser.

**Official Website:**

https://www.tampermonkey.net/

### 2. Install the Userscript

Open the following installation link:

**[Install efem360 Gmail DateTime Formatter](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js)**

Tampermonkey will open the userscript installation screen.

Click **Install** to complete the installation.

### 3. Getting Started

After installation:

1. Open Gmail.
2. Refresh the page.
3. Navigate through your inbox or open an email conversation.
4. The script automatically formats recognized dates.

No additional settings or manual activation are necessary.

---

## ✨ Features

### 1. Standardized Date & Time Format

The script converts recognized Gmail date information into a consistent format.

**Standard output:**

```text
DD.MM.YY HH:MM
```

**Examples:**

| Original Date | Formatted Date |
|---|---|
| `17 Nis 2026 Cum 18:49` | `17.04.26 18:49` |
| `05 Oca 2026 Pzt 09:15` | `05.01.26 09:15` |
| `22 Kas 2026 Paz 14:30` | `22.11.26 14:30` |

The format uses:

- Two-digit day.
- Two-digit month.
- Two-digit year.
- 24-hour time representation.

### 2. Multilingual Month Recognition

Gmail's displayed date information may contain month abbreviations from different languages.

The script includes a multilingual month recognition system.

Supported month abbreviations include:

| Language | Examples |
|---|---|
| Turkish | Oca, Şub, Mar, Nis, May |
| English | Jan, Feb, Mar, Apr, May |
| German | Jan, Feb, Mär, Apr, Mai |
| French | Janv, Févr, Mars, Avr, Mai |
| Spanish | Ene, Feb, Mar, Abr, May |
| Italian | Gen, Feb, Mar, Apr, Mag |
| Portuguese | Jan, Fev, Mar, Abr, Mai |

Additional month abbreviations are included in the source code.

**Important:** Language support depends on the date structure and month abbreviations returned by Gmail. Not every regional variation is guaranteed to be recognized.

### 3. Automatic Dynamic Content Detection

Gmail uses a dynamic interface that loads and updates content without necessarily refreshing the entire page.

The script uses JavaScript's `MutationObserver` API to monitor relevant changes.

This allows it to detect:

- Newly loaded emails.
- Updated date elements.
- Dynamically inserted message content.
- Changes to relevant date attributes.

There is no continuous two-second polling loop.

### 4. Lightweight DOM Processing

The script processes existing date elements and monitors newly added content.

Its architecture is designed to avoid unnecessary repeated operations.

Key characteristics:

- No permanent polling interval.
- No additional interface panels.
- No unnecessary external libraries.
- No additional user configuration.
- No separate background service.

### 5. Native Gmail Appearance

The script modifies existing Gmail date elements rather than creating a separate date display.

The original interface is preserved as much as possible.

The formatted date is displayed:

- In the existing date location.
- On a single line.
- With a compact font size.
- Without introducing additional interface components.

---

## ⚙️ Technical Architecture

### Runtime Environment

The project is written in JavaScript and runs directly inside Gmail through Tampermonkey.

### Technologies Used

| Technology | Purpose |
|---|---|
| JavaScript | Date processing and DOM manipulation |
| MutationObserver | Dynamic content detection |
| DOM API | Accessing and updating Gmail elements |
| Regular Expressions | Parsing localized date strings |
| Tampermonkey | Userscript execution and management |

### Execution Strategy

The userscript runs using:

```javascript
// @run-at document-idle
```

This allows the initial page structure to become available before the script begins processing.

### DOM Monitoring

The script monitors the following changes:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['title', 'aria-label']
});
```

This configuration allows the script to detect relevant changes within Gmail's document structure.

### Date Processing

The date conversion process consists of the following steps:

1. Locate Gmail date elements.
2. Read the full date from the `title` attribute.
3. Extract the day, month, year, weekday, and time.
4. Identify the month abbreviation.
5. Convert the month into its numerical representation.
6. Generate the standardized date string.
7. Update the existing date element.

### Target Elements

The script identifies Gmail date elements using:

```css
span[title][aria-label]
```

The formatted result is applied to the first direct child span.

---

## 🔄 Update System

The project uses a single userscript file for installation and updates.

**Update URL:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Gmail-DateTime-Formatter/Gmail-DateTime-Formatter.js
```

When a new version is released, the existing userscript file is updated.

The version number in the userscript header is also updated accordingly.

Example:

```javascript
// @version      2.4.0
```

Tampermonkey can use the userscript update information to check for newer versions.

For release information:

[GitHub Releases](https://github.com/efem360/Gmail-DateTime-Formatter/releases)

---

## 🔐 Privacy and Security

Privacy is an important consideration in this project.

**efem360 Gmail DateTime Formatter** operates locally within the user's browser.

### Privacy Principles

- No user account system.
- No registration required.
- No analytics or tracking system.
- No external API requests.
- No remote database.
- No collection of email content.
- No transmission of email information to third-party servers.

### Data Processing

The script reads date information from existing Gmail DOM elements and modifies their displayed text.

It does not need to access email bodies, attachments, contacts, or message contents to perform its intended function.

All date formatting operations are performed locally in the browser.

### Permissions

The userscript does not require additional Tampermonkey API permissions.

```javascript
// @grant        none
```

---

## ⚠️ Compatibility and Limitations

The script is designed specifically for Gmail's web interface.

### Supported Environment

- Gmail Web.
- Tampermonkey-compatible browsers.
- Gmail interfaces using recognized date structures.
- Supported localized month abbreviations.

### Limitations

- Gmail interface updates may change the DOM structure.
- Unrecognized month abbreviations will not be converted.
- Date formats with a different element structure may require additional handling.
- Some localized date formats may require further compatibility improvements.

The script does not modify Gmail's stored message dates or timestamps. It only changes how recognized dates are displayed in the browser.

---

## 📋 Version History

| Version | Changes |
|---|---|
| 2.4.0 | Multilingual month recognition and standardized date formatting |
| 2.3.0 | MutationObserver integration and removal of continuous polling |
| 2.2.0 | Initial date and time formatting implementation |

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

If you encounter an issue:

1. Check whether the problem is reproducible.
2. Include your Gmail interface language.
3. Provide an example of the original date format.
4. Describe the expected output.
5. Open a GitHub Issue.

Contributions that improve language compatibility, performance, and reliability are welcome.

---

## 📜 License

This project is distributed under the **MIT License**.

You are free to use, modify, and distribute the software in accordance with the license terms.

See the [LICENSE](LICENSE) file for details.

---

<div align="center">

## ✦ efem360

**Small Improvements. Better Experiences.**

Developed by **Kemal Kalender**

[GitHub](https://github.com/efem360) · [Gmail DateTime Formatter](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Gmail-DateTime-Formatter)

<br>

*Making everyday browser experiences simpler, cleaner, and more efficient.*

</div>
