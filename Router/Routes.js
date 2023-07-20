import { Router } from "express";
import * as controller from "../controller/controller.js"
import { localvariable } from "../middleware/auth.js";
const router = Router();


router.route('/signup').post(controller.Signup);
router.route('/login').post(controller.Login);

router.route('/generateOTP').get(localvariable,controller.GenerateOTP);
router.route('/sendmail').post(controller.GenerateOTP,controller.SendMail);
router.route("/VerifyOTP").put(controller.VerifyOTP);
router.route('/ResetPassword').put(controller.RestPassword);

router.route('/addquote').post(controller.addQuote);
router.route('/updateUserName').put(controller.updateUserName);

router.route('/getUserName').get(controller.givedata);
router.route('/getQuotes').get(controller.givequote);

router.route('/addbunch').post(controller.addbunch);


router.route('/selectuser').get(controller.selectuser);
router.route('/selectQuotes').get(controller.selectuser,controller.selectQuotes);

router.route('/givetohome').get(controller.giveToHome);

router.route('/sendUserData').get(controller.sendUserData);

export default router;