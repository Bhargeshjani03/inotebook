var jwt = require("jsonwebtoken");
const JWT_SECRET = "BhargeshJani";
const fetchuser=(req,res,next)=>{
    //get the user from JWT token and append id to request
    const token= req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error: "Please authenticate using JWT token"});

    }
    try {
        const data=jwt.verify(token,JWT_SECRET); 
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send("Error: Please authenticate using JWT token");
    }
   
}
module.exports=fetchuser;