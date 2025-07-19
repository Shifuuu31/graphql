import { browse } from "../app.js";
import { UserInfo } from "../components/user-info.js";
import { XpAmount } from "../components/xp-amount.js";
import { AuditRatio } from "../components/audit-ratio.js";
import { Level } from "../components/level.js";
import { AuditRate } from "../components/audit-rate.js";
import { XpProgress } from "../components/xp-progress.js";

export const Profile = {
    render(app) {
        app.innerHTML = `
    <head>
      <link rel="stylesheet" href="/public/styles/profile.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=chip_extraction" />
    </head>
    <div class="dashboard">

        <header class="topbar">
          <h1>My Profile Dashboard</h1>
          <div class="topbar-meta">
          <img src="https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg" alt="avatar" class="avatar">
            <a href="/user/signout" data-link><button class="logout-btn"><span class="material-symbols-outlined">
chip_extraction
</span></button></a>
          </div>
        </header>

        <section class="cards">
              ${UserInfo.html}
              ${Level.html}
              ${XpAmount.html}
              
              </section>
              
              <section class="cards">
              ${XpProgress.html}
              </section>
              
              <section class="cards">
              ${AuditRate.html}
              </section>
    </div>
        `
    },

    setup:  ()=> {


        const jwt = localStorage.getItem('jwt')
        if (!jwt) browse('/auth/signin')
          UserInfo.setup()
        Level.setup()
          XpAmount.setup()
          XpProgress.setup()
          AuditRatio.setup()
          AuditRate.setup()

            
    

    }
};
