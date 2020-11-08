// Project Procedural Summary:

// Step 1: installs for package-lock.json, package.json, & dependencies
// 			1) npm install 
//			2) npm init --y 					(It appears that the --y flag adds unnecessary boilerplate to package.json.)
//			3) npm install nodemon --save -D 	(-D flag = devDependency)
//			4) npm install express --save
// 			5) npm install sqlite3 
// 			6) npm install knex --save 
// 			7) Add "server": "nodemon index.js", "start": "node index" properties to the "scripts" object in the package.json file.

// 			ADDITIONAL DEPENDENCIES THAT ALLOW FOR THE IMPLEMENTATION OF WEB TOKENS :
// 			8) npm install bcryptjs 
// 			9) npm install jsonwebtoken
// 			10) npm install express-session
// 			11) npm install dotenv -D			(-D flag = devDependency)

// Step 2: Set up server in index.js.

// Step 3: Set up welcome folder with welcome-router.js file and import / integrate into index.js (to manually test setup in Insomnia).

// Step 4: Set up knexfile.js. (noting that the filename, migrations, and seeds properties on the development object 
// 			determine the file structure and file names that will be built out as dbs, migrations, and seeds are created).

// Step 5: Set up database folder and database/config.js file.

// Step 6: Set up migrations folder with: npx knex migrate:make <desired '.db3'-filename> (e.g. <recipes> will produce recipes.db3).

// Step 7: Build data table(s) in migration file created in step 6. 

// Step 8: Create .db3 data-table file by running: npx knex migrate:latest (see Step 4 for .db3 file name)

// Step 9: Check out the newly-created .db3 table on TablePlus (SQL connection) (check both 'exports.up' and 'exports.down'
// 			function expressions with < npx knex migrate:latest > & < npx knex migrate:rollback >, respectively).

// Step 10: Install bcrypt for use in the router file (< npm install bcryptjs >).

// Step 11: Set up the users folder and users-model file and write out the helper functions that will be used in the router functions.

// Step 12: Install jsonwebtoken for user in the users-router.js foler (< npm install jsonwebtoken >).

// Step 13: Set up the router to perform CRUD operations (using the helper functions from the model file(s)) to register a user, 
//			log a user in, and get a list of users from the db. Don't forget to import the router to index.js, 

// Step 14: Import jsonwebtoken into users-router.js (line 3) file (< const jwt = require("jsonwebtoken") >) and set up login endpoint to 
// 			generate a token when the user logs in (see lines 61-72). 

// Step 15: Create a .env file and add a JWT_SECRET to it (for use in the token portion of the login endpoint in users-router.js, line 65: 
// 			the second argument to the jwt.sign() method). 

// Step 16: Change server scripts object in package.json to < "server": "nodemon --require dotenv/config index.js" >

// Step 17: Test out the endpoints on Insomnia (to register a user, log a user in, and get a list of users from the db).

// Step 18: Set up middleware folder with restrict.js file and write out restrict function within (to restrict access to the "get /users" 
// 			endpoint to only allow access to authorized users that are logged in). 

// Step 19: Import restrict function into users-router.js (see line 5) and add it to the get endpoint (see line 9)
//			to restrict access to authorized users. (In this case, the authorization is restricted according to department of residence. 
// 			Users from Toto are not allowed access, while users from Reu and Guate are allowed access.)

// Step 20: Import express-session into the index.js file and implement server.user(session...) call. (see inde.js, lines 73 & 79-83)

// Inidividual tokens can be decoded/inspected at < https://jwt.io/#debugger-io >.

// users in database / db3 file: 	(1) username: fulano, password: detal, department: Reu
// 								 	(2) username: fulana, password: detaltambien, department: Toto
// 								 	(2) username: juandoe, password: detallito, department: Guate


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

// generic, "end-of-the-line / catch-all" error handler
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})