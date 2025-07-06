import { browse } from "../app.js";

export const Profile = {
    render(app) {
        app.innerHTML = `
<h1>Profile Dashboard <span style="font-size:20px;">(comming soon)</span></h1>

        `
    },

    setup() {
        const jwt = localStorage.getItem('jwt')
        if (!jwt) browse('/auth/signin')
            console.log("succes");
            
            

    }
};
