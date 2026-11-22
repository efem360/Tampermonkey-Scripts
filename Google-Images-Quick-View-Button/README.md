 <div align="center">

# ✦ efem360 Google Images Quick Viewer

### One-Click Access to Original Google Images

**A lightweight Tampermonkey userscript that adds quick-view buttons to Google Images, allowing users to open original images directly with a single click.**

Finding and opening original images from Google Images can involve several unnecessary steps. This userscript simplifies the process by adding a compact camera button directly to recognized image containers.

Press **F1** to scan the available image results and add quick-view buttons. Once added, simply click the 📷 button to open the original image in a separate browser tab.

The script also monitors dynamically loaded content and automatically processes newly inserted image results.

Whether you are collecting visual references, examining image sources, or opening original images, the script provides a convenient shortcut directly within Google Images.

<br>

[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-1.1-2563EB?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com/efem360/Tampermonkey-Scripts/blob/main/Google-Images-Quick-View-Button/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Google%20Images-EA4335?style=for-the-badge&logo=google&logoColor=white)](https://images.google.com/)

<br>

[⚡ Install with One Click](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js) · [GitHub Repository](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button) · [Issue Tracker](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button/issues)

<br>

**Open Original Images. One Click Away.**

</div>

---

## Overview

**efem360 Google Images Quick Viewer** is a lightweight browser userscript designed to simplify opening original images directly from Google Images.

Google Images provides access to millions of images, but opening an image's original source can require several additional clicks.

This userscript simplifies that process by adding a small camera button to recognized image containers.

With this button, users can:

- Open the original image directly.
- Access image URLs without manually navigating through Google's image preview.
- Open images in a separate browser tab.
- Process existing image results with the F1 keyboard shortcut.
- Automatically process newly inserted image results.

The script integrates directly into Google Images without introducing a separate application interface.

### Key Highlights

- **Quick Image Access:** Open original images with a single click.
- **F1 Keyboard Shortcut:** Scan available image results and insert quick-view buttons.
- **Direct Image Opening:** Open the original image URL instead of Google's preview page.
- **Dynamic Content Detection:** Automatically detects newly inserted image results.
- **MutationObserver Technology:** Monitors DOM changes to recognize dynamically loaded content.
- **Duplicate Prevention:** Avoids processing the same link repeatedly.
- **URL Validation:** Checks extracted image URLs before creating buttons.
- **Modern URL Parsing:** Uses the native URL API and URLSearchParams.
- **Lightweight Architecture:** Uses native JavaScript and DOM APIs without external libraries.
- **Minimal Interface:** Adds compact camera buttons directly to image containers.
- **Visual Feedback:** Includes hover effects and a temporary F1 instruction message.
- **No Additional Permissions:** Runs with `@grant none`.

---

## 📌 About the Project

The primary purpose of this project is to make accessing original images from Google Images faster and easier.

When browsing image search results, users often need to open an image preview, locate its source, and then navigate to the original image.

This userscript reduces those steps.

Once activated, a small camera button appears on recognized image containers.

Clicking the button opens the extracted original image URL in a new browser tab.

### How It Works

Google Images stores image-related information in the links associated with its search results.

The userscript identifies links containing the `imgurl` parameter and extracts the associated image URL.

After validating the URL, it creates a camera button and inserts it into the corresponding image container.

<details>
<summary><strong>Quick View Button Interaction</strong></summary>

| Action | Result |
|---|---|
| F1 | Scan available image results and add buttons |
| Left Click on 📷 | Open the original image in a new tab |
| Hover over 📷 | Display the hover effect |
| Click the information message | Dismiss the information message |

</details>

### Main Objectives

- Reduce the number of steps required to open original images.
- Provide direct access to image source URLs.
- Add convenient image-opening shortcuts.
- Keep image access available directly within Google Images.
- Support dynamically inserted image results.
- Prevent duplicate button insertion.
- Validate image URLs before opening them.
- Minimize unnecessary DOM processing.
- Preserve the existing Google Images interface.
- Keep the userscript lightweight and easy to maintain.

---

## 🚀 Installation

### Requirements

The following are required:

- A supported desktop browser.
- The Tampermonkey browser extension.
- Access to Google Images.

### 1. Install Tampermonkey

Install the Tampermonkey extension for your browser.

**Official Website:**

https://www.tampermonkey.net/

### 2. Install the Userscript

Open the following installation link:

**[Install efem360 Google Images Quick Viewer](https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js)**

Tampermonkey will automatically open the userscript installation screen.

Click **Install** to complete the installation.

### 3. Getting Started

After installation:

1. Open Google Images.
2. Perform an image search.
3. Press **F1** to scan the available image results.
4. Look for the camera buttons on recognized image containers.
5. Click the 📷 button to open the original image.

Newly inserted image results are also monitored automatically by the script.

No additional configuration is required.

---

## ✨ Features

### 1. One-Click Original Image Access

The primary feature allows users to open original images directly from Google Images.

When the camera button is clicked, the script:

1. Identifies the associated image link.
2. Extracts the `imgurl` parameter.
3. Validates the extracted URL.
4. Opens the original image in a separate browser tab.

The script uses:

```javascript
window.open(imageUrl, '_blank', 'noopener,noreferrer');
```

This allows users to access the original image without manually navigating through Google's image preview interface.

### 2. F1 Keyboard Shortcut

The userscript provides a dedicated keyboard shortcut for activating image scanning.

**F1** triggers the `addButtons()` function.

When activated, the script:

- Locates image links containing `imgurl=`.
- Checks whether the links have already been processed.
- Extracts the original image URLs.
- Validates the extracted URLs.
- Locates the associated image containers.
- Creates and inserts camera buttons.

The keyboard shortcut also prevents the browser's default F1 help action.

**Keyboard Event:**

```javascript
document.addEventListener('keydown', event => {
    if (
        event.key !== 'F1' ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
    ) {
        return;
    }

    event.preventDefault();

    const added = addButtons();

    showInfo();
});
```

### 3. Automatic Dynamic Content Detection

Google Images uses a dynamic interface that can insert additional image results without refreshing the entire page.

The userscript uses JavaScript's native `MutationObserver` API to detect these changes.

When new content is inserted, the observer checks for image links containing the `imgurl` parameter.

Newly recognized image links are processed automatically.

This means users do not necessarily need to press F1 again whenever Google Images loads additional results.

### 4. MutationObserver Technology

The script uses `MutationObserver` to monitor changes within the document.

Its observer configuration is:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

This configuration monitors:

- Newly inserted elements.
- Newly inserted image links.
- Dynamically loaded image results.
- DOM changes that may introduce additional image links.

The observer is initialized through:

```javascript
startObserver();
```

It is designed to detect new image content without relying on a permanent polling interval.

### 5. Original Image URL Extraction

The userscript extracts original image URLs from Google Images links.

It identifies links containing:

```javascript
a[href*="imgurl="]
```

The extraction process uses the native URL API:

```javascript
function getImageUrl(link) {
    try {
        const url = new URL(link.href);
        const imageUrl = url.searchParams.get('imgurl');

        if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
            return null;
        }

        if (imageUrl.includes('gstatic.com')) {
            return null;
        }

        return imageUrl;

    } catch {
        return null;
    }
}
```

This method provides several advantages:

- Uses native URL parsing.
- Automatically handles URL parameter decoding.
- Validates HTTP and HTTPS addresses.
- Ignores empty or invalid image URLs.
- Excludes URLs containing `gstatic.com`.
- Prevents malformed URLs from interrupting the scanning process.

### 6. Image Container Detection

After identifying a valid image URL, the script attempts to locate its associated image container.

It uses:

```javascript
function getContainer(link) {
    return link.closest('[jsname], [data-attrid]');
}
```

The detected container is used as the insertion point for the camera button.

Before inserting the button, the script checks its positioning:

```javascript
if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
}
```

This allows the button to use absolute positioning within the selected container.

### 7. Duplicate Button Prevention

The userscript includes a mechanism to avoid processing the same link repeatedly.

Each processed link receives a custom dataset attribute:

```javascript
link.dataset.googleViewProcessed = '1';
```

Before processing a link again, the script checks:

```javascript
if (link.dataset.googleViewProcessed === '1') {
    return;
}
```

It also checks whether the selected container already contains a Google View button.

```javascript
if (!container || container.querySelector(`.${BUTTON_CLASS}`)) {
    return;
}
```

This reduces unnecessary button creation during repeated scans and dynamic DOM updates.

### 8. Compact Camera Button

The script creates a small camera button for each recognized image container.

The button is created using:

```javascript
const button = document.createElement('button');

button.type = 'button';
button.className = BUTTON_CLASS;
button.textContent = '📷';
button.title = 'Resmi Görüntüle';
```

Its primary purpose is to provide direct access to the original image.

### 9. Visual Integration

The camera button uses a compact design intended to fit naturally into Google Images.

Visual characteristics include:

- Camera emoji icon.
- Semi-transparent black background.
- White icon.
- Rounded corners.
- Compact padding.
- Absolute positioning.
- High stacking order.
- Smooth hover transition.
- Darker background on hover.

The button styling is managed through a dedicated CSS class.

```css
.google-view-btn {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 3px 7px;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
    transition: background 0.2s;
}
```

The hover state changes the background:

```css
.google-view-btn:hover {
    background: rgba(0, 0, 0, 0.95);
}
```

### 10. Click Event Management

The camera button uses a dedicated click event listener.

```javascript
button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    window.open(imageUrl, '_blank', 'noopener,noreferrer');
});
```

The event handling prevents the click from triggering the parent image link's normal navigation.

The original image is opened in a separate browser tab.

### 11. F1 Information Message

The userscript displays a temporary information message in the bottom-right corner of the page.

The message informs users that they can press F1 to add image buttons.

Its content is:

```text
⌨️ F1 tuşuna bas → Görsel butonlarını ekle
```

The information message:

- Appears when the userscript starts.
- Uses a compact blue interface.
- Can be dismissed by clicking it.
- Automatically disappears after eight seconds.
- Prevents multiple copies of the same message from being displayed simultaneously.

The information element uses the following identifier:

```javascript
const INFO_ID = 'google-view-info';
```

### 12. Lightweight Architecture

The userscript is designed to work without external JavaScript libraries.

It uses native browser functionality for:

- DOM selection.
- URL parsing.
- Event handling.
- Dynamic content observation.
- CSS injection.
- Opening new browser tabs.
- Temporary interface messages.

This keeps the implementation relatively small and avoids unnecessary dependencies.

---

## ⚙️ Technical Architecture

### Runtime Environment

The project is written in JavaScript and runs directly within Google Images through Tampermonkey.

The userscript interacts with the existing Google Images document and adds its own interface elements.

### Technologies Used

| Technology | Purpose |
|---|---|
| JavaScript | Core functionality and application logic |
| Tampermonkey | Userscript installation and execution |
| DOM API | Accessing and modifying Google Images elements |
| MutationObserver | Detecting dynamically inserted content |
| URL API | Parsing image-related URLs |
| URLSearchParams | Extracting the original image URL |
| CSS | Styling camera buttons and information messages |
| EventListener | Handling keyboard and mouse interactions |
| dataset | Tracking processed image links |
| setTimeout | Removing temporary information messages |
| window.open | Opening original images in new tabs |
| querySelectorAll | Locating image result links |
| getComputedStyle | Checking image container positioning |

### Userscript Configuration

The script uses:

```javascript
// @run-at       document-end
// @grant        none
```

`document-end` allows the userscript to execute after the document has been parsed.

`@grant none` means the current implementation does not require Tampermonkey-specific privileged APIs.

### URL Matching

The current userscript includes these URL patterns:

```javascript
// @match        https://www.google.com.tr/search?*tbm=isch*
// @match        https://www.google.com.tr/search?*udm=2*
// @match        https://www.google.com/search?*tbm=isch*
// @match        https://www.google.com/search?*udm=2*
```

These rules are intended for Google Images searches using the `tbm=isch` and `udm=2` parameters.

**Compatibility note:** The current metadata explicitly targets the `.com` and `.com.tr` Google domains. Other country-specific Google domains require additional matching rules or a broader URL matching configuration.

### Image Link Detection

The script searches for links containing the original image URL parameter:

```javascript
document.querySelectorAll('a[href*="imgurl="]');
```

Only links with a successfully extracted and validated HTTP or HTTPS image URL are eligible for button insertion.

### URL Processing

The URL extraction mechanism uses:

```javascript
const url = new URL(link.href);
const imageUrl = url.searchParams.get('imgurl');
```

This avoids manually splitting URL strings and decoding query parameters.

### Image Container Selection

The script identifies a possible image container using:

```javascript
link.closest('[jsname], [data-attrid]');
```

The selected container is used to position the camera button.

### DOM Monitoring

The observer uses:

```javascript
new MutationObserver(() => {
    if (document.querySelector('a[href*="imgurl="]')) {
        addButtons();
    }
});
```

The observer monitors:

```javascript
{
    childList: true,
    subtree: true
}
```

This allows the script to respond to newly inserted DOM elements.

### Button Identification

The script uses a dedicated CSS class:

```javascript
google-view-btn
```

The processed-link tracking attribute is:

```javascript
data-google-view-processed="1"
```

These identifiers help manage button insertion and prevent repeated processing.

### Execution Management

The script maintains its internal state through:

```javascript
let totalAdded = 0;
let observer = null;
```

- `totalAdded` tracks the total number of buttons successfully inserted during the current page session.
- `observer` stores the active MutationObserver instance.

The observer is initialized only once.

---

## 🔄 Update System

The project uses a single userscript file for installation and automatic update checks.

**Update URL:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

**Download URL:**

```text
https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

The userscript contains the following update metadata:

```javascript
// @updateURL    https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
// @downloadURL  https://raw.githubusercontent.com/efem360/Tampermonkey-Scripts/main/Google-Images-Quick-View-Button/Google-Images-Quick-View-Button.js
```

When a new version is released:

1. The userscript source is updated.
2. The version number in the metadata is incremented.
3. Tampermonkey can detect the newer version.
4. Users can install the update through Tampermonkey.

**Current Version:**

```javascript
// @version      1.1
```

For the latest source code and project updates:

[GitHub Repository](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)

---

## 🔐 Privacy and Security

Privacy is an important consideration in this project.

**efem360 Google Images Quick Viewer** is designed to perform image link detection, URL extraction, and button creation locally within the user's browser.

### Privacy Principles

- No user account system.
- No registration required.
- No analytics or tracking system implemented by the userscript.
- No external API integration.
- No remote database.
- No independent image collection service.
- No transmission of extracted image URLs to a third-party server by the userscript.
- No separate background service.
- No additional Tampermonkey permissions.

### Data Processing

The script reads image-related URLs from existing Google Images links.

These URLs are used to create direct image-opening buttons.

The script does not need to access image file contents to perform its intended operations.

### External Communication

The userscript does not implement an external image search API.

It does not upload extracted image URLs to an external server.

When a user clicks a camera button, the browser opens the corresponding image URL.

The destination image server receives the resulting browser request.

### Permissions

The userscript metadata includes:

```javascript
// @grant        none
```

The current implementation uses native browser APIs rather than privileged Tampermonkey functions.

---

## ⚠️ Compatibility and Limitations

The script is primarily designed for Google Images and its existing image result link structure.

### Supported Environment

- Google Images on `www.google.com`.
- Google Images on `www.google.com.tr`.
- Image searches using `tbm=isch`.
- Image searches using `udm=2`.
- Tampermonkey-compatible desktop browsers.
- Image links containing a valid `imgurl` parameter.
- Dynamically inserted image results.

### Limitations

- Google interface updates may change the DOM structure.
- Changes to image URL parameters may require compatibility updates.
- Image results without an `imgurl` parameter are ignored.
- URLs containing `gstatic.com` are excluded.
- Image containers that do not match the recognized selectors will not receive buttons.
- Some image links may not expose a directly accessible original image URL.
- Browser popup protection may prevent a new tab from opening.
- The script does not download images automatically.
- The script does not modify original image files.
- The script does not bypass image hosting restrictions.
- The current metadata does not cover every country-specific Google domain.

The script modifies the browser's displayed interface by inserting camera buttons. It does not modify Google's stored image data or original image content.

---

## 📋 Version History

| Version | Changes |
|---|---|
| 1.0 | Initial implementation with F1-triggered image button insertion, image URL extraction, direct image opening, and temporary information message |
| 1.1 | Improved URL parsing with URL and URLSearchParams, dataset-based duplicate prevention, MutationObserver support, revised button styling, simplified notification handling, and removal of unnecessary Tampermonkey permissions |

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

If you encounter an issue:

1. Check whether the problem is reproducible.
2. Include your browser name and version.
3. Include your Tampermonkey version.
4. Specify which Google domain you are using.
5. Describe whether the camera button is missing or the image fails to open.
6. Provide the expected behavior.
7. Open a GitHub Issue.

Contributions that improve compatibility, performance, reliability, and usability are welcome.

**GitHub Issues:**

https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button/issues

---

# 📄 License

This project is released under the **GNU General Public License v3.0 (GPL-3.0)**.

The GNU GPL-3.0 permits the use, study, modification, and distribution of the software, provided that the source code remains open, changes are documented, and any derivative works are distributed under the same license terms.

See the `LICENSE` file in the project repository for details.

---

<div align="center">

## ✦ efem360

**Small Improvements. Better Experiences.**

Developed by **Kemal Kalender**

[GitHub](https://github.com/efem360) · [Google Images Quick Viewer](https://github.com/efem360/Tampermonkey-Scripts/tree/main/Google-Images-Quick-View-Button)

<br>

*Making everyday browser experiences simpler, cleaner, and more efficient.*

</div>
