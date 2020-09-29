const router = require("express").Router();
const db = require("../database/connection.js");

const Users = require("./users-model.js");
const {restrict} = require("../auth/restricted-middleware.js");

router.get("/", restrict("admin"), (req, res) => {
  // res.status(200).json({message:"wwaaay"})
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

router.get("/user/:id", restrict("admin"), async(req,res,next)=>{
  const {id}=req.params
  // res.status(200).json({message:"hoorai"})
  try{
const user= await Users.fetchByID(id)

res.json(user)
  }catch(err){
      next(err)
  }
})


router.put('/user/:id', restrict("admin"), (req, res) => {
  // do your magic!
  // console.log("req-->", req) //<--really long details
  Users.update(req.params.id, req.body)
  .then((user)=>{
    if(user){
      res.status(200).json(user)
    }else{
      res.status(404).json({message: "the user could not be found"})
    }
  })
  .catch(err=>next(next))
});


router.post('/:id/posts', restrict("admin"), (req, res) => {
  // do your magic!
  // console.log("..waiting to post")
  // res.status(210).json({message: "WAITING TO POST"});
  const postInfo = { ...req.body, user_id: req.params.id };

  Users.addClient(postInfo)
  // res.status(210).json({message: "wait"});

  .then(post => {
    console.log("POST->", post)
    res.status(210).json(post);
  })
  .catch(err=>next(err));
});

router.get('/:id/posts', restrict("admin"), async(req, res, next) => {
  try{
    const posts = await Users.fetchClientByID(req.params.id)

    res.status(200).json(posts)
  }
catch(err){next(err)}
});




module.exports = router;

