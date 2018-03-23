window.onload = function () {

   //redirects

   $("#logo").click(function () {
      location.href = "/";
   });

   $("#enter").click(function () {
      if(document.getElementById("enter").firstChild.innerHTML === "выйти"){
         $.ajax({
            type: "POST",
            url: "/users",
            data: "exit=true",
            success: function(msg){
               alert( msg );
            }
         });
      }
      location.href = "/users";
   });

   $(".section").click(function (e) {
      location.href = "/" + e.target.id;
   });

   $(".name").click(function (e) {
      location.href = "/stats" ;
   });

   //submitting

   $(`form`).submit(function(e){
      e.preventDefault();

      if($(this).data('formstatus') !== 'submitting'){
         let form = $(this),
            formUrl = form.attr('action'),
            formMethod = form.attr('method');



         let formData = new FormData(document.getElementById(e.target.id));
         let formData2 = form.serialize();

         if(e.target.id === "auth"){
            $.ajax({
               url: formUrl,
               type: formMethod,
               data: formData2,
               success: formSuccessAuth
            });
         }else{
            $.ajax({
               url: formUrl,
               type: formMethod,
               data: formData,
               contentType: false,
               processData: false,
               success: formSuccess
            });
         }


      }
      return false;
   });

   function formSuccessAuth(data) {
       let form = document.getElementById('auth');
       for(let i = 0; i < form.elements.length - 1; i++){
          form.elements[i].value = "";
       }
       if(data === "Вы успешно вошли в свой аккаунт")
          location.href = "/";
      alert(data);
   }

   function formSuccess(data) {
      alert(data);
   }

   // checking indicators of sensors in net-tasks

   $('#quest2').click(function () {
      let user = document.getElementsByClassName('name')[0].innerHTML;
      let dataObject = { "name" : user };
      $.ajax({
         url: 'http://localhost:3000/ping',
         type: 'POST',
         dataType: "json",
         data: dataObject,
         success: function (data) {
               alert(data.result);
         }
      });
   });

   $('#physicCheck').click(function () {
      let user = document.getElementsByClassName('name')[0].innerHTML;
      let dataObject = { "name" : user };
      $.ajax({
         url: 'http://localhost:3000/physic',
         type: 'POST',
         dataType: "json",
         data: dataObject,
         success: function (data) {
            alert(data.result);
         }
      });
   });

};