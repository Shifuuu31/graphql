// Import utility functions: formatting bytes, making GraphQL requests, and handling load errors
import { FormatBytes, graphqlRequest, loadFailed } from "../tools.js"

// Define the XpAmount component
export const XpAmount = {
  // HTML structure for the XP card
  html: `
    <div class="card">
      <h3>Total XP</h3>
      <div id="xp-amount">
        <p class="value">Loading...</p> <!-- Placeholder for total XP -->
        <p class="sub"></p> <!-- Placeholder for last XP transaction info -->
      </div>
    </div>`,

  // Asynchronous setup function to fetch and display XP data
  setup: async () => {
    // GraphQL query to fetch total XP and most recent XP transaction for "Module" events
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

    // Get the container element to display the XP data
    const container = document.getElementById("xp-amount")

    // Make the GraphQL request
    const resp = await graphqlRequest(query)

    // Handle case when user data is not returned
    if (!container || !resp  || !resp?.user?.[0]) {
      loadFailed(container, 'Total XP')  // Show error message in UI
      return
    }

    // Extract total XP amount and latest transaction details
    const totalAmount = resp.user[0].transactions_aggregate?.aggregate?.sum?.amount || 0
    const lastTx = resp.user[0].transactions?.[0]

    // Format total XP and last transaction amount into kilobytes
    const totalKb = FormatBytes(totalAmount, 2)
    const lastName = lastTx?.object?.name || "Unknown"
    const lastAmountKb = FormatBytes(lastTx?.amount, 2)

    // Format the date of the last XP transaction
    const lastDate = new Date(lastTx?.createdAt || "").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    // Update the DOM with the fetched and formatted data
    container.children[0].innerHTML = totalKb
    container.children[1].innerHTML = `Last: ${lastName} (${lastDate})<br><span class="green">+${lastAmountKb}</span>`
  }
}
