var express = require("express");
var fileupload = require("express-fileupload");
var mysql=require("Mysql");
var app = express();


app.listen(2004, function () {
  console.log("server started");
});

//.....................................

app.use(express.static("public"));

app.get("/",function(req,resp)
  {
    var fullPath=__dirname+"/adminpanel.html";
    resp.sendFile(fullPath);
 })

app.get("/user",function(req,resp)
{
    var path=process.cwd()+"/admin-all-users.html";
    resp.sendFile(path);

})

app.get("/idea",function(req,resp)
{
    var path=process.cwd()+"/admin-ideas-controller.html";
    resp.sendFile(path);

})

var confrig={
  host: "localhost",
  user:"root",
  password:"",
  database:"project"
  
  }
  var dbctrl=mysql.createConnection(confrig);
  dbctrl.connect(function(err){
      if(err)
          console.log(err);
       else
          console.log("Database connected ");
  })




//==============user admin======
app.get("/jsonfetch",function(req,resp)
{
   
    dbctrl.query("select * from users",function(err,result)
    {
        if(err)
            resp.send(err.toString());
        else
                {
                    console.log(result)            ;
                 resp.send(result);
                }
                    
    })
})

app.get("/ajaxdelete",function(req,resp){
    var email=req.query.email;
    dbctrl.query("delete from users where email=?",[email],function(err,result)
    {
            if(err)
                resp.send(err);
                else
                if(result.affectedRows==0)
                    resp.send("Invalid Emailid");
                    else
                    resp.send("Record Deleted");
                    
    })
} )



//==============idea admin ======
app.get("/jsonfetchidea",function(req,resp)
{
   
    dbctrl.query("select * from ideas",function(err,result)
    {
        if(err)
            resp.send(err.toString());
        else
                {
                    console.log(result)            ;
                 resp.send(result);
                }
                    
    })
})

app.get("/ajaxdeleteidea",function(req,resp){
    var email=req.query.email;
    dbctrl.query("delete from ideas where email=?",[email],function(err,result)
    {
            if(err)
                resp.send(err);
                else
                if(result.affectedRows==0)
                    resp.send("Invalid Emailid");
                    else
                    resp.send("Record Deleted");
                    
    })
} )





