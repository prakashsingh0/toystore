const express = require('express')
const router = express.Router()
const {Login, Register,getMyProfile,  profileUpdate } = require('../controller/user_controller')
const {addtoy, gettoy, deletetoy, updatetoy,  toyFindByName} = require('../controller/toy')
const auth = require('../middleware/protect')
router.route("/login").post(Login)
router.route("/register").post(Register)
router.route("/profileupdate").put(auth,profileUpdate)

router.route("/getmyprofile").get(auth,getMyProfile)
router.route("/toy").post(auth,addtoy)
router.route("/gettoy").get(auth,gettoy)
router.route("/deletetoy/:id").delete(auth,deletetoy)
router.route("/updatetoy/:toyid").put(auth,updatetoy)
router.route("/find/:name").get(auth, toyFindByName);




module.exports = router;