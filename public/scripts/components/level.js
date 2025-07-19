import { graphqlRequest, loadFailed } from "../tools.js";

export const Level = {
  html: `
    <div class="card">
      <h3>Level</h3>
      <div id="level" class="level-container">
        <p class="value">Loading...</p>
        <p class="sub green">Current Level</p>
        <p class="sub red">Last Updated</p>
      </div>
    </div>`,

  setup: async () => {
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

    const resp = await graphqlRequest(query);
    const container = document.getElementById("level");

    if (!resp || !resp.level || resp.level.length === 0) {
      loadFailed(container, "Level data");
      return;
    }

    const { amount, createdAt } = resp.level[0];

    const levelVal = container.querySelector(".value");
    const greenSub = container.querySelector(".sub.green");
    const redSub = container.querySelector(".sub.red");

    levelVal.innerHTML = `Level ${amount.toFixed(0)} <svg width="14" height="14" style="vertical-align: middle"><path d="M7 2l4 5H3z" fill="green"/></svg>`;
    greenSub.textContent = "Based on your top module";
    redSub.textContent = `Updated: ${new Date(createdAt).toLocaleDateString()}`;
  }
};
