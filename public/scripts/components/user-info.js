
import { graphqlRequest, loadFailed} from "../tools.js"

export const UserInfo = {
    html:
        `
    <div class="card">
        <h3>User Info</h3>
        <div id="user-info">
          <div class="strong">Name: <p class="sub"></p></div>
          <div class="strong">Username: <p class="sub"></p></div>
          <div class="strong">Email: <p class="sub"></p></div>
          <div class="strong">Phone: <p class="sub"></p></div>
        </div>
    </div>`,

    setup: async () => {

        const query = `{
        user {
          login
          email
          firstName: attrs(path:"firstName")
          lastName: attrs(path:"lastName")
          tel: attrs(path:"tel")
            }
        }`
        const resp = await graphqlRequest(query)
        // console.log(resp);

        const container = document.getElementById("user-info")
        if (!resp ) {
            loadFailed(container, 'User Informations')
            return
        }
        

        container.children[0].children[0].textContent= `${resp?.user[0]?.firstName} ${resp?.user[0]?.lastName}`
        container.children[1].children[0].textContent= resp?.user[0]?.login
        container.children[2].children[0].textContent= resp?.user[0]?.email
        container.children[3].children[0].textContent= resp?.user[0]?.tel


    }
}