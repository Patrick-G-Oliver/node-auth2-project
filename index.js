// Project Procedures Summary:
// Step 1: installs for package-lock.json, package.json, & dependencies
// 			1) npm install 
//			2) npm init --y 
//			3) npm install nodemon --save -D 
//			4) npm install express --save
// 			5) npm install sqlite3 
// 			6) npm install knex --save 
// 			7) Add "server": "nodemon index.js", "start": "node index" properties to the "scripts" object in the package.json file.
// Step 2: Set up server in index.js.
// Step 3: Set up welcome folder with welcome-router.js file and import / integrate into index.js (to manually test setup in Insomnia).
// Step 4: Set up knexfile.js. (noting that the filename, migrations, and seeds properties on the development object 
// 			determine the file structure that will be built out as dbs, migrations, and seeds are created).
// Step 5: Set up database/config.js.
// Step 6: Set up migrations folder with: npx knex migrate:make <desired '.db3'-filename> (e.g. <recipes> will produce recipes.db3).
// Step 7: Build data table(s) in migration file created in step 6. 
// Step 8: Create .db3 data-table file by running: npx knex migrate:latest (see Step 5 for .db3 file name)
// Step 9: Check out the newly-created .db3 table on TablePlus (SQL connection) (check both 'exports.up' and 'exports.down'
// 			function expressions with npx knex migrate:latest & npx knex migrate:rollback, respectively).
// Step 10: Install bcrypt for use in the router file (< npm install bcryptjs >).
// Step 11: Set up the users folder and users-model file and write out the helper functions that will be used in the router functions.
// Step 12: Install jsonwebtoken for user in the users-router.js foler (< npm install jsonwebtoken >).
// Step 13: Set up the router to perform CRUD operations (using the helper functions from the model file(s) 
// 			and test out the endpoints on Insomnia (to register a user, log a user in, and get a list of users from the db).
// Step 14: Set up middleware folder with restrict.js file and write out restrict function within (to restrict access to get users to authorized
// 			users that are logged in). 
// Step 15: Import restrict function into users-router.js and add it to the get endpoint to restrict access to authorized users.
// Step 16: Install express-session (< npm install express-session >), and import it into the index.js file.
// Step 17: install dotenv as a dev dependency < npm install dotenv -D >
// Step 18: change server scripts object in package.json to < "server": "nodemon --require dotenv/config index.js" >
// Step 19: Create env file and add JWT secret to file. 

// users: (1) username: fulano, password: detal, department: Reu

const express = require("express")
const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")
const session = require("express-session")

const server = express()
const port = process.env.PORT || 3000

server.use(express.json())
server.use(session({
	resave: false, // avoid recreating sessions that have not changed
	saveUninitialized: false, // comply with GDPR laws for setting cookies automatically
	secret: "keep it secret, keep it safe", // cryptographically sign the cookie
}))

server.use(welcomeRouter)
server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})