const express = require('express');
const router = express.Router();

/**
 *    GET net page
 **/

router.get( '/', ( req, res ) => {

   let name = "Войдите в аккаунт!";
   let enter = "войти";

   if(req.session.user){

      let login = req.session.user.login;
      let User = require('./userModel' );

      User.findOne( { login : login } )
         .then(function(doc){

            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";

            res.render( 'physic', { name : name , points : points , enter: enter } );

         });
   }else{

      res.render( 'auth', { name : name, enter : enter } );

   }

});

function Update(query, options) {

   let User = require('./userModel');

   /**
    *    Updating user object
    **/

   User.findOneAndUpdate(query, options, (err, docs) => {

      console.log( `err : ${err}`);
      console.log( `docs : ${docs}`);

   });

}

router.post( '/',  ( req , res ) => {

   let User = require('./userModel');
   let msg = 'Вы уже выполнили задание! Ваш результат: ';

   /**
    *    Username and number of question
    **/

   let name = req.body.name;

   /**
    *    Parsing name to first and second name
    **/

   let firstname = name.substring(0, name.indexOf(" "));
   let lastname = name.substring(name.indexOf(" "));

   User.findOne({ firstName : firstname, lastName : lastname.trim() })
      .then( doc => {

         /**
          *    Checking params
          **/

         let physicQests = doc.physic
            , allBalls = doc.allBalls
            , checPhysic = doc.checPhysic;

         if ( checPhysic[1] < 2 ) {

            msg = "Задание выполнено неверно!";

            if ( req.body.result ) {

               msg = "Задание выполнено верно! Вы получаете 1 балл";
               physicQests[0] = 1;
               checPhysic[0]++;
               allBalls++;

            }

            checPhysic[0]++;

            /**
             *    Function updating user object
             **/

            Update({ firstName : firstname, lastName : lastname.trim() }, { allBalls : allBalls, physic : physicQests, checPhysic : checPhysic });

         } else {

            msg += physicQests[1] + "б.";

         }

         res.send( msg )

      });
});

module.exports = router;