import { bytesToKilobytes, graphqlRequest, loadFailed } from "../tools.js"

export const XpAmount = {
  html: `
    <div class="card">
      <h3>Total XP</h3>
      <div id="xp-amount">
        <p class="value">Loading...</p>
        <p class="sub"></p>
      </div>
    </div>`,

  setup: async () => {
    const query = `
      query {
        user {
          transactions_aggregate(
            where: {
              type: { _eq: "xp" }
              event: { object: { name: { _eq: "Module" } } }
            }
          ) {
            aggregate {
              sum {
                amount
              }
            }
          }

          transactions(
            where: {
              type: { _eq: "xp" }
              event: { object: { name: { _eq: "Module" } } }
            }
            order_by: { createdAt: desc }
            limit: 1
          ) {
            amount
            createdAt
            object {
              name
            }
          }
        }
      }
    `

    const container = document.getElementById("xp-amount")
    const resp = await graphqlRequest(query)

    if (!resp?.user?.[0]) {
      loadFailed(container, 'Total XP')
      return
    }

    const totalAmount = resp.user[0].transactions_aggregate?.aggregate?.sum?.amount || 0
    const lastTx = resp.user[0].transactions?.[0]

    const totalKb = bytesToKilobytes(totalAmount) + " kB"
    const lastName = lastTx?.object?.name || "Unknown"
    const lastAmountKb = bytesToKilobytes(lastTx?.amount, 1) + " kB"
    const lastDate = new Date(lastTx?.createdAt || "").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    container.children[0].innerHTML = totalKb
    container.children[1].innerHTML = `Last: ${lastName} (${lastDate})<br><span class="green">+${lastAmountKb}</span>`
  }
}
