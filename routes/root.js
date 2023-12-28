const express = require('express')
const router = express.Router()
const path = require('path')

// declaring routes
router.get("^/$|index(.html)?", (req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','index.html'))
})


module.exports = router