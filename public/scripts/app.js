import { Signin, Signout } from './views/signin&signout.js'
import { Profile } from './views/profile.js'
import { NotFound, ForgotPassword } from './views/notfound.js'
import { Warning } from './tools.js';



const Views = {
  '/auth/signin': Signin,
  '/dashboard/profile': Profile,
  '/user/signout': Signout,
  '/forgot-password': ForgotPassword
};



const route = (path) => {
  console.log(path);

  if (path === "/") {
    return browse("/dashboard/profile");
  }

if (path != '/auth/signin' && path != '/forgot-password') {
    const jwt = localStorage.getItem('jwt')

    if (!jwt) {
      localStorage.clear()
      Warning('Unauthorized. Please SignIn.', 'fail');
      browse('/auth/signin')
      return
    }

  }
  const app = document.getElementById("app");
  app.innerHTML = "";
  const View = Views[path] || NotFound;
  View.render?.(app)
  View.setup?.()
}

export const browse = (path) => {
  history.pushState({}, "", path);
  route(path);
}


document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    browse(path);
  }
});

window.onpopstate = () => route(location.pathname);
window.onload = () => route(location.pathname);
console.log("app.js loaded");



