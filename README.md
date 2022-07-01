# User Authentication Backend

Description:

- A Backend system that runs using REST/RESTful APIs and consumes the APIs using Express.js to deliver a response to the client. The system is connected to mongodb database.
- The system main feature is about user authentication. User can register, login, get profile, or logout.
- there is a higher user role as admin, with the first admin inserted in the database; the admin user can view all the users in the system, or toggle other users admin role.

Requirements:

- Node.js v14.16.0+
- Express.js v4.18.1+
- Mongoose v6.4.1+
- Mongodb v5.0+

Starting The App:

- Open the terminal and navigate the folder of the project.
- Install dependencies using command "npm install" to install the packages in package.json file.
- Start the app wih command "npm start".

Note: Make sure you have Mongodb running locally before you start the app.

APIs:
All APIs in the app start with '/api/user' appended with another fragment to make the path.
These are main fragments in the app:

- '/register':
  - POST request
  - Body: { email: string, password: string}
  - Responses: [{
    status: 400,
    body: {
    errors: Object[]
    }
    condition: Invalid request body,
    },
    {
    status: 400,
    body: {
    auth: false,
    error: 'email exists',
    },
    condition: Duplicate email
    },
    {
    status: 500,
    condition: Internal Server Error
    },
    {
    status: 201,
    body: {
    success: true,
    user: User,
    },
    condition: Registered successfully
    }]
- '/login':
  - POST request
  - Body: { email: string, password: string}
  - Responses: [{
    status: 400,
    body: {
    errors: Object[]
    }
    condition: Invalid request body,
    },
    {
    status: 404,
    body: {
    error: string,
    },
    condition: Invalid user credentials
    },
    {
    status: 200,
    body: {
    isAuth: true,
    user: User,
    auth: string,
    },
    condition: Login successfully
    }]
- '/profile':
  - GET request
  - headers: { auth: string }
  - Responses: [{
    status: 401,
    body: {
    error: true,
    errorMsg: "You're not logged in",
    }
    condition: Invalid auth token ( not logged in ),
    },
    {
    status: 200,
    body: {
    isAuth: true,
    user: User,
    },
    condition: Get Profile successfully
    }]
- '/logout':
  - GET request
  - headers: { auth: string }
  - Responses: [{
    status: 401,
    body: {
    error: true,
    errorMsg: "You're not logged in",
    }
    condition: Invalid auth token ( not logged in ),
    },
    {
    status: 200,
    condition: Logout successfully
    }]
- '/all':
  - GET request
  - headers: { auth: string }
  - Responses: [{
    status: 401,
    body: {
    error: true,
    errorMsg: "You're not logged in",
    }
    condition: Invalid auth token ( not logged in ),
    },
    {
    status: 401,
    body: {
    error: "You don't have permission. Ask an admin to upgrade your role."
    }
    condition: User role doesn't have permission,
    },
    {
    status: 200,
    body: {
    users: User[]
    }
    condition: Get all users successfully
    }]
- '/:userId':
  - PATCH request
  - headers: { auth: string }
  - params: { userId: mongoId }
  - Responses: [{
    status: 401,
    body: {
    error: true,
    errorMsg: "You're not logged in",
    }
    condition: Invalid auth token ( not logged in ),
    },
    {
    status: 401,
    body: {
    error: "You don't have permission. Ask an admin to upgrade your role."
    }
    condition: User role doesn't have permission,
    },
    {
    status: 200,
    condition: toggle user admin role successfully,
    }]

# Future Improvements:

- Add service testing.
- Add mocks to controller testing.
- Add authentication refresh token after making auth token expire.
- Add separate model for roles and permission for more flexibility in bigger apps.
