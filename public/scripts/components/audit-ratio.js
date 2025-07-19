import { bytesToKilobytes, graphqlRequest, loadFailed, Warning } from "../tools.js"

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
        totalUp
        totalDown
      }
    }`;

    const resp = await graphqlRequest(query);
    console.log("ratio", resp);

    const container = document.getElementById("audit-ratio");

    if (!resp || !resp.user || !Array.isArray(resp.user)) {
      loadFailed(container, 'Audit Ratio');
      Warning('Could not load Audit Ratio. Please re-login.', 'fail');
      return;
    }

    const user = resp.user[0];
    const up = user?.totalUp || 0;
    const down = user?.totalDown || 0;

    // Display ratio
    container.children[0].textContent = down ? (up / down).toFixed(1) : "0.0";

    const upArrowSvg = `...`;   // (same as before)
    const downArrowSvg = `...`; // (same as before)

    container.children[1].innerHTML = `Done: ${bytesToKilobytes(up)} kB${upArrowSvg}`;
    container.children[2].innerHTML = `Received: ${bytesToKilobytes(down)} kB${downArrowSvg}`;

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
