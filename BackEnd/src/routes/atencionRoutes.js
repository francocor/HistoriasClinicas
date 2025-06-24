const express = require("express");
const router = express.Router();
const { editarAtencion} = require("../controllers/atencionController");

router.put("/:id", editarAtencion);



module.exports = router;