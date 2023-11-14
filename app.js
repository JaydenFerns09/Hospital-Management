const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Global Variables
var loginDetails

// Uploading images to cloudinary
const uploadImage = async (imagePath, customPublicId) => {
  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: customPublicId, // Set custom public_id here
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

// dummy input
// const mainFunction = async () => {
//   imagePath='https://media.licdn.com/dms/image/D5603AQEOsILuyNSoMw/profile-displayphoto-shrink_800_800/0/1699870746416?e=1705536000&v=beta&t=e30Gc5kQj7jBq7H4-nQDevf1cIhoKHCFAml2VE9wdbI'
//   customPublicId='admin'
//   const publicId = await uploadImage(imagePath,customPublicId);
//   console.log('Image uploaded with public ID:', publicId);
// };
// mainFunction();

// Retreiving images from cloudinary
const cloudinaryUrl = (cloudName, publicId, format) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.${format}`;
// Example usage
// const cloudName = process.env.CLOUD_NAME;
// const publicId = 'Admin';
// const format = 'jpg'; // or any other format

// const imageUrl = cloudinaryUrl(cloudName, publicId, format);

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
            loginDetails = user;
            res.render("home", {data : user});
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
          loginDetails = user;
          res.render("home", {data : user});
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
        loginDetails = user;
        res.render("admin", {data : user});
    }
  }
  /* Invalid password add */
});

app.get("/admin", async (req, res) => {
  res.render("admin", {data: loginDetails});
})

app.post("/changeadmindetails", async (req, res) => {
  var id = req.body.id;
  var Fname = req.body.Fname;
  var Mname = req.body.Mname;
  var Lname = req.body.Lname;
  var username = req.body.username;
  var password = req.body.password;
  var dob = req.body.dob;
  var email = req.body.email;
  var phone = req.body.phone;
  var age = req.body.age;
  if (Fname != ""){
    var fnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Fname:Fname}}
    )
  }else if (Mname != ""){
    var mnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Mname:Mname}}
    )
  }else if (Lname != ""){
    var lnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Lname:Lname}}
    )
  }else if (username != ""){
    var usernameChange = await prisma.admin.update(
      {where: {id:id},
      data: {username:username}}
    )
  }else if (password != ""){
    var passwordChange = await prisma.admin.update(
      {where: {id:id},
      data: {password:password}}
    )
  }else if (dob != ""){
    var dobChange = await prisma.admin.update(
      {where: {id:id},
      data: {dob:dob}}
    )
  }else if (email != ""){
    var emailChange = await prisma.admin.update(
      {where: {id:id},
      data: {email:email}}
    )
  }else if (phone != ""){
    var phoneChange = await prisma.admin.update(
      {where: {id:id},
      data: {phone:phone}}
    )
  }else if (age != ""){
    var ageChange = await prisma.admin.update(
      {where: {id:id},
      data: {age:age}}
    )
  }

  var data = await prisma.admin.findUnique({where:{id:id}})

  res.render("admin", {data:data})
  
})

app.get("/doctorinfo", async (req, res) => {
  const docinfo = await prisma.doctor.findMany({})
  const qualinfo = await prisma.qualifications.findMany({})
  res.render("doctorinfo", {val: docinfo, qualval: qualinfo});
})

app.post("/singledocinfo", async (req, res) => {
  var docid = req.body.docid;
  var docinfo = await prisma.doctor.findUnique({where: {id: docid}});
  var patinfo = await prisma.patient.findMany({})
  var dopinfo = await prisma.doctorOnPatient.findMany({})
  res.render("singledocinfo", {val: docinfo, patval: patinfo, dopval: dopinfo})
})

app.listen(PORT, (req, res) => {
    console.log("Server Running on port 3000");
});