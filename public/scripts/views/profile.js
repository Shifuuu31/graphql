import { browse } from "../app.js";

export const Profile = {
    render(app) {
        app.innerHTML = `
    <head>
      <link rel="stylesheet" href="/public/styles/profile.css">
    </head>
    <div class="dashboard">

        <header class="topbar">
          <h1>My Profile Dashboard</h1>
          <div class="topbar-meta">
            <a href="/user/signout" data-link><button class="logout-btn">Logout</button></a>
            <img src="https://via.placeholder.com/32" alt="avatar" class="avatar">
          </div>
        </header>

        <section class="cards">
            <div class="cards">
            <div class="card">
              <h3>Login Name</h3>
              <p class="value">ayman.saadane</p>
            </div>

            <div class="card">
              <h3>Total XP</h3>
              <p class="value">12,345</p>
              <p class="sub">+15% this month</p>
            </div>

            <div class="card">
              <h3>Audit Ratio</h3>
              <p class="value">78%</p>
              <p class="sub green">+6% improvement</p>
            </div>
            </div>

            <div class="card">
              <h3>Skills</h3>
              <p class="value">Go, JS, GraphQL</p>
              <p class="sub">Skills unlocked</p>
            </div>

        </section>

        <section class="chart-area">
          <div class="chart">
            <div class="chart-header">
              <h3>Monthly XP</h3>
            </div>
            <svg viewBox="0 0 300 100">
              <rect x="10"  y="40" width="10" height="60" fill="#3b82f6"/>
              <rect x="30"  y="30" width="10" height="70" fill="#3b82f6"/>
              <rect x="50"  y="50" width="10" height="50" fill="#3b82f6"/>
              <rect x="70"  y="20" width="10" height="80" fill="#3b82f6"/>
            </svg>
          </div>

          <div class="chart">
            <div class="chart-header">
              <h3>Pass/Fail Ratio</h3>
            </div>
            <svg viewBox="0 0 300 100">
              <polyline fill="none" stroke="#6366f1" stroke-width="2"
                points="0,90 40,70 80,50 120,60 160,30 200,40 240,20 280,25" />
            </svg>
          </div>
        </section>

    </div>
        `
    },

    setup() {


        const jwt = localStorage.getItem('jwt')
        if (!jwt) browse('/auth/signin')
            
    

    }
};
