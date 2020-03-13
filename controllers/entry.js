const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const moment = require("moment");

const upload = multer({ dest: "public/uploads" });
const EntryModel = require("../models/Entry");

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", (req, res) => {
  EntryModel.find({})
    .sort({ date: -1 })
    .exec((err, entriesDb) => {
      if (err) {
        console.log("Get entries db error", err);
        return;
      }

      const cloudinaryOpts = {
        resource_type: "video",
        format: "mp4"
      };

      const entries = entriesDb.map(entryDb => {
        const entry = entryDb.toObject();
        const opts = entry.isVideo ? cloudinaryOpts : {};
        entry.fmtDate = moment(entry.date).format("DD/MM/YYYY");
        entry.src = cloudinary.url(entry.cloudinaryPublicId, opts);
        return entry;
      });
      res.render("home", {
        page: {
          title: "Home"
        },
        entries
      });
    });
});

router.get("/upload", loggedIn, (req, res) => {
  res.render("form");
});
router.post("/upload", loggedIn, upload.single("video"), (req, res) => {
  //   console.log("req.file", req.file);
  //   console.log("req.body", req.body);

  const isVideo = req.file.mimetype.substr(0, 5) === "video";

  const cloudinaryOpts = {
    resource_type: isVideo ? "video" : "image"
  };
  cloudinary.uploader.upload(
    req.file.path,
    cloudinaryOpts,
    (err, imageResult) => {
      if (err) {
        console.log("Cloudinary upload err", err);
        return;
      }
      //   console.log("imageResult", imageResult);
      const date = req.body.date || null;
      const entry = new EntryModel({
        date,
        isVideo,
        cloudinaryPublicId: imageResult.public_id
      });
      entry.save((err, entryDb) => {
        if (err) {
          console.log("Saving entry in DB error", err);
          return;
        }
        res.render("upload");
      });
    }
  );
});

module.exports = router;
