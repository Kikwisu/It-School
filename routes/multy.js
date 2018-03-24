
   const express = require('express');
   const router = express.Router();

/**
 *    GET page
 **/

router.get( '/' , ( req , res ) => {

   let name = "Войдите в аккаунт!";
   let enter = "войти";

   if ( req.session.user ) {

      let login = req.session.user.login;
      let User = require( './userModel' );

      User.findOne( { login : login } )
         .then( doc => {

            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";
            res.render('multy', {name : name , points : points , enter: enter});

         });

   } else {

      res.render( 'auth' , { name : name , enter : enter } );

   }

});



router.post('/:num', function (req, res) {

   /**
    *    Query params
    **/

   let num = req.params.num
      , result = req.body.result
      , name = req.body.name;

   let firstname = name.substring( 0, name.indexOf(" ") );
   let lastname = name.substring( name.indexOf(" ") );

   /**
    *    Mass with answers
    *       Getting num-item in it
    *       And making result msg
    **/

   let msg = 'Задание выполнено неверно';

   /**
    *    Cheking query
    **/

   let User = require( './userModel' );

      User.findOne( { firstName : firstname, lastName : lastname.trim() } )
         .then( doc => {

            let allBalls = doc.allBalls
               ,multyQests = doc.multy;

            if( multyQests[num] < 1 ){
               console.log('1234');

               if ( result ) {

                  msg = "Задание выполнено верно! Вы получаете 1 балл";
                  multyQests[num]++;
                  allBalls++;
                  Update( { firstName : firstname, lastName : lastname.trim() } , { allBalls : allBalls , multy : multyQests } );

               }

            } else {

               msg = 'Вы уже выполнили задание! Ваш результат: 1б';

            }

            res.send( msg );
         });



   /**
    *    Manipulation with User model
    **/

   function Update( query, options ) {

      let User = require('./userModel');

      /**
       *    Updating user object
       **/

      User.findOneAndUpdate( query, options, ( err, docs ) => {

         console.log( `err : ${err}` );
         console.log( `docs : ${docs}` );

      });

   }

});

module.exports = router;