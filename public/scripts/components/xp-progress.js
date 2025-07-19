import { graphqlRequest, loadFailed } from "../tools.js";

export const XpProgress = {
  html: `
    <div class="card">
      <h3>XP Progress Module</h3>
      <svg id="xp-progress" style="width:100%; height:auto;"></svg>
    </div>
  `,

  setup: async () => {
    const query = `
    { 
      transaction(
          where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
          order_by: {createdAt: asc}
        ){
        amount 
        createdAt
        path
      }
    }
    `;

      const resp = await graphqlRequest(query);
      const container = document.getElementById("xp-progress");

      if (!container|| !resp || !resp.transaction || !Array.isArray(resp.transaction) || resp.transaction.length === 0) {
        loadFailed(container, "XP Progress");
        return;
      }

      const xpProgressData = resp.transaction;
      renderChart(container, xpProgressData);
   
  }
};

// === Chart Rendering Function ===
const renderChart = (container, data) => {
  // Clear previous content
  container.innerHTML = "";

  // Chart dimensions and settings
  const margin = { top: 40, right: 30, bottom: 80, left: 60 };
  const barWidth = 30;
  const barSpacing = 10;
  const containerHeight = 300;
  const chartHeight = containerHeight - margin.top - margin.bottom;
  const totalBars = data.length;
  const containerWidth = Math.max(400, margin.left + totalBars * (barWidth + barSpacing) + margin.right);

  // Set SVG dimensions
  container.setAttribute("width", containerWidth);
  container.setAttribute("height", containerHeight);
  container.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

  // Calculate cumulative XP and find max value for scaling
  let cumulativeXP = 0;
  const dataWithCumulative = data.map(tx => {
    cumulativeXP += tx.amount;
    return { ...tx, cumulative: cumulativeXP };
  });

  const maxCumulative = cumulativeXP;
  const yScale = (xp) => (maxCumulative > 0 ? (chartHeight * xp) / maxCumulative : 0);

  // Draw grid lines and Y-axis labels
  drawYAxisGrid(container, containerWidth, containerHeight, margin, maxCumulative, yScale);

  // Draw bars and labels
  dataWithCumulative.forEach((tx, i) => {
    drawBar(container, tx, i, containerHeight, margin, barWidth, barSpacing, yScale);
  });

  // Draw axes
  drawAxes(container, containerWidth, containerHeight, margin);

  // Add title
  addTitle(container, containerWidth, `Total XP Progress: ${formatXP(maxCumulative)}`);
};

// === Helper Functions ===
const drawYAxisGrid = (container, containerWidth, containerHeight, margin, maxValue, yScale) => {
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const val = (maxValue * i) / yTicks;
    const y = containerHeight - margin.bottom - yScale(val);

    // Grid line
    container.appendChild(createSvgElement("line", {
      x1: margin.left,
      x2: containerWidth - margin.right,
      y1: y,
      y2: y,
      stroke: "#808080",
      "stroke-width": "1"
    }));

    // Y-axis label
    const label = createSvgElement("text", {
      x: margin.left - 8,
      y: y + 4,
      "text-anchor": "end",
      "font-size": "11",
      "font-family": "system-ui, sans-serif",
      fill: "#6b7280"
    });
    label.textContent = formatXP(val);
    container.appendChild(label);
  }
};

const drawBar = (container, tx, index, containerHeight, margin, barWidth, barSpacing, yScale) => {
  const { amount, createdAt, cumulative } = tx;
  const date = new Date(createdAt);
  const labelDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  });

  const barHeight = yScale(cumulative);
  const x = margin.left + index * (barWidth + barSpacing);
  const y = containerHeight - margin.bottom - barHeight;

  // Bar with gradient effect
  const bar = createSvgElement("rect", {
    x,
    y,
    width: barWidth,
    height: barHeight,
    fill: "var(--text-secondary)",
    rx: "3",
    ry: "3",
    "stroke": "var(--text-muted)",
    "stroke-width": "1"
  });

  // Add hover effects
  bar.addEventListener("mouseenter", () => {
    bar.setAttribute("fill", "var(--text-muted)");
    showTooltip(container, x + barWidth / 2, y, `+${formatXP(amount)} XP\nTotal: ${formatXP(cumulative)}\n${labelDate}`);
  });

  bar.addEventListener("mouseleave", () => {
    bar.setAttribute("fill", "var(--text-secondary)");
    hideTooltip(container);
  });

  container.appendChild(bar);

  // XP gain label above bar (only if significant)
  if (amount >= 1000) {
    const xpLabel = createSvgElement("text", {
      x: x + barWidth / 2,
      y: Math.max(y - 8, 15),
      "text-anchor": "middle",
      "font-size": "9",
      "font-family": "system-ui, sans-serif",
      fill: "#059669",
      "font-weight": "600"
    });
    xpLabel.textContent = `+${formatXP(amount)}`;
    container.appendChild(xpLabel);
  }

  // X-axis date label
  const dateLabel = createSvgElement("text", {
    x: x + barWidth / 2,
    y: containerHeight - margin.bottom + 15,
    "text-anchor": "middle",
    "font-size": "10",
    "font-family": "system-ui, sans-serif",
    fill: "#6b7280"
  });
  dateLabel.textContent = labelDate;
  dateLabel.setAttribute("transform", `rotate(-45 ${x + barWidth / 2} ${containerHeight - margin.bottom + 15})`);
  container.appendChild(dateLabel);
};

const drawAxes = (container, containerWidth, containerHeight, margin) => {
  // Y-axis
  container.appendChild(createSvgElement("line", {
    x1: margin.left,
    y1: margin.top,
    x2: margin.left,
    y2: containerHeight - margin.bottom,
    stroke: "#374151",
    "stroke-width": "2"
  }));

  // X-axis
  container.appendChild(createSvgElement("line", {
    x1: margin.left,
    y1: containerHeight - margin.bottom,
    x2: containerWidth - margin.right,
    y2: containerHeight - margin.bottom,
    stroke: "#374151",
    "stroke-width": "2"
  }));
};

const addTitle = (container, containerWidth, title) => {
  const titleElement = createSvgElement("text", {
    x: containerWidth / 2,
    y: 25,
    "text-anchor": "middle",
    "font-size": "14",
    "font-family": "system-ui, sans-serif",
    "font-weight": "600",
    fill: "#111827"
  });
  titleElement.textContent = title;
  container.appendChild(titleElement);
};

const showTooltip = (container, x, y, text) => {
  // Remove existing tooltip
  hideTooltip(container);

  const lines = text.split('\n');
  const lineHeight = 14;
  const padding = 8;
  const tooltipHeight = lines.length * lineHeight + padding * 2;
  const tooltipWidth = 120;

  // Position tooltip to avoid edges
  let tooltipX = x - tooltipWidth / 2;
  let tooltipY = y - tooltipHeight - 10;

  if (tooltipX < 10) tooltipX = 10;
  if (tooltipX + tooltipWidth > container.getAttribute("width") - 10) {
    tooltipX = container.getAttribute("width") - tooltipWidth - 10;
  }
  if (tooltipY < 10) tooltipY = y + 30;

  // Tooltip background
  const tooltipBg = createSvgElement("rect", {
    id: "tooltip-bg",
    x: tooltipX,
    y: tooltipY,
    width: tooltipWidth,
    height: tooltipHeight,
    fill: "#1f2937",
    stroke: "#374151",
    rx: "6",
    opacity: "0.95"
  });
  container.appendChild(tooltipBg);

  // Tooltip text
  lines.forEach((line, i) => {
    const textElement = createSvgElement("text", {
      id: `tooltip-text-${i}`,
      x: tooltipX + tooltipWidth / 2,
      y: tooltipY + padding + (i + 1) * lineHeight - 2,
      "text-anchor": "middle",
      "font-size": "11",
      "font-family": "system-ui, sans-serif",
      fill: "#f9fafb"
    });
    textElement.textContent = line;
    container.appendChild(textElement);
  });
};

const hideTooltip = (container) => {
  const tooltip = container.querySelector("#tooltip-bg");
  if (tooltip) tooltip.remove();

  // Remove all tooltip text elements
  for (let i = 0; i < 5; i++) {
    const text = container.querySelector(`#tooltip-text-${i}`);
    if (text) text.remove();
  }
};

const formatXP = (xp) => {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return Math.round(xp).toString();
};

const createSvgElement = (tag, attributes = {}) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
};