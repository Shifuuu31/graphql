// Import utility functions: GraphQL requester and error handler
import { graphqlRequest, loadFailed } from "../tools.js";

// Define the Level component
export const Level = {
  // HTML template for displaying level information
  html: `
    <div class="card">
      <h3>Level</h3>
      <div id="level" class="level-container">
        <p class="value">Loading...</p> <!-- Placeholder for level value -->
        <p class="sub green">Current Level</p> <!-- Placeholder label for context -->
        <p class="sub red">Last Updated</p> <!-- Placeholder label for timestamp -->
      </div>
    </div>`,

  // Setup function to fetch and populate the level data
  setup: async () => {
    // GraphQL query to get the highest level from XP transactions related to Modules
    const query = `
    {
      level: transaction(
        where: {
          _and: [
            { type: { _eq: "level" } },
            { event: { object: { name: { _eq: "Module" } } } }
          ]
        }
        order_by: { amount: desc }
        limit: 1
      ) {
        amount
        createdAt
      }
    }
    `;
    // Send the GraphQL request
    const resp = await graphqlRequest(query);
    const container = document.getElementById("level");

    // Handle case when level data is missing or invalid
    if (!container || !resp || !resp.level || resp.level.length === 0) {
      loadFailed(container, "Level data");
      return;
    }

    // Destructure the highest level and timestamp from response
    const { amount, createdAt } = resp.level[0];

    // Select the DOM elements to populate
    const levelVal = container.querySelector(".value");
    const greenSub = container.querySelector(".sub.green");
    const redSub = container.querySelector(".sub.red");

    // Set the level value with a green up-arrow SVG icon
    levelVal.innerHTML = `Level ${amount.toFixed(0)} <svg width="14" height="14" style="vertical-align: middle"><path d="M7 2l4 5H3z" fill="green"/></svg>`;

    // Set the green label to provide context
    greenSub.textContent = "Based on your top module";

    // Set the red label with formatted last update date
    redSub.textContent = `Updated: ${new Date(createdAt).toLocaleDateString()}`;
  }
};
