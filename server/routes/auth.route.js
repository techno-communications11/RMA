const express = require("express");
const router = express.Router();
const { login } = require("../components/Auth/login");
const { register } = require("../components/Auth/register");
const { upload } = require("../multer/multerConfig");
const { fileUpload } = require("../components/Files/fileUpload");
const { getdata } = require("../components/getdata");
const { getxbmdata } = require("../components/getxbmdata");
const { imageUpload } = require("../components/images/imageUpload");
const { uploadData } = require("../components/updateDate");
const { resetpassword } = require("../components/Auth/resetpassword");
const { registerStore } = require("../components/registerStore");
const { registermarket } = require("../components/registermarket");
const { getMarketsData } = require("../components/marketsData");
const { getStoresForMarket } = require("../components/getStoresForMarket");
const {
  getMarketImageCounts,
  getStoresImageByMarket,
} = require("../components/getStoresImageStats");
const { fileUploadAndUpdate } = require("../components/fileUploadAndUpdate");
const { getStores } = require("../components/getStores");
const { getusers } = require("../components/Auth/getusers"); // Verify this import
const authenticate = require("../Middleware/authMiddleware"); // Verify this import
const { gettradeindata } = require("../components/gettradeindata"); // Verify this import
const { userUploadedImage } = require("../components/Images/userUploadedImage"); // Verify this import

// Public routes
router.post("/login", login);
router.get("/user/me", authenticate, getusers); // Ensure getusers is defined
router.post("/register", authenticate, register);
router.post("/reset-password", resetpassword);

// Protected routes
router.post("/uploaddata", authenticate, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  fileUpload(req, res);
});

router.post(
  "/uploaddata-details",
  authenticate,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    fileUploadAndUpdate(req, res);
  }
);

router.get("/getdata", authenticate, getdata);
router.get("/getxbmdata", authenticate, getxbmdata);
router.get("/gettradeindata", authenticate, gettradeindata);
router.post("/fileUpload", authenticate, upload.single("file"), fileUpload);
router.post("/updateData", authenticate, uploadData);
router.post("/register-store", authenticate, registerStore);
router.post("/register-market", authenticate, registermarket);
router.get("/get-markets-data/:TableName", authenticate, getMarketsData);
router.get("/get-stores", authenticate, getStoresForMarket);
router.get("/get-stores-image-by-market", authenticate, getStoresImageByMarket);
router.get(
  "/get-market-image-counts/:TableName",
  authenticate,
  getMarketImageCounts
);
router.get("/getstores", authenticate, getStores);
router.get("/useruploadedimage/:showntid", authenticate, userUploadedImage);
router.post(
  "/imageUpload",
  authenticate,
  upload.fields([
    { name: "image_1", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
    { name: "image_4", maxCount: 1 },
    { name: "csv", maxCount: 1 },
  ]),
  imageUpload
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
