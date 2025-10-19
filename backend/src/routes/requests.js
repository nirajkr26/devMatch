const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");

router.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    try{

        res.send("sending a connection request")
    }catch(err){
        res.send(err.message);
    }
})





module.exports = router;