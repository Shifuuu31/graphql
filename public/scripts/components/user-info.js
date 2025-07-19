// Import utilities for making GraphQL requests and handling failures
import { graphqlRequest, loadFailed } from "../tools.js"

// Define the UserInfo component
export const UserInfo = {
  // HTML template for the User Info card
  html: `
    <div class="card">
        <h3>User Info</h3>
        <div id="user-info">
          <!-- Placeholder for full name -->
          <div class="strong">Name: <p class="sub"></p></div>
          <!-- Placeholder for username -->
          <div class="strong">Username: <p class="sub"></p></div>
          <!-- Placeholder for email -->
          <div class="strong">Email: <p class="sub"></p></div>
          <!-- Placeholder for phone number -->
          <div class="strong">Phone: <p class="sub"></p></div>
        </div>
    </div>`,

  // Setup method to fetch and populate user information
  setup: async () => {
    // GraphQL query to get user login, email, and custom attributes (first name, last name, phone)
    const query = `{
      user {
        login
        email
        firstName: attrs(path:"firstName")
        lastName: attrs(path:"lastName")
        tel: attrs(path:"tel")
      }
    }`

    // Perform the GraphQL request
    const resp = await graphqlRequest(query)

    // Get the container element where user info will be rendered
    const container = document.getElementById("user-info")

    // If no response, show load failure message
    if (!resp) {
      loadFailed(container, 'User Informations')
      return
    }

    // Populate the UI with user details if available
    container.children[0].children[0].textContent = `${resp?.user[0]?.firstName} ${resp?.user[0]?.lastName}`  // Full name
    container.children[1].children[0].textContent = resp?.user[0]?.login                                       // Username
    container.children[2].children[0].textContent = resp?.user[0]?.email                                       // Email
    container.children[3].children[0].textContent = resp?.user[0]?.tel                                         // Phone number
  }
}
