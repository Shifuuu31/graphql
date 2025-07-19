import { browse } from "../app.js";
import { BASE_URL, Warning } from "../tools.js";



export const Signin = {
  render(app) {
    app.innerHTML = `
    <head>
      <link rel="stylesheet" href="/public/styles/signin.css">
    </head>
    <div id="form">
        <h1>Please Signin</h1>
        <div id="flex-column">
          <label>Email Or Username </label>
        </div>
        <div id="inputForm">
        <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path
                d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z">
              </path>
            </g>
          </svg>
          <input type="text" id="identifier" placeholder="Email Or Username">
        </div>

        <div id="flex-column">
          <label>Password </label>
        </div>
        <div id="inputForm" style="position: relative;">
        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0">
            </path>
            <path
              d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0">
            </path>
          </svg>
          <input type="password" id="password" placeholder="Password">
          <span id="togglePassword" class="material-symbols-outlined" style="cursor: pointer; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);">
            visibility_off
          </span>
        </div>

        <div id="flex-row">
          <a href="/forgot-password" data-link><span id="span">Forgot password?</span></a>
        </div>
        <button id="button-submit">Sign In</button>
    </div>`;
  },

  setup() {
    const jwt = localStorage.getItem('jwt')
    if (jwt) return browse('/')

    const togglePasswordIcon = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePasswordIcon.addEventListener('click', () => {
      const isVisible = passwordInput.type === 'text'

      passwordInput.type = isVisible ? 'password' : 'text';
      togglePasswordIcon.textContent = isVisible ? 'visibility_off' : 'visibility';
    });

    const signInButton = document.getElementById('button-submit');

    signInButton.addEventListener('click', async () => {

      const identifier = document.getElementById('identifier').value.trim();
      const password = passwordInput.value.trim();

      if (identifier === '' || password === '') return Warning('Required Credentials')

        const response = await fetch(`${BASE_URL}/api/auth/signin`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${btoa(identifier + ":" + password)}`
          }
        })

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        localStorage.setItem("jwt", data);

        return browse("/");
      
    });
  }
};

export const Signout = {
  setup() {
    localStorage.clear()
    browse('/auth/signin')


  }
}


