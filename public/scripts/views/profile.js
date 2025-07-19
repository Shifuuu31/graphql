// Import routing and UI component modules
import { UserInfo } from "../components/user-info.js";
import { XpAmount } from "../components/xp-amount.js";
import { Level } from "../components/level.js";
import { AuditRate } from "../components/audit-rate.js";
import { XpProgress } from "../components/xp-progress.js";

// Define the Profile view
export const Profile = {
  // Render method that injects the profile HTML into the app container
  render(app) {
    app.innerHTML = `
    <head>
      <!-- Load profile-specific styles and Google icon font -->
      <link rel="stylesheet" href="/public/styles/profile.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=chip_extraction" />
    </head>
    <div class="dashboard">

        <!-- Header section of the dashboard -->
        <header class="topbar">

        <a href="/" style="text-decoration: none; color: inherit; " data-link>  <h1>My Profile Dashboard</h1></a>
          <div class="topbar-meta">
            <!-- Static avatar image -->
            <a href="/" data-link><img src="https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg" alt="avatar" class="avatar"></a>
            <!-- Logout button that uses client-side navigation -->
            <a href="/user/signout" data-link>
              <button class="logout-btn">
                <span class="material-symbols-outlined">
                  chip_extraction
                </span>
              </button>
            </a>
          </div>
        </header>

        <!-- First row of cards: User info, level, and XP amount -->
        <section class="cards">
              ${UserInfo.html}
              ${Level.html}
              ${XpAmount.html}
        </section>
        
        <!-- Second row of cards: XP progress bar -->
        <section class="cards">
              ${XpProgress.html}
        </section>
        
        <!-- Third row of cards: Audit rate chart -->
        <section class="cards">
              ${AuditRate.html}
        </section>
    </div>
    `
  },

  // Setup method to initialize interactivity and data fetching for all components
  setup: () => {
    UserInfo.setup()
    Level.setup()
    XpAmount.setup()
    XpProgress.setup()
    AuditRate.setup()
  }
};
