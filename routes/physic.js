const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   let name = "Войдите в аккаунт!";
   let enter = "войти";
   if(req.session.user){
      let login = req.session.user.login;
      let User = require('./userModel');
      User.findOne({login: login})
         .then(function(doc){
            name = doc.firstName + " " + doc.lastName;
            enter = "выйти";
            res.render('physic', {name: name, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

router.post('/', function(req, res, next) {

});

module.exports = router;