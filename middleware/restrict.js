const jwt = require("jsonwebtoken")

function restrict(role) {
	const roles = ["basic", "admin", "super_admin"]

	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			// assume the token gets passed to the API as an "Authorization" header
			const token = req.headers.authorization

			// token is now coming from the client's cookie jar, in the "Cookie" header
			//const token = req.cookies.token
			if (!token) {
				return res.status(401).json(authError)
			}

			// decode the token, re-sign the payload, and check if signature is valid
			jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
				if (err) {
					return res.status(401).json(authError)
				}

				// One must be an admin or super-admin to gain access.
				if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
					return res.status(403).json({
						message: "You are not allowed here.",
					})
				}

				// We know that the user is authorized at this point.
				// Make the token's payload available to other middleware functions
				req.token = decoded 

				next()
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict