const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = "veryStrongSecret"


const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if(!token){
            throw new Error("invalid token")
        }
        console.log(token)
        const decoded = jwt.verify(token, secret);

        const { _id } = decoded;

        const user = await User.findById(_id);

        if (!user) {
            throw new Error("user not found");
        }

        req.user = user
        next();
    }catch(err){
        res.status(404).send(err.message)
    }

}

module.exports = {
    userAuth
}

