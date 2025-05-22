const express = require("express");
const router = express.Router();
const { login } = require('../components/Auth/login.js');
const { register } = require('../components/Auth/register');
const { upload } = require("../multer/multerConfig.js");
const { fileUpload } = require("../components//Files/fileUpload.js");
const { getdata } = require("../components/getdata.js");
const { imageUpload } = require("../components/Images/imageUpload.js");
const { uploadData } = require("../components/updateDate.js");
const { resetpassword } = require("../components/Auth/resetpassword.js");
const { registerStore } = require("../components/registerStore.js");
const { registermarket } = require("../components/registermarket.js");
const { getMarketsData } = require('../components/marketsData.js');
const { getStoresForMarket } = require('../components/getStoresForMarket');
const { getMarketImageCounts, getStoresImageByMarket } = require('../components/getStoresImageStats.js');
const { fileUploadAndUpdate } = require("../components/fileUploadAndUpdate.js");
const { getStores } = require('../components/getStores.js');

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

// Other routes
router.post('/login', login);
router.post('/register', register);
router.get('/getdata', getdata);
router.post('/updateData', uploadData);
router.post('/reset-password', resetpassword);
router.post('/register-store', registerStore);
router.post('/register-market', registermarket);
router.get('/get-markets-data', getMarketsData);
router.get('/get-stores', getStoresForMarket);
router.get('/get-stores-by-market', getStoresImageByMarket);
router.get('/get-market-image-counts', getMarketImageCounts);
router.get('/getStores', getStores);
router.post("/uploadimage", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  imageUpload(req, res);
});

module.exports = router;
