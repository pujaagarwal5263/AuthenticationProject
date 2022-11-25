import Express from "express";
const bodyParser=require("body-parser");
var cookieParser=require("cookie-parser");

const {login}  = require("../controllers/login");
const {logout} = require("../controllers/logout");
const {signup} = require("../controllers/signup");
const {cache} = require("../controllers/cache")
const {tokenVerify} = require("../controllers/verify-token");

const {upload} =require("../middlewares/upload");
const {authenticate} =require("../middlewares/authenticate");


var router = Express.Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(cookieParser());

router.post("/login",login);
router.post("/signup",upload,signup);
router.post("/verify-token",authenticate,tokenVerify);
router.get ("/cache/:email", cache)
router.get("/logout",logout);

module.exports = router;