import { bytesToKilobytes, graphqlRequest, loadFailed, Warning } from "../tools.js"
import { AuditRatio } from "./audit-ratio.js";

export const AuditRate = {
  html: `
  <div class="card">
    <h3 style="margin-bottom:30px">Audit</h3>
    <div style="display:flex; width:100%;">
      ${AuditRatio.html}
      <div class="card">
        <h3>Rate</h3>
        <div id="audit-rate">
          <div class="stat-item">
            <p class="sub" id="success-rate"></p>
            <p class="sub green">Success Rate</p>
          </div>
          <div class="stat-item">
            <p class="sub" id="fail-rate"></p>
            <p class="sub red">Fail Rate</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <svg id="donut-chart" width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" stroke-width="20"/>
        <circle id="success-arc" cx="100" cy="100" r="80" fill="none" stroke="#4CAF50" stroke-width="20" 
                stroke-dasharray="0 502" stroke-dashoffset="125" transform="rotate(-90 100 100)">
          <title id="success-tooltip">Success: 0 (0%)</title>
        </circle>
        <circle id="fail-arc" cx="100" cy="100" r="80" fill="none" stroke="#f44336" stroke-width="20" 
                stroke-dasharray="0 502" stroke-dashoffset="125" transform="rotate(-90 100 100)">
          <title id="fail-tooltip">Fail: 0 (0%)</title>
        </circle>
        <text x="100" y="95" text-anchor="middle" class="chart-label">Total</text>
        <text x="100" y="110" text-anchor="middle" class="chart-value" id="total-count">0</text>
      </svg>
    </div>
  </div>
  `,
  
  setup: async () => {
    const query = `query {
      audit {
        grade
      }
    }`;
    
    const resp = await graphqlRequest(query);
    console.log("audit data", resp);
    
    const container = document.getElementById("audit-rate");
    
    if (!resp || !resp.audit || !Array.isArray(resp.audit)) {
      loadFailed(container, 'Audit Rate');
      Warning('Could not load Audit Rate. Please re-login.', 'fail');
      return;
    }
    
    // Calculate success/fail based on grade
    // Typically grade > 1 means pass, grade <= 1 means fail
    let totalSuccess = 0;
    let totalFail = 0;
    
    resp.audit.forEach(audit => {
      if (audit.grade > 1) {
        totalFail++;
      } else {
        totalSuccess++;
      }
    });
    const total = totalSuccess + totalFail;
    
    if (total === 0) {
      document.getElementById("success-rate").textContent = "0%";
      document.getElementById("fail-rate").textContent = "0%";
      document.getElementById("total-count").textContent = "0";
      return;
    }
    
    const successRate = ((totalSuccess / total) * 100).toFixed(1);
    const failRate = ((totalFail / total) * 100).toFixed(1);
    
    // Update text values
    document.getElementById("success-rate").textContent = `${successRate}%`;
    document.getElementById("fail-rate").textContent = `${failRate}%`;
    document.getElementById("total-count").textContent = total.toString();
    
    // Update tooltips
    document.getElementById("success-tooltip").textContent = `Success: ${totalSuccess} (${successRate}%)`;
    document.getElementById("fail-tooltip").textContent = `Fail: ${totalFail} (${failRate}%)`;
    
    // Update donut chart
    updateDonutChart(totalSuccess, totalFail, total);
  }
};

function updateDonutChart(successCount, failCount, total) {
  const circumference = 2 * Math.PI * 80; // r = 80
  
  const successPercentage = successCount / total;
  const failPercentage = failCount / total;
  
  const successLength = circumference * successPercentage;
  const failLength = circumference * failPercentage;
  
  const successArc = document.getElementById("success-arc");
  const failArc = document.getElementById("fail-arc");
  
  // Success arc (starts at top)
  successArc.style.strokeDasharray = `${successLength} ${circumference}`;
  successArc.style.strokeDashoffset = "0";
  
  // Fail arc (starts after success arc)
  const failOffset = -successLength;
  failArc.style.strokeDasharray = `${failLength} ${circumference}`;
  failArc.style.strokeDashoffset = failOffset.toString();
  
  // Add animation
  successArc.style.transition = "stroke-dasharray 0.5s ease-in-out";
  failArc.style.transition = "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
}