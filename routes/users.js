const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect("mongodb://localhost:27017/usersDBSchool");

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
            res.render('auth', {name: name, points : points, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

router.post('/', function(req, res, next) {
   if( req.body.exit ){
      delete req.session.user;
      return res.send("Вы вышли из своего аккаунта!");
   }
   if(req.session.user)
      return res.send("Вы уже вошли в свой аккаунт!");

   let User = require('./userModel');
   let login = req.body.login;
   let name = req.body.firstName;
   let surname = req.body.lastName;
   let password = req.body.password;

   const hash = crypto.createHash('sha256');
   password = hash.update(password).digest('hex');

    // User.remove({ login: 'Kikwisu' }, function (err) {
    //    if (err) return handleError(err);
    // });

   //for login only

    User.findOne({login: login})
       .then(function(doc){
          console.log(doc);
          if(doc === null)
             return res.send("Неправильный логин или пароль!");

          if(doc.password === password){
             req.session.user = { login: doc.login };
             return res.send("Вы успешно вошли в свой аккаунт");
          }
          else
             return res.send("Неправильный логин или пароль!");
       })
       .catch(function (err){
          console.log(err);
       });


   // for registration

    /*User.findOne({login: login})
       .then(function(doc){
          if(doc === null){
             console.log("doc is null");
             req.session.user = { login: login };
             let user = new User({
                login: login,
                firstName: name,
                password: password,
                lastName: surname,
                allBalls: 0,
                net: [ 0, 0, 0, 0 ],
                checNet: [ 0, 0, 0, 0 ],
                physic: [ 0, 0, 0 ],
                checPhysic: [ 0, 0, 0 ],
                roboto: [ 0, 0, 0 ],
                checRoboto: [ 0, 0, 0 ]
             });
             console.log(user);
             user.save()
                .then(function(){
                   console.log("Вы успешно зарегистрировались!");
                   return res.send("Вы успешно зарегистрировались!");
                })
                .catch(function (err){
                   console.log(err);
                });
          }
          else
          {
             console.log("Вы ne зарегистрировались!");
             return res.send("Данный логин уже занят!");
          }
       });*/
});






module.exports = router;
