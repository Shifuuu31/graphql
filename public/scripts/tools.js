import { browse } from "./app.js";

// Base URL for the backend API
export const BASE_URL = 'https://learn.zone01oujda.ma'

// Utility function to send a GraphQL request
export const graphqlRequest = async (query) => {
    try {
        // Get the JWT token from localStorage
        const jwt = localStorage.getItem("jwt");
        
        // If token not found, show warning and redirect to sign-in
        if (!jwt) {
            Warning('Unauthorized. Please SignIn.', 'fail');
            localStorage.clear()
            browse('/auth/signin')
            return null
        }

        // Send GraphQL request with JWT in Authorization header
        const res = await fetch(`${BASE_URL}/api/graphql-engine/v1/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ query })
        });

        // Parse JSON response
        const json = await res.json();

        // If GraphQL returns errors, show warning and redirect to sign-in
        if (json.errors) {
            console.warn("GraphQL Errors:", json.errors);
            Warning('Unauthorized. Please SignIn.', 'fail');
            localStorage.clear()
            browse('/auth/signin')
            return null
        }

        // Return the actual data
        return json.data;

    } catch (error) {
        // Catch network or other errors
        console.warn("GraphQL Error:", error);
        return null
    };
}

// Adds multiple event listeners to a DOM element
EventTarget.prototype.addMultiEventListener = function (events, callback, options) {
    events.forEach(event => this.addEventListener(event, callback, options));
};

let popupIndex = 0

// Displays a warning or message popup with different states (success, info, error)
export const Warning = (message, state = 'fail', t = 10, n = 1) => {
    let container = document.getElementById('popup-container');

    // Create popup container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'popup-container';
        document.body.appendChild(container);
    }

    // Limit to 5 error cards
    const errcards = container.querySelectorAll('.errcard')
    if (errcards.length >= 5) return

    // Create error/success/info card
    const errcard = document.createElement('div');
    errcard.className = 'errcard ' + (state === 'success' ? ' success' : ' fail');

    
    let iconPath = '';
    let titleText = '';

    if (state === 'success') {
        iconPath = 'M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z';
        titleText = 'Success';
    } else if (state === 'info') {
        iconPath = 'M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 344c13.3 0 24 10.7 24 24v8c0 13.3-10.7 24-24 24s-24-10.7-24-24v-8c0-13.3 10.7-24 24-24zm0-256c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32v-96c0-17.7-14.3-32-32-32z';
        titleText = 'Info';
    } else {
        iconPath = 'M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0L256 222.1 303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L289.9 256 337 303c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L256 289.9 209 337c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L222.1 256 175 209c-9.4-9.4-9.4-24.6 0-33.9z';
        titleText = 'Error';
    }

    errcard.innerHTML = `
        <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="icon">
                <path d="${iconPath}"/>
            </svg>
        </div>

        <div class="message-text-container">
            <p class="message-text">${titleText}</p>
            <p class="sub-text">${message}</p>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="none" class="cross-icon">
            <path fill="currentColor" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"/>
        </svg>
    `;


    // Close button handler
    const closeBtn = errcard.querySelector('.cross-icon');
    closeBtn.addEventListener('click', () => {
        errcard.classList.add('removing');
        setTimeout(() => errcard.remove(), 300);
    });

    // Auto-remove after timeout
    setTimeout(() => {
        if (errcard.parentNode) {
            errcard.classList.add('removing');
            setTimeout(() => errcard.remove(), 300 * t);
        }
    }, 300 * t);

    const children = container.children;

    // Show new popup or replace old one based on limit
    if (children.length < n) {
        container.appendChild(errcard);
    } else {
        container.replaceChild(errcard, children[popupIndex]);
        popupIndex = (popupIndex + 1) % n;
    }
};

// Renders an error message into a container when loading fails
export const loadFailed = (container, dataType) => {
    if (container) {
        container.innerHTML = `<div class="error">Failed to load ${dataType}. Please try again later.</div>`
    }
}

// Converts bytes to a human-readable string with proper units
export const FormatBytes = (bytes, n = 2) => {
    if (bytes === 0) return '0 B';

    if (bytes < 1000) return `${bytes} B`;
    if (bytes >= 1000 && bytes < 1000000) return `${+(bytes / 1000).toFixed(n)} KB`;
    if (bytes >= 1000000 && bytes < 1000000000) return `${+(bytes / 1000000).toFixed(n)} MB`;
    if (bytes >= 1000000000) return `${+(bytes / 1000000000).toFixed(n)} GB`;
}
