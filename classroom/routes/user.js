const express = require("express");
const router = express.Router();

//Index Routes
router.get("/", (req, res) => {
    res.send("GET for users");
});

//Show users
router.get("/:id", (req, res) => {
    res.send("GET fo user id");
});

//POST users
router.post("/", (req, res) => {
    res.send("POST for users");
});

//DELETE Users
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
});

module.exports = router;