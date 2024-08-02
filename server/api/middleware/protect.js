const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
dotenv.config();
const UserModel = mongoose.model("userModel")


module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(406).json({ error: "user not logged In" })
    }
    // const token = authorization.replace("Bearer ","");
    const token = authorization && authorization.split(' ')[1];
    // console.log(key,token);
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        // console.log(error);
        if (error) {
            return res.status(407).json({ error: "user not is no logged In" })
        }
        const { _id } = payload;
        try {
            const dbUser = await UserModel.findById(_id);
            if (dbUser) {
                req.user = dbUser;
                
                next();
            } else {
                return res.status(408).json({ error: "User not Found" })
            }
        } catch (error) {
            console.log(error);
        }
    })
}