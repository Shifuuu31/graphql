export const NotFound = {
    render(app) { 
        app.innerHTML =    `
    <head>
    <link rel="stylesheet" href="/public/styles/notfound.css">
    </head>
    <div id="notfound">
        <h1 id="code">404</h1>
        <h2 id="title">Page Not Found</h2>
        <p id="message">The page you're looking for doesn't exist or has been moved.</p>
        <div id="actions">
          <button id="btn" onclick="window.history.back()">
             « Go Back
          </button>
            <a href="/" data-link><button id="button-submit">
                Go Home
              </button>
            </a>
        </div>
    </div>`
    }
};

export const ForgotPassword = {
    render(app) { 
        app.innerHTML = `
    <head>
    <link rel="stylesheet" href="/public/styles/notfound.css">
    </head>
    <div id="forgot-password">
        <h1 id="title">Forgot Password?</h1>
        <p id="message">Please contact your organization's IT support to reset your password. For security reasons, password resets must be handled through your organization's administrative channels.</p>
        <div id="actions">
            <button id="btn" onclick="window.history.back()">
               « Go Back
            </button>
            <a href="/" data-link>
                <button id="button-submit">
                    Go Home
                </button>
            </a>
        </div>
    </div>`
    }
};
