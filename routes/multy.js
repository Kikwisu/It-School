const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const md5File = require('md5-file/promise');
const  lineReader = require('line-reader');

/* GET home page. */
router.get('/', function(req, res) {
   let name = "Войдите в аккаунт!";
   let enter = "войти";
   if(req.session.user){
      let login = req.session.user.login;
      let User = require('./userModel');
      User.findOne({login: login})
         .then(function(doc){
            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";
            res.render('multy', {name: name,  points : points, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

router.post('/', function (req, res) {
   let form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
      if(err) return res.send('kek(((');
      console.log('fields:');
      console.log(fields);
      console.log('files:');
      console.log(files.file.path);
      md5File(files.file.path).then(hash => {
         md5File( __dirname + "/data/check.txt" ).then(check =>{
            console.log(`The MD5 sum of LICENSE.md is: ${hash} ${check}`);
         });
      });

      let testLine = "abcd";

      lineReader.eachLine(files.file.path, (line) => {
         console.log(line);
         if(line === testLine)
            return false;
      });

      res.send('kek');
   })
});

module.exports = router;