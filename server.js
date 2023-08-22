var express=require("express");
var mysql=require("Mysql");
var app=express();
var fileupload = require("express-fileupload");


app.listen(8080,function()
{
    console.log("server connected at port 8080");
})
app.use(express.static("public"));

app.get("/",function(req,resp)
{
    var fullpath=__dirname+"/index.html";
    resp.sendFile(fullpath);
})

app.get("/",function(req,resp)
{
    var fullpath=__dirname+"/pitcher_profile.html";
    resp.sendFile(fullpath);
})
app.get("/",function(req,resp)
{
    var fullpath=__dirname+"/find-pitcher.html";
    resp.sendFile(fullpath);
})
app.get("/",function(req,resp)
{
    var fullpath=__dirname+"/invester_profile.html";
    resp.sendFile(fullpath);
})



// DATABASE LINKING ..................................
var confrig={
    host: "localhost",
    user:"root",
    password:"",
    database:"shark_tank"
    
    }
    var dbctrl=mysql.createConnection(confrig);
    dbctrl.connect(function(err){
        if(err)
            console.log(err);
         else
            console.log("Database connected ");
    })


// SEND DATA FROM PITCHER_PROFILE.....................................    
app.use(fileupload());
app.post("/submit", function (req, resp) {
  console.log(req.body);
  var name= req.body.username;
  var email = req.body.email;
  var phone =req.body.phone;
  var address = req.body.address;
  var city = req.body.city;
  var site = req.body.site;
  var companyname = req.body.companyname;
  var info = req.body.info;


  var picProfile= req.files.profilepic.name;
  var picID= req.files.idproof.name;

  var des=__dirname+"/public/uploaded/"+picProfile;
  var des=__dirname+"/public/uploaded/"+picID;

  req.files.profilepic.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" Profile Uploaded ");
  });

  req.files.idproof.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" ID Uploaded ");
  });

 var array=[name,email,phone,address,city,site,companyname,info,picProfile,picID];
 dbctrl.query("insert into profile_pitcher values(?,?,?,?,?,?,?,?,?,?)",array,function(err){
         if(err)
             resp.send(err);
             else
             resp.send("Record Saved ");
 })
 });

// FETCH DATA USING JSON FROM PITCHER_PROFILE.............................................
 app.get("/jsonFechRecord",function(req,resp)
{
    var em=req.query.email;
    dbctrl.query("select * from profile_pitcher where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
                {
                    console.log(result);
                 resp.send(result);
                }
    })
})

// UPDATE DATA IN PITCHER_PROFILE....................................
app.post("/update",function(req,resp)
{
  var name= req.body.username;
  var email = req.body.email;
  var phone =req.body.phone;
  var address = req.body.address;
  var city = req.body.city;
  var site = req.body.site;
  var companyname = req.body.companyname;
  var info = req.body.info;
  var picProfile= req.files.profilepic.name;
  var picID= req.files.idproof.name;

  var des=__dirname+"/public/uploaded/"+picProfile;
  var des=__dirname+"/public/uploaded/"+picID;

  req.files.profilepic.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" Profile Updated ");
  });

  req.files.idproof.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" ID Updated");
  });


  var array=[name,phone,address,city,site,companyname,info,picProfile,picID,email];
  dbctrl.query("update profile_pitcher set name=?,phone=?,address=?,city=?,site=?,companyname=?,info=?,picProfile=?,picID=? where email=?",array,function(err)
    {
      if(err)
      console.log(err);
      else
      resp.send("Record updated");
  })
})




// TABLE ENTRY FROM SIGNUP MODAL......................
app.get("/ajaxemail",function(req,resp)
{
    console.log(req.query);
    var em=req.query.emailid;
    var password=req.query.pwd;
    var type=req.query.type;
    var ary=[em,password,type];
    dbctrl.query("insert into users values(?,?,?)",ary,function(err)
    {
        if(err)
        {
        console.log(err);
        resp.send(err);
        }
        else
        resp.send("record insert successfully");
    })


})

// LOGIN USING TABLE DETAILS....................................
app.get("/ajaxlogin",function(req,resp)
{
    console.log("connected to login");
    var em=req.query.emailid;
    var password=req.query.pwd;
    console.log(req.query);
   
    dbctrl.query("select * from users where email=? and password=?",[em,password],function(err,result)
    {
        if(err)
        console.log(err);
        else
        resp.send(result);
    })

})

// SETTINGS TO CHNGE PWD.............................................
app.get("/ajaxchange",function(req,resp)
{
    var em=req.query.emailid;
    var opassword=req.query.pwd;
    var npassword=req.query.npwd;
    var ary=[npassword,em,opassword];
    dbctrl.query("update users set password=? where email=? and password=?",ary,function(err)
    {
        if(err)
        {
        console.log(err);
        resp.send(err);
        }
        else
        {
        resp.send("changed successfully");
        console.log("changed successfully");
        }
    })


})

// SAVE PITCHER_IDEA IN TABLE ...................................................

app.post("/saveidea", function (req, resp) {
    console.log(req.body);
    var email = req.body.email;
    var category = req.body.category;
    var idea = req.body.ideatitle;
    var work = req.body.working;
    var income = req.body.presentincome;
    var fund = req.body.fund;
    var year = req.body.year;
    var investment= req.body.investmentrequired;
    var share = req.body.shareholder;
    var info = req.body.info;
  
   var array=[email,category,idea,work,income,fund,year,investment,share,info];
   dbctrl.query("insert into ideas values(?,?,?,?,?,?,?,?,?,?)",array,function(err){
           if(err)
               resp.send(err);
               else
               resp.send(" Saved Successfully");
   })
   });


//...........find pitcher................................
   
   app.get("/jsonFechTitle",function(req,resp){
    var ca=req.query.category;
    dbctrl.query("select title from ideas where category=?",[ca],function(err,result){
        if(err)
        resp.send(err);

        else{
            console.log(result);
            resp.send(result);
        }
    })
})

app.get("/jsonFechDet",function(req,resp){
    var ca=req.query.category;
    var ti=req.query.title;

    var ary=[ca,ti];

    dbctrl.query("select *  from ideas where category=? and title=?",ary,function(err,result){
        if(err)
        resp.send(err);

        else{
            console.log(result);
            resp.send(result);
        }
    })
})

app.get("/jsonFechCate",function(req,resp){
    var ca=req.query.category;
    dbctrl.query("select distinct category from ideas",[ca],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })
})
//jsonFechAll
app.get("/jsonFechAll",function(req,resp){
    var ca=req.query.category;
    console.log(ca);
    dbctrl.query("select * from ideas where category=?",[ca],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })
})

app.get("/jsonFetchPitcher",function(req,resp){
    var em=req.query.email;
    dbctrl.query("select * from profile_pitcher where email=?",[em],function(err,result){
        if(err)
            resp.send(err);
        else{
            console.log(result);
            resp.send(result);
        }
    })
})

//__________________INVESTOR PROFILE_________________________________________
//SEND DATA ..............

app.post("/save", function (req,resp) {
  console.log("connected");
  var email = req.body.email;
  var name= req.body.username;
  var address = req.body.address;
  var city = req.body.city;
  var category = req.body.category;
  var contact =req.body.contact;
  var companyname = req.body.companyname;
  var turnover= req.body.turnover;
  var investment = req.body.investment;
  var info = req.body.info;

  var picProfile= req.files.profilepic.name;
  var des=__dirname+"/public/uploaded/"+picProfile;

  req.files.profilepic.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" Profile Uploaded ");
  });

 var array=[email,name,address,city,category,contact,companyname,turnover,investment,picProfile,info];
 dbctrl.query("insert into profile_invester values(?,?,?,?,?,?,?,?,?,?,?)",array,function(err){
    if (err) {
        resp.send(err);
    }
    else
        resp.send("saved successfully");
  })
 });


 
// FETCH DATA USING JSON FROM INVESTOR_PROFILE.............................................
app.get("/jsonFechRecordI",function(req,resp)
{
    var em=req.query.email;
    dbctrl.query("select * from profile_invester where email=?",[em],function(err,result)
    {
            if(err)
            resp.send(err.toString());
            else
                {
                    console.log(result);
                 resp.send(result);
                }
    })
})


// UPDATE DATA IN INVESTER_PROFILE....................................
app.post("/change",function(req,resp)
{ 
      console.log(req.body);
    var email = req.body.email;
    var name= req.body.username;
    var address = req.body.address;
    var city = req.body.city;
    var category = req.body.category;
    var contact =req.body.contact;
    var companyname = req.body.companyname;
    var turnover= req.body.turnover;
    var investment = req.body.investment;
    var info = req.body.info;
  
    var picProfile= req.files.profilepic.name;
    var des=__dirname+"/public/uploaded/"+picProfile;

  req.files.profilepic.mv(des,function(err)
  {
          if(err)
              console.log(err);
          else
              console.log(" Profile Updated ");
  });

  var array=[name,address,city,category,contact,companyname,turnover,investment,picProfile,info,email];
  dbctrl.query("update profile_invester set name=?,address=?,city=?,category=?,contact=?,companyname=?,turnover=?,investment=?,picProfile=?,info=? where email=?",array,function(err)
    {
      if(err)
      console.log(err);
      else
      resp.send("Record updated");
  })
})


