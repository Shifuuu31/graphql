// Import utilities: formatting bytes, GraphQL requests, error handler, and warnings
import { FormatBytes, graphqlRequest, loadFailed, Warning } from "../tools.js"

// Define the AuditRatio component
export const AuditRatio = {
  // HTML template for the Audit Ratio card
  html: `
<div class="card">
  <h3>Ratio</h3>
  <div id="audit-ratio">
    <p class="value"></p> <!-- Displays audit ratio value -->
    <p class="sub green"></p> <!-- Displays 'Done' (upload) amount with green indicator -->
    <p class="sub red"></p> <!-- Displays 'Received' (download) amount with red indicator -->
    
    <!-- Horizontal bar chart showing proportion of up/down -->
    <div class="chart-bar">
      <div class="bar up" style="width: 0%"></div>
      <div class="bar down" style="width: 0%"></div>
    </div>
  </div>
</div>
`,

  // Setup function to fetch and display audit data
  setup: async () => {
    // GraphQL query to fetch audit ratio and XP up/down amounts
    const query = `query {
      user {
        auditRatio
        totalUp
        totalDown
      }
    }`;

    // Perform the request
    const resp = await graphqlRequest(query);
    console.log("ratio", resp);

    // Get the container for updating the DOM
    const container = document.getElementById("audit-ratio");

    // Handle missing or invalid data
    if (!container || !resp || !resp.user || !Array.isArray(resp.user)) {
      loadFailed(container, 'Audit Ratio');
      return;
    }

    // Extract audit-related data
    const user = resp.user[0];
    const auditRatio = user?.auditRatio || 0;
    const up = user?.totalUp || 0;
    const down = user?.totalDown || 0;

    console.log(up, down);

    // Display the audit ratio value (e.g., 3.2)
    container.children[0].textContent = auditRatio ? auditRatio.toFixed(1) : "0.0";

    // SVG icons for up/down arrows
    const upArrowSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
  <path d="M7 14l5-5 5 5H7z"/>
</svg>`;

    const downArrowSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
  <path d="M7 10l5 5 5-5H7z"/>
</svg>`;

    // Display total uploaded and downloaded XP with icons
    container.children[1].innerHTML = `Done: ${FormatBytes(up, 2)}${upArrowSvg}`;
    container.children[2].innerHTML = `Received: ${FormatBytes(down, 2)}${downArrowSvg}`;

    // Calculate proportions for visual bar chart
    const total = up + down || 1; // Avoid divide-by-zero if both are 0
    const upPercent = (up / total) * 100;
    const downPercent = 100 - upPercent;

    // Get chart bar elements and set their widths
    const chartBar = container.querySelector(".chart-bar");
    const barUp = chartBar.querySelector(".bar.up");
    const barDown = chartBar.querySelector(".bar.down");

    barUp.style.width = `${upPercent}%`;
    barDown.style.width = `${downPercent}%`;
  }
}
