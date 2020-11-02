const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

// One must be from Reu or Guate (i.e. with an index of Reu or higher on the departments array (so higher than Toto) 
// to get past the restrict middleware) (see restrict.js line 4)
// NOTE: To access the get /users endpoint in Insomnia one must copy the token displayed in the Preview from the login endpoint, 
// and paste it into the value of the Header entry of the get /users endpoint. The Header itself should be entered as Authorization. 
// (i.e. Header: Authorization Value: < token> )
router.get("/users", restrict("Reu"), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password, department } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			// hash the password with a time complexity of "14"
            password: await bcrypt.hash(password, 14),
            department
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// generate a new JSON web token
		const token = jwt.sign({
			userID: user.id,
			userDepartment: user.department, // This property comes from the database. Its equivalent in the guided project is hard-coded.
		}, process.env.JWT_SECRET)

		// res.cookie("token", token)
		res.json({
			message: `Welcome ${user.username}!`,
			token // (would be) commented out for cookie functionality (see line 66) 
			// or, < token: token >
		})
	} catch(err) {
		next(err)
	}
})

// router.get("/logout", async (req, res, next) => {
// 	try {
// 		// this will delete the session in the database and try to expire the cookie,
// 		// though it's ultimately up to the client if they delete the cookie or not.
// 		// but it becomes useless to them once the session is deleted server-side.
// 		req.session.destroy((err) => {
// 			if (err) {
// 				next(err)
// 			} else {
// 				res.status(204).end()
// 			}
// 		})
// 	} catch (err) {
// 		next(err)
// 	}
// })

module.exports = router