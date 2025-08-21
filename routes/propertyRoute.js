const router = require("express").Router();

const { getProperties } = require("../controllers/propertyController");

router.get("/all-property", getProperties);

module.exports = router;
