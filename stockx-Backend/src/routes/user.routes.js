import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, updateUser, stockInfo ,verifyOtp, getParticularStockInfo} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { preference,getAllPreferences } from "../controllers/preferences.controller.js";
const router = Router()

router.route("/register").post(
    // upload.fields([
    //     {
    //         name: "avatar",
    //         maxCount: 1
    //     },
    //     {
    //         name: "coverImage",
    //         maxCount: 1
    //     },
    // ]),
    registerUser
)
router.route("/verify").post(verifyOtp)
router.route("/login").post(loginUser)

// secured routes
router.route("/profile/:id").post(updateUser)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/getProfile").get(getUserProfile)
router.route("/getStockInfo").post(stockInfo)
router.route("/getParticularStock/:id").post(getParticularStockInfo)
router.route("/:id").post(preference);
router.route("/getAllPreferences/:id").get(getAllPreferences);
export default router