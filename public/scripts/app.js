// Import necessary view components and utility functions
import { Signin, Signout } from './views/signin&signout.js'
import { Profile } from './views/profile.js'
import { NotFound, ForgotPassword } from './views/notfound.js'
import { Warning } from './tools.js';

// Define a map of routes to their corresponding views
const Views = {
  '/auth/signin': Signin,
  '/dashboard/profile': Profile,
  '/user/signout': Signout,
  '/forgot-password': ForgotPassword
};

// Handles routing logic based on the given path
const route = (path) => {
  console.log(path);

  // Redirect root path to profile
  if (path === "/") {
    return browse("/dashboard/profile");
  }

  // Check for authentication unless it's signin or forgot-password
  if (path != '/auth/signin' && path != '/forgot-password') {
    const jwt = localStorage.getItem('jwt')

    // If no token, clear storage and redirect to signin
    if (!jwt) {
      localStorage.clear()
      Warning('Unauthorized. Please SignIn.', 'fail');
      browse('/auth/signin')
      return
    }
  }

  // Render the view or fallback to NotFound
  const app = document.getElementById("app");
  app.innerHTML = "";
  const View = Views[path] || NotFound;
  View.render?.(app)     // Optional chaining for render
  View.setup?.()         // Optional chaining for setup
}

// Programmatic navigation function using History API
export const browse = (path) => {
  history.pushState({}, "", path);
  route(path);
}

// Handle navigation links using event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    browse(path);
  }
});

// Handle back/forward browser navigation
window.onpopstate = () => route(location.pathname);

// Initial route setup on page load
window.onload = () => route(location.pathname);

console.log("app.js loaded");
