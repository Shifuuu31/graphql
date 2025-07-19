import { FormatBytes, graphqlRequest, loadFailed, Warning } from "../tools.js"

export const AuditRatio = {
  html: `
<div class="card">
  <h3>Ratio</h3>
  <div id="audit-ratio">
    <p class="value"></p>
    <p class="sub green"></p>
    <p class="sub red"></p>
    <div class="chart-bar">
      <div class="bar up" style="width: 0%"></div>
      <div class="bar down" style="width: 0%"></div>
    </div>
  </div>
</div>

`,
  setup: async () => {
    const query = `query {
      user {
        auditRatio
        totalUp
        totalDown
      }
    }`;

    const resp = await graphqlRequest(query);
    console.log("ratio", resp);

    const container = document.getElementById("audit-ratio");

    if (!resp || !resp.user || !Array.isArray(resp.user)) {
      loadFailed(container, 'Audit Ratio');
      return;
    }

    const user = resp.user[0];
    const auditRatio = user?.auditRatio || 0;
    const up = user?.totalUp || 0;
    const down = user?.totalDown || 0

    console.log(up, down);
    ;

    // Display ratio
    container.children[0].textContent = auditRatio ? auditRatio.toFixed(1) : "0.0";

    const upArrowSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
  <path d="M7 14l5-5 5 5H7z"/>
</svg>`;

    const downArrowSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
  <path d="M7 10l5 5 5-5H7z"/>
</svg>`;


    container.children[1].innerHTML = `Done: ${FormatBytes(up, 2)}${upArrowSvg}`;
    container.children[2].innerHTML = `Received: ${FormatBytes(down, 2)}${downArrowSvg}`;

    // Adjust chart bars
    const total = up + down || 1; // avoid divide-by-zero
    const upPercent = (up / total) * 100;
    const downPercent = 100 - upPercent;

    const chartBar = container.querySelector(".chart-bar");
    const barUp = chartBar.querySelector(".bar.up");
    const barDown = chartBar.querySelector(".bar.down");

    barUp.style.width = `${upPercent}%`;
    barDown.style.width = `${downPercent}%`;
  }
}
