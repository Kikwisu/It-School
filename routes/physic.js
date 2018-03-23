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
            let points = " Ваш результат: " + doc.allBalls + " б";
            enter = "выйти";
            res.render('physic', {name: name, points : points, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

router.post('/', function(req, res, next) {

});

module.exports = router;