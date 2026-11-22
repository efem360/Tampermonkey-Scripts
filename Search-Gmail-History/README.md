 <div align="center">

# ✦ efem360 Gmail History Search

### One-Click Search for Complete Gmail Conversations

**A lightweight, feature-rich Tampermonkey userscript that makes searching Gmail conversation history faster and easier.**

Find every email associated with an email address directly from Gmail. Instantly search incoming messages, outgoing messages, or all conversations with a single click — without manually copying email addresses or typing search queries.

Whether you are viewing an email conversation, checking sender information, or working with email addresses in Gmail, the script adds a convenient search shortcut directly next to recognized email addresses.

<br>

[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-4.2.1-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Search-Gmail-History/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)

<br>

[⚡ Install with One Click](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js) · [GitHub Repository](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History) · [Issue Tracker](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History/issues)

<br>

**Find Every Conversation. One Click Away.**

</div>

---

## Overview

**efem360 Gmail History Search** is a lightweight browser userscript designed to simplify searching Gmail conversations associated with specific email addresses.

Gmail already provides powerful search capabilities, but manually searching for an email address can become repetitive, especially when working with long conversations or multiple contacts.

This userscript adds a small Gmail-style search icon next to recognized email addresses.

With this icon, users can instantly search for:

- All emails associated with an address.
- Messages received from an address.
- Messages sent to an address.
- Conversations in a separate browser tab.

It also provides convenient options for copying email addresses and accessing search actions through a context menu.

The script works automatically in the background and integrates directly into Gmail's existing interface.

### Key Highlights

- **One-Click Email Search:** Search all conversations associated with an email address.
- **Incoming Email Search:** Find messages received from a specific address.
- **Outgoing Email Search:** Find messages sent to a specific address.
- **New Tab Search:** Open email searches in a separate browser tab.
- **Context Menu:** Access additional search and clipboard options with a right-click.
- **Quick Email Copying:** Copy email addresses without manually selecting text.
- **Keyboard Accessibility:** Activate the search icon using Enter or Space.
- **Dynamic Content Detection:** Automatically detects newly inserted email addresses.
- **MutationObserver Technology:** Monitors relevant Gmail DOM changes.
- **Duplicate Prevention:** Avoids inserting multiple search icons for the same email element.
- **Lightweight Architecture:** Uses filtered DOM observation and scheduled scanning.
- **Native Gmail Integration:** Adds compact search icons without introducing a separate application interface.

---

## 📌 About the Project

The primary purpose of this project is to make Gmail email history searches more accessible and efficient.

When communicating with multiple people, finding all previous correspondence with a particular sender or recipient often requires manually copying their email address and entering it into Gmail's search field.

This userscript eliminates those repetitive steps.

Once installed, a small clickable search icon appears next to recognized email addresses.

### How It Works

For example, when viewing an email conversation, Gmail displays the sender's email information.

The script detects the email address and inserts a search icon directly before the corresponding element.

<details>
<summary><strong>Search Icon Interaction</strong></summary>

| Action | Result |
|---|---|
| Left Click | Search all emails |
| Ctrl + Left Click | Search in a new tab |
| Cmd + Left Click | Search in a new tab (macOS) |
| Right Click | Open search options |
| Enter | Search all emails |
| Space | Search all emails |

</details>

### Main Objectives

- Reduce the time required to search email conversations.
- Provide instant access to incoming and outgoing email searches.
- Eliminate repetitive manual email address copying.
- Keep search functionality accessible directly within Gmail.
- Support dynamically loaded email content.
- Preserve Gmail's existing interface and normal navigation.
- Prevent duplicate search icons.
- Minimize unnecessary DOM processing.
- Provide convenient keyboard and mouse interactions.

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

**[Install efem360 Gmail History Search](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js)**

Tampermonkey will automatically open the userscript installation screen.

Click **Install** to complete the installation.

### 3. Getting Started

After installation:

1. Open Gmail.
2. Refresh the page.
3. Open an email conversation or navigate to an area containing recognized email addresses.
4. Look for the small search icon next to email addresses.
5. Click the icon to search the associated email history.

No additional configuration or manual activation is necessary.

---

## ✨ Features

### 1. One-Click Email History Search

The primary feature allows users to search all Gmail conversations associated with a specific email address.

When the search icon is clicked, the script automatically:

1. Identifies the associated email address.
2. Locates Gmail's search input.
3. Inserts the email address into the search field.
4. Dispatches the appropriate input event.
5. Triggers the search using an Enter keyboard event.

**Example Gmail Search Query:**

```text
example@gmail.com
```

This searches Gmail for messages associated with the specified email address.

The script also prevents unnecessarily repeating an identical search when the same query is already active.

### 2. Incoming Email Search

Users can search only messages received from a particular email address.

The context menu provides a dedicated incoming email search option.

**Generated Gmail Search Query:**

```text
from:example@gmail.com
```

This uses Gmail's native `from:` search operator.

It is particularly useful when looking for messages sent by a specific person.

### 3. Outgoing Email Search

Users can search only messages sent to a particular email address.

**Generated Gmail Search Query:**

```text
to:example@gmail.com
```

This uses Gmail's native `to:` search operator.

It helps locate messages previously sent to a particular recipient.

### 4. Search in a New Tab

The userscript supports opening email searches in a separate browser tab.

There are two ways to use this functionality:

- Ctrl + Left Click on the search icon.
- Right-click the icon and select the new-tab search option.

On macOS, Cmd + Left Click is also supported.

The script identifies the currently selected Gmail account number from the page URL.

If the account number cannot be identified, it uses account `0`.

**Example URL:**

```text
https://mail.google.com/mail/u/0/#search/example%40gmail.com
```

This allows users to continue working in their current Gmail tab while the search opens separately.

**Important:** The browser may block the new tab if its popup protection prevents it from opening.

### 5. Right-Click Context Menu

The search icon includes an additional context menu that provides access to five different actions.

Right-click the icon to display the available options.

**Available Options:**

| Option | Action |
|---|---|
| 1 | Search all emails |
| 2 | Search incoming emails |
| 3 | Search outgoing emails |
| 4 | Search in a new tab |
| 5 | Copy email address |

The menu displays the associated email address and allows users to select an action through a simple prompt dialog.

This provides access to all major functions without requiring separate interface buttons.

### 6. Email Address Copying

The script includes a dedicated email copying function.

Users can copy an email address directly through the right-click context menu.

The copying mechanism supports two methods:

**Primary Method:**

Uses the modern Clipboard API:

```javascript
navigator.clipboard.writeText(email)
```

**Fallback Method:**

If the Clipboard API is unavailable or copying fails, the script attempts to use:

```javascript
document.execCommand('copy')
```

This fallback improves compatibility with environments where the modern clipboard functionality cannot be used.

A notification informs the user whether the operation was successful.

### 7. Automatic Email Detection

The script automatically identifies email addresses in Gmail.

It currently processes two main types of elements:

**Gmail Sender Elements:**

```css
.gD
```

**Email Links:**

```css
a[href^="mailto:"]
```

For Gmail sender elements, the email address is obtained from the `email` attribute.

For mailto links, the script extracts the address from the `href` attribute.

The script also validates the extracted address before creating a search icon.

Addresses without a valid `@` character are ignored.

### 8. Dynamic Content Detection

Gmail uses a dynamic interface that loads and updates content without necessarily refreshing the entire page.

The userscript uses JavaScript's `MutationObserver` API to detect relevant changes.

This allows it to recognize:

- Newly loaded email conversations.
- Newly inserted sender elements.
- Dynamically added mailto links.
- Changes to relevant email attributes.
- Updated email-related DOM elements.

The script does not depend on a permanent polling interval.

Instead, it schedules a new scan only when relevant DOM changes are detected.

### 9. Duplicate Icon Prevention

The userscript includes a dedicated duplicate detection mechanism.

Before inserting a new search icon, it checks whether an appropriate icon already exists.

The detection process examines:

- The previous sibling element.
- Other child elements within the same parent.
- The associated email address stored in the icon's `data-email` attribute.

This helps prevent unnecessary duplicate icons when Gmail updates or re-renders existing content.

### 10. Smart DOM Monitoring

Not every Gmail DOM change requires another complete scan.

The userscript filters observed mutations and schedules processing only when relevant email elements are detected.

The scanning mechanism uses an 80-millisecond scheduled delay to consolidate multiple DOM changes.

This reduces unnecessary repeated processing during rapid interface updates.

### 11. Browser Tab Visibility Management

The userscript also considers whether the Gmail tab is currently visible.

When the browser tab becomes hidden:

- The active MutationObserver is disconnected.
- Pending scheduled scans are cleared.

When the tab becomes visible again:

- DOM observation is restarted.
- A new scan is scheduled.

This approach helps avoid unnecessary DOM monitoring while Gmail is in a background tab.

### 12. Gmail Navigation Detection

Gmail uses client-side navigation, which means that different pages and conversations can load without a complete browser refresh.

The script listens for two navigation events:

```javascript
popstate
```

```javascript
hashchange
```

When either event occurs, the userscript schedules another scan.

This helps maintain search icon availability while navigating between Gmail conversations and search results.

### 13. Keyboard Accessibility

The search icon is designed to be accessible through keyboard navigation.

It includes the following attributes:

```html
tabindex="0"
role="button"
```

The script also listens for keyboard events.

| Key | Action |
|---|---|
| Enter | Search all emails |
| Space | Search all emails |

This makes the search functionality accessible without requiring mouse interaction.

### 14. Gmail-Style Visual Integration

The search icon uses a compact SVG envelope symbol.

Its appearance is designed to fit naturally into Gmail's existing interface.

Visual characteristics include:

- Compact 18 × 18 pixel SVG icon.
- Neutral Gmail-style gray appearance.
- Blue hover effect.
- Smooth hover transition.
- Keyboard focus indicator.
- Inline positioning next to email addresses.

The icon does not introduce a separate toolbar, sidebar, or application panel.

### 15. Notification System

The userscript includes a lightweight notification mechanism to provide feedback after important actions.

Notifications are used for:

- Starting an email search.
- Opening a search in a new tab.
- Successfully copying an email address.
- Reporting clipboard errors.
- Reporting missing Gmail search input.
- Reporting blocked new-tab operations.

Notifications appear in the bottom-right corner of the browser window.

They automatically disappear after approximately two seconds.

---

## ⚙️ Technical Architecture

### Runtime Environment

The project is written in JavaScript and runs directly inside supported Google services through Tampermonkey.

The userscript is designed to work with Gmail's dynamic document structure.

### Technologies Used

| Technology | Purpose |
|---|---|
| JavaScript | Core functionality and application logic |
| Tampermonkey | Userscript installation and execution |
| DOM API | Accessing and modifying Gmail elements |
| MutationObserver | Detecting dynamic DOM changes |
| SVG | Rendering the email search icon |
| Clipboard API | Copying email addresses |
| KeyboardEvent | Triggering Gmail searches |
| Regular Expressions | Extracting Gmail account information |
| CSS | Styling search icons and notifications |
| setTimeout | Scheduling DOM scans and temporary notifications |
| Browser Events | Detecting navigation and tab visibility changes |

### Userscript Configuration

The script runs using:

```javascript
// @run-at       document-idle
```

This allows the browser document to become available before the initial execution begins.

The script supports the following URL patterns:

```javascript
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/*
// @match        *://gmail.com/*
```

It also excludes:

```javascript
// @exclude      *://mail.google.com/mail/*/blank
// @exclude      *://mail.google.com/mail/*/help
```

### DOM Monitoring

The script uses `MutationObserver` to monitor relevant document changes.

Its observer configuration is:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
        'email',
        'href',
        'contenteditable'
    ]
});
```

This configuration allows the userscript to detect newly inserted elements and changes to attributes relevant to email identification.

### Mutation Filtering

The script does not automatically scan the entire document after every mutation.

Instead, it checks whether the changes involve relevant email elements.

The detection targets are:

```css
.gD
a[href^="mailto:"]
```

Only relevant changes trigger a scheduled scan.

### DOM Scanning Strategy

The scanning process follows these steps:

1. Check whether the userscript is active.
2. Check whether the browser tab is visible.
3. Locate Gmail sender elements.
4. Check whether a search icon already exists.
5. Extract and validate the email address.
6. Create the search icon.
7. Insert the icon before the corresponding element.
8. Locate mailto links.
9. Exclude links inside editable content areas.
10. Extract and validate mailto addresses.
11. Insert the corresponding search icons.

### Scan Scheduling

The script uses a scheduled scan mechanism:

```javascript
setTimeout(function () {
    scanTimeout = null;
    insertEmailSearchIcons();
}, 80);
```

If another relevant mutation occurs before the scheduled scan executes, the previous timeout is cleared and rescheduled.

This prevents multiple unnecessary scans from being executed in rapid succession.

### Search Processing

The search mechanism uses Gmail's existing search input:

```javascript
document.querySelector('input[name="q"]')
```

After identifying the search field, the script updates its value and dispatches an input event.

It then triggers a keyboard event representing the Enter key.

This allows the script to use Gmail's native search functionality rather than implementing a separate email search engine.

### Email Search Operators

The userscript supports three search modes:

| Search Mode | Gmail Query |
|---|---|
| All | `email@example.com` |
| Incoming | `from:email@example.com` |
| Outgoing | `to:email@example.com` |

### Duplicate Detection

Before inserting a search icon, the script checks the existing DOM structure.

The icon uses the following class:

```css
.email_search_icon
```

The associated email address is also stored using:

```html
data-email="email@example.com"
```

This provides a reference for identifying previously inserted icons.

### Execution Management

The script maintains internal execution state through:

```javascript
let isSearching = false;
let observer = null;
let scanTimeout = null;
let isActive = false;
```

These variables help manage search execution, DOM observation, scheduled scans, and script activation.

---

## 🔄 Update System

The project uses a single userscript file for installation and automatic update checks.

**Update URL:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

**Download URL:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

The userscript contains the following update metadata:

```javascript
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Search-Gmail-History/Search-Gmail-History.js
```

When a new version is released:

1. The userscript source is updated.
2. The version number in the metadata is incremented.
3. Tampermonkey can detect the newer version.
4. Users can install the update through Tampermonkey.

**Current Version:**

```javascript
// @version      4.2.1
```

For the latest source code and project updates:

[GitHub Repository](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)

---

## 🔐 Privacy and Security

Privacy is an important consideration in this project.

**efem360 Gmail History Search** is designed to perform its email address detection and search preparation locally within the user's browser.

### Privacy Principles

- No user account system.
- No registration required.
- No analytics or tracking system implemented by the userscript.
- No external API integration.
- No remote database.
- No independent email collection service.
- No transmission of extracted email addresses to a third-party server by the userscript.
- No separate background service.

### Data Processing

The script reads email addresses from existing Gmail DOM elements.

These addresses are used to construct Gmail search queries when the user activates the search functionality.

The script does not need to read email message bodies or attachments to perform its intended search operations.

### Clipboard Access

Email copying is initiated by the user's explicit selection of the copy option.

The script uses the browser Clipboard API when available and attempts a legacy fallback if necessary.

### External Communication

The userscript does not implement an external email search API.

Search operations are performed through Gmail's existing interface.

Gmail itself handles the resulting search request.

### Permissions

The userscript metadata includes:

```javascript
// @grant        GM_addStyle
```

The current implementation creates its styles through the native DOM API rather than calling the Tampermonkey `GM_addStyle` function.

---

## ⚠️ Compatibility and Limitations

The script is primarily designed for Gmail's web interface and its current DOM structure.

### Supported Environment

- Gmail Web.
- Tampermonkey-compatible browsers.
- Gmail sender elements using the `.gD` selector.
- Email links using the `mailto:` protocol.
- Dynamically loaded Gmail content.
- Gmail interfaces supporting the native search input structure.

### Additional URL Matching

The userscript also includes matching rules for:

- `contacts.google.com`
- `gmail.com`

The script includes a message listener for messages originating from `https://contacts.google.com` that contain a valid `searchForEmail=` value.

### Limitations

- Gmail interface updates may change the DOM structure.
- Changes to Gmail's search input may require compatibility updates.
- Email elements that do not match the recognized selectors will not receive search icons.
- Some browser configurations may restrict clipboard access.
- Popup blockers may prevent searches from opening in a new tab.
- The script depends on Gmail's native search functionality.
- The userscript does not independently retrieve or archive email messages.
- Search results remain subject to the permissions and account currently active in Gmail.

The script modifies the browser's displayed interface and search input. It does not modify stored Gmail messages or their original content.

---

## 📋 Version History

| Version | Changes |
|---|---|
| 4.2.1 | Current implementation with one-click email history search, incoming/outgoing search modes, new-tab search, context menu, clipboard support, keyboard accessibility, duplicate prevention, and filtered MutationObserver monitoring |

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

If you encounter an issue:

1. Check whether the problem is reproducible.
2. Include your browser name and version.
3. Include your Tampermonkey version.
4. Describe where the email address appears in Gmail.
5. Explain whether the search icon is missing or the search operation fails.
6. Provide the expected behavior.
7. Open a GitHub Issue.

Contributions that improve compatibility, performance, accessibility, and reliability are welcome.

**GitHub Issues:**

https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History/issues

---

# 📄 License

This project is released under the **GNU General Public License v3.0 (GPL-3.0)**.

The GNU GPL-3.0 permits the use, study, modification, and distribution of the software, provided that the applicable license terms are respected.

Derivative works distributed under this license must comply with its applicable source code distribution and licensing requirements.

See the `LICENSE` file in the project repository for details.

---

<div align="center">

## ✦ efem360

**Small Improvements. Better Experiences.**

Developed by **Kemal Kalender**

[GitHub](https://github.com/efem360) · [Gmail History Search](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Search-Gmail-History)

<br>

*Making everyday browser experiences simpler, cleaner, and more efficient.*

</div>
