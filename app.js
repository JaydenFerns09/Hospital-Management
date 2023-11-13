const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get("/", async (req,res) => {
    res.render("landing");
});

app.get("/login", async (req,res) => {
  res.render("login");
});

app.post("/login", async (req,res) => {
  var username = _.toLower(req.body.username);
  var password = _.toLower(req.body.password);
  console.log(username + password);

  var user = await prisma.admin.findUnique({where: {username:username}});

  if (_.isEmpty(user) === true){
    var user = await prisma.staff.findUnique({where: {username:username}});
    if (_.isEmpty(user) === true){
      var user = await prisma.doctor.findUnique({where: {username:username}});
      if (_.isEmpty(user) === true){
        /* Invalid login add */
      }else{
        if(user.password == password){
            var newUser = await prisma.changeLog.create({
              data: {
                action: "Login",
                userID: user.id,
                tableName: "Doctor"
              },
            });
            res.render("home", {value:"D"});
        }
      }
    }else{
     if(user.password == password){
          var newUser = await prisma.changeLog.create({
            data: {
              action: "Login",
              userID: user.id,
              tableName: "Staff"
            },
          });
          res.render("home", {value:"S"});
      }
    }
  }else{
    if(user.password == password){
        var newUser = await prisma.changeLog.create({
          data: {
            action: "Login",
            userID: user.id,
            tableName: "Admin"
          },
        });
        res.render("admin", {value:"A"});
    }
  }
  /* Invalid password add */
});

app.get("/admin", async (req, res) => {
  res.render("admin");
})

app.get("/doctorinfo", async (req, res) => {
  res.render("doctorinfo", {val: "none"});
})

app.post("/singledocinfo", async (req, res) => {
  var docid = req.body.docid;
  // var docinfo = prisma.doctor.findUnique({where: {id: docid}});
  res.render("singledocinfo", {docinfo: docid})
})

app.listen(PORT, (req, res) => {
    console.log("Server Running on port 3000");
});