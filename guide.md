Great! Since you're starting from zero with GraphQL, here's a clear and structured path you can follow to successfully complete your project.

---

## 🚀 Step-by-Step Plan to Learn and Build Your GraphQL Profile Project

---

### ✅ Step 1: Understand the Basics of GraphQL

* **What is GraphQL?**

  * It's a query language for APIs.
  * You ask for exactly the data you need.
  * Instead of multiple endpoints (like REST), GraphQL has **one endpoint**.

🧠 **Resources**:

* [Official GraphQL Introduction](https://graphql.org/learn/)
* Watch this [3min intro video](https://www.youtube.com/watch?v=pejCoOZj2ms)

---

### ✅ Step 2: Explore the API with GraphiQL

* Open: `https://((DOMAIN))/graphiql/` (replace `((DOMAIN))` with your school’s platform)
* It's like "Postman" for GraphQL. You can:

  * Try queries
  * Explore the schema
  * See table names and relationships

Try this:

```graphql
{
  user {
    id
    login
  }
}
```

---

### ✅ Step 3: Login Page (Get JWT Token)

1. Make a `POST` request to:

```
https://((DOMAIN))/api/auth/signin
```

2. Use **Basic Auth**:

   * `Authorization: Basic base64(username:password)`
   * Example using JavaScript:

```js
const res = await fetch("https://((DOMAIN))/api/auth/signin", {
  method: "POST",
  headers: {
    Authorization: "Basic " + btoa("yourLogin:yourPassword"),
  },
});

const data = await res.json();
const jwt = data; // Store this token
```

---

### ✅ Step 4: Make Authenticated GraphQL Requests

Use the JWT to fetch your data:

```js
fetch("https://((DOMAIN))/api/graphql-engine/v1/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + yourJWTToken,
  },
  body: JSON.stringify({
    query: `
      {
        user {
          id
          login
        }
      }
    `
  }),
})
.then(res => res.json())
.then(console.log)
```

---

### ✅ Step 5: Build the UI

Use **HTML + CSS + JS** or a small frontend framework (like React or Vue if you're familiar). Your UI must include:

1. **Login Page**
2. **Profile Page**

   * Display: login, xp, grades, audits, etc.
3. **Statistics Section (SVG Graphs)**

   * At least 2 different SVG-based graphs
   * Example ideas:

     * XP per project (Bar Chart)
     * Audit success/fail ratio (Pie Chart)

---

### ✅ Step 6: SVG Graph Examples

You can create SVG elements dynamically with JS:

**Bar Chart Example**:

```html
<svg width="500" height="200">
  <rect x="10" y="50" width="40" height="150" fill="green"/>
  <rect x="60" y="100" width="40" height="100" fill="blue"/>
</svg>
```

You can also use [D3.js](https://d3js.org/) (if allowed) to make your life easier.

---

### ✅ Step 7: Host Your Project

Use any of:

* [GitHub Pages](https://pages.github.com/)
* [Netlify](https://www.netlify.com/)
* [Vercel](https://vercel.com/)

---

## 🧩 Project File Structure Example

```
/project-folder
│
├── index.html        ← Login + UI
├── style.css         ← Your CSS
├── app.js            ← All logic (login, queries, graphs)
└── assets/           ← images/icons etc.
```

---

## 📊 Must-Have GraphQL Queries

* ✅ Basic:

```graphql
{ user { id login } }
```

* ✅ Using arguments:

```graphql
{
  object(where: { id: { _eq: 42 } }) {
    name
    type
  }
}
```

* ✅ Nested:

```graphql
{
  result {
    grade
    user {
      login
    }
  }
}
```

---

## ✅ Summary Checklist

| Step                         | Done? |
| ---------------------------- | ----- |
| Learn GraphQL Basics         | ⬜     |
| Use GraphiQL to explore      | ⬜     |
| Build Login to get JWT       | ⬜     |
| Fetch and show profile data  | ⬜     |
| Create at least 2 SVG graphs | ⬜     |
| Host your project            | ⬜     |

---

Here’s a list of suggested information sections for your **Profile Dashboard** (based on your project spec), with details on:

* ✅ What to display
* 🟡 Whether it's **required** or **optional**
* 🔗 Where to query it from in GraphQL

---

## 📋 Dashboard Info List

| Section           | Info                       | Source Table                          | Required / Optional    |
| ----------------- | -------------------------- | ------------------------------------- | ---------------------- |
| **Basic Info**    | Username (login)           | `user`                                | ✅ Required             |
|                   | User ID                    | `user`                                | ✅ Required             |
| **XP Stats**      | Total XP earned            | `transaction`                         | ✅ Required             |
|                   | XP per project (for graph) | `transaction` + `object`              | ✅ Required             |
| **Grades**        | Grade for each project     | `progress` or `result`                | 🟡 Optional            |
| **Audits**        | Number of audits done      | `transaction` or `user` (audit ratio) | 🟡 Optional            |
| **Skills**        | List of skills with levels | `user_skills` (if exists)             | 🟡 Optional            |
| **Projects**      | Pass / Fail per project    | `result`                              | ✅ Required (for stats) |
| **Graph 1**       | XP over time               | `transaction`                         | ✅ Required (graph)     |
| **Graph 2**       | Pass/Fail ratio            | `result`                              | ✅ Required (graph)     |
| **JS/Go Piscine** | Attempts per exercise      | `progress`                            | 🟡 Optional            |
|                   | PASS/FAIL per quest        | `result`                              | 🟡 Optional            |

---

## 🔧 Required GraphQL Operations (Examples)

### ✅ Get current user info

```graphql
{
  user {
    id
    login
  }
}
```

### ✅ Get XP per transaction

```graphql
{
  transaction(where: {type: {_eq: "xp"}}) {
    amount
    objectId
    createdAt
  }
}
```

### ✅ Get results (grades/pass/fail)

```graphql
{
  result {
    grade
    object {
      name
      type
    }
  }
}
```

---

## 🛠️ Summary

To pass the project:

* ✅ Show login-based profile info (JWT)
* ✅ Display at least **3 profile data sections**
* ✅ Include **2 SVG graphs**
* ✅ Use **normal**, **nested**, and **argument-based** GraphQL queries
