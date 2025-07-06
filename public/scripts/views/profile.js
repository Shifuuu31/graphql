import { browse } from "../app.js";

export const Profile = {
    render(app) {
        app.innerHTML = `
<h1>Profile Dashboard <span style="font-size:20px;">(comming soon)</span></h1>

        `
    },

    setup() {
        const token = localStorage.getItem('token')
        if (!token) browse('/auth/signin')
            console.log("succes");
            

    }
};
