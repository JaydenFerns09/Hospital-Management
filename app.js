const express = require("express");
const app = express();
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

require('dotenv').config();

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const _ = require("lodash");

const PORT = process.env.PORT || 3000;

const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Global Variables
const cloudName = process.env.CLOUD_NAME;
const format = 'jpg';

// GLobal Functions
const cloudinaryUrl = (cloudName, publicId, format) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.${format}`;

const imageInput = async (imagePath, customPublicId) => {
  const publicId = await uploadImage(imagePath,customPublicId);
  console.log('Image uploaded with public ID:', publicId);
};

// Uploading images to cloudinary
const uploadImage = async (imagePath, customPublicId) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: customPublicId, // Set custom public_id here
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

//use this function call to add images
// imageInput(iamgePath, customPublicId);

//use this to get the link to the image
// const publicId = 'd1';
// const imageUrl = cloudinaryUrl(cloudName, publicId, format);
// console.log(imageUrl)

async function getRandomNumber(min, max) {
  let randomNumber;
  const generatedNumbers = await prisma.count.findMany({});
  
  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  } while (generatedNumbers.some(entry => entry.count === randomNumber));

  const addNew = await prisma.count.create({
    data: {
      count: randomNumber
    }
  });

  return randomNumber;
}


function calculateAge(dobString) {
  const dob = new Date(dobString);
  const currentDate = new Date();
  const timeDifference = currentDate - dob;
  const ageInYears = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
  return ageInYears;
}



// Home Routers

app.get("/", async (req, res) => {
    res.render("Home/landing", {landingStatus: {success:false}});
});

app.post("/", async (req, res) => {
  res.render("Home/landing",{landingStatus: {success: true, message: "Logout successful", type: "success"}});
});

app.get("/developers", async (req, res) => {
  res.render("Home/developers");
})

app.get("/doctors", async (req, res) => {
  // var docinfo = await prisma.doctor.findMany({});
  // res.render("Home/doctors", {val: docinfo});
  res.render("Home/doctors");
})

app.get("/aboutus", async (req, res) => {
  res.render("Home/aboutus");
})


// Login Routers

app.get("/login", async (req,res) => {
  res.render("login", { loginStatus: { success: false}});
});

app.post("/login", async (req,res) => {
  var username = _.toLower(req.body.username);
  var password = _.toLower(req.body.password);

  var user = await prisma.admin.findUnique({where: {username:username}});

  if (_.isEmpty(user) === true){
    var user = await prisma.staff.findUnique({where: {username:username}});
    if (_.isEmpty(user) === true){
      var user = await prisma.doctor.findUnique({where: {username:username}});
      if (_.isEmpty(user) === true){
        res.render("login", { loginStatus: { success: true, message: "Invalid username", type: "error" } });
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
            res.render("Doctor/", {data : user});
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
          res.render("Staff/", {data : user});
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
        res.render("Admin/admin", {adminStatus: {success: true, message: "Login Successful", type: "success"},data : user});
    }
  }
  res.render("login", { loginStatus: { success: true, message: "Invalid password", type: "error" } });
});


// Admin Routers

app.get("/admin", async (req, res) => {
  var adminusername = req.query.username;
  const admininfo = await prisma.admin.findUnique({where:{username:adminusername}})
  res.render("Admin/admin", {adminStatus: {success: false},data: admininfo});
})

app.post("/changeadmindetails", async (req, res) => {
  var id = req.body.id;
  var Fname = req.body.Fname;
  var Mname = req.body.Mname;
  var Lname = req.body.Lname;
  var img = req.body.img;
  var username = req.body.username;
  var password = req.body.password;
  var dob = req.body.dob;
  var email = req.body.email;
  var phone = req.body.phone;
  var fb = req.body.fb;
  var twi = req.body.twi;
  var git = req.body.git;
  var inst = req.body.inst;
  var link = req.body.link;
  if (Fname != ""){
    var fnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Fname:Fname}}
    )
  }
  if (Mname != ""){
    var mnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Mname:Mname}}
    )
  }
  if (Lname != ""){
    var lnameChange = await prisma.admin.update(
      {where: {id:id},
      data: {Lname:Lname}}
    )
  }
  if (username != ""){
    var usernameChange = await prisma.admin.update(
      {where: {id:id},
      data: {username:username}}
    )
  }
  if (password != ""){
    var passwordChange = await prisma.admin.update(
      {where: {id:id},
      data: {password:password}}
    )
  }
  if (dob != ""){
    var dobChange = await prisma.admin.update(
      {where: {id:id},
      data: {dob:dob}}
    )
  }
  if (email != ""){
    var emailChange = await prisma.admin.update(
      {where: {id:id},
      data: {email:email}}
    )
  }
  if (phone != ""){
    var phoneChange = await prisma.admin.update(
      {where: {id:id},
      data: {phone:phone}}
    )
  }
  if (fb != ""){
    var fbChange = await prisma.admin.update(
      {where: {id:id},
      data: {facebook:fb}}
    )
  }
  if (twi != ""){
    var twiChange = await prisma.admin.update(
      {where: {id:id},
      data: {twitter:twi}}
    )
  }
  if (link != ""){
    var linkChange = await prisma.admin.update(
      {where: {id:id},
      data: {linkedin:link}}
    )
  }
  if (git != ""){
    var gitChange = await prisma.admin.update(
      {where: {id:id},
      data: {github:git}}
    )
  }
  if (inst != ""){
    var instChange = await prisma.admin.update(
      {where: {id:id},
      data: {instagram:inst}}
    )
  }

  var data = await prisma.admin.findUnique({where:{id:id}})

  res.render("Admin/admin", {adminStatus: {success: true, message: "Data Successfully Updated", type: "success"}, data:data})
  
})

app.post("/changedocinfo", async (req, res) => {
  var details = req.body
  if (details.Fname != ""){
    var fnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Fname:details.Fname}}
    )
  }
  if (details.Mname != ""){
    var mnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Mname:details.Mname}}
    )
  }
  if (details.Lname != ""){
    var lnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Lname:details.details.Lname}}
    )
  }
  if (details.username != ""){
    var usernameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {username:details.username}}
    )
  }
  if (details.password != ""){
    var passwordChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {password:details.password}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.bg != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {blood_group:details.bg}}
    )
  }
  if (details.sex != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {sex:details.sex}}
    )
  }
  if (details.addr != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {address:details.addr}}
    )
  }
  if (details.desig != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {designation:details.desig}}
    )
  }
  if (details.room != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      room: {dob:details.room}}
    )
  }
  if (details.quote != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {quote:details.quote}}
    )
  }
  if (details.spec != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {speciality:details.speciality}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.field != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {field:details.fields}}
    )
  }
  if (details.exp != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {experience:details.exp}}
    )
  }
  if (details.email != ""){
    var emailChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {email:details.email}}
    )
  }
  if (details.phone != ""){
    var phoneChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {phone:details.phone}}
    )
  }
  if (details.fb != ""){
    var fbChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {facebook:details.fb}}
    )
  }
  if (details.twi != ""){
    var twiChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {twitter:details.twi}}
    )
  }
  if (details.link != ""){
    var linkChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {linkedin:details.link}}
    )
  }
  if (details.git != ""){
    var gitChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {github:details.git}}
    )
  }
  if (details.inst != ""){
    var instChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {instagram:details.inst}}
    )
  }

  var admininfo = await prisma.admin.findUnique({where: {id: details.adminid}})
  var docinfo = await prisma.doctor.findUnique({where: {id: details.id}});
  var patinfo = await prisma.patient.findMany({})
  var dopinfo = await prisma.doctorOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {doctorId: details.id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: true, message: "Data Successfully Updated", type: "success"}, type: "Doctor", changeroute: "changedocinfo", val: docinfo, patval: patinfo, qualval: qualinfo, dopval: dopinfo, data: admininfo})
  
})

app.post("/changestaffinfo", async (req, res) => {
  var details = req.body
  if (details.Fname != ""){
    var fnameChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {Fname:details.Fname}}
    )
  }
  if (details.Mname != ""){
    var mnameChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {Mname:details.Mname}}
    )
  }
  if (details.Lname != ""){
    var lnameChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {Lname:details.details.Lname}}
    )
  }
  if (details.username != ""){
    var usernameChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {username:details.username}}
    )
  }
  if (details.password != ""){
    var passwordChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {password:details.password}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.sal != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {salary:details.sal}}
    )
  }
  if (details.bg != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {blood_group:details.bg}}
    )
  }
  if (details.sex != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {sex:details.sex}}
    )
  }
  if (details.addr != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {address:details.addr}}
    )
  }
  if (details.desig != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {designation:details.desig}}
    )
  }
  if (details.room != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      room: {dob:details.room}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.exp != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {experience:details.exp}}
    )
  }
  if (details.role != ""){
    var dobChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {role:details.role}}
    )
  }
  if (details.email != ""){
    var emailChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {email:details.email}}
    )
  }
  if (details.phone != ""){
    var phoneChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {phone:details.phone}}
    )
  }
  if (details.fb != ""){
    var fbChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {facebook:details.fb}}
    )
  }
  if (details.twi != ""){
    var twiChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {twitter:details.twi}}
    )
  }
  if (details.link != ""){
    var linkChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {linkedin:details.link}}
    )
  }
  if (details.git != ""){
    var gitChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {github:details.git}}
    )
  }
  if (details.inst != ""){
    var instChange = await prisma.staff.update(
      {where: {id:details.id},
      data: {instagram:details.inst}}
    )
  }
  var admininfo = await prisma.admin.findUnique({where: {id: details.adminid}})
  var staffinfo = await prisma.staff.findUnique({where: {id: details.id}});
  var patinfo = await prisma.patient.findMany({})
  var sopinfo = await prisma.staffOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {staffId: details.id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: false}, type: "Staff", changeroute: "changestaffinfo",val: staffinfo, patval: patinfo, qualval: qualinfo, sopval: sopinfo, data: admininfo})
})

// Details Routers

app.get("/doctorinfo", async (req, res) => {
  var username = req.query.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const docinfo = await prisma.doctor.findMany({});
    const qualinfo = await prisma.qualifications.findMany({});
    res.render("Admin/details", {createStatus: {success: false}, route:"doctorinfo", type: "Doctor", val: docinfo, qualval: qualinfo, data: admininfo });
});

app.get("/staffinfo", async (req, res) => {
  var username = req.query.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const staffinfo = await prisma.staff.findMany({});
    const qualinfo = await prisma.qualifications.findMany({});
    res.render("Admin/details", {createStatus: {success: false}, route:"staffinfo", type: "Staff", val: staffinfo, qualval: qualinfo, data: admininfo });
});

app.get("/patientinfo", async (req, res) => {
  var username = req.query.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const patinfo = await prisma.patient.findMany({});
    const depinfo = await prisma.dependant.findMany({});
    res.render("Admin/details", {createStatus: {success: false}, route:"patientinfo", type: "Patient", val: patinfo, depval: depinfo, data: admininfo });
});



// Create Routers

app.post("/doctorinfo", async (req, res) => {
  const details = req.body;
    // Generate a random number
    const random = (await getRandomNumber(1000, 100000)).toString();
    const randomroom = (await getRandomNumber(100, 1000-1)).toString();

    const publicId = 'doctor';
    const imageUrl = cloudinaryUrl(cloudName, publicId, format);

    // Create doctor entry
    const docInput = await prisma.doctor.create({
      data: {
        image: imageUrl,
        Fname: details.Fname,
        Mname: details.Mname,
        Lname: details.Lname,
        username: details.Fname + random,
        password: details.Lname,
        dob: details.dob,
        phone: details.phone,
        email: details.email,
        blood_group: details.bg,
        sex: details.sex,
        room: 'D' + randomroom,
        salary: parseFloat(details.sal),
        address: details.addr,
        designation: details.desig,
        speciality: details.spec,
        field: details.field,
        employed: true,
        quote: details.quote,
        experience: details.exp,
        facebook: details.fb,
        instagram: details.inst,
        twitter: details.twi,
        linkedin: details.link
      }
    });

    const publicId1 = 'degree';
    const imageUrl1 = cloudinaryUrl(cloudName, publicId1, format);

    // Create qualifications entries
    for(let i = 0; i< details.qualifications.length; i++){
      const qualupload = await prisma.qualifications.create({
        data: {
          doctorId: docInput.id,
          degree: details.qualifications[i].degree,
          degree_img: imageUrl1,
          year:details.qualifications[i].year,
          institute:details.qualifications[i].institute
        }
      })
    }
    username = req.body.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const docinfo = await prisma.doctor.findMany({});
    const qualinfo = await prisma.qualifications.findMany({});
    res.render("Admin/details", {createStatus: { success: true, message: "Details Succesfully uploaded", type: "success" }, route:"doctorinfo", type: "Doctor", val: docinfo, qualval: qualinfo, data: admininfo });
});

app.post("/staffinfo", async (req, res) => {
  const details = req.body;
    // Generate a random number
    const random = (await getRandomNumber(1000, 100000)).toString();
    const randomroom = (await getRandomNumber(100, 1000-1)).toString();

    const publicId = 'staff';
    const imageUrl = cloudinaryUrl(cloudName, publicId, format);

    // Create doctor entry
    const staffInput = await prisma.staff.create({
      data: {
        image: imageUrl,
        Fname: details.Fname,
        Mname: details.Mname,
        Lname: details.Lname,
        username: details.Fname + random,
        password: details.Lname,
        dob: details.dob,
        phone: details.phone,
        age:69,
        email: details.email,
        blood_group: details.bg,
        sex: details.sex,
        room: 'D' + randomroom,
        salary: parseFloat(details.sal),
        address: details.addr,
        designation: details.desig,
        role: details.role,
        employed: true,
        experience: details.exp,
        facebook: details.fb,
        instagram: details.inst,
        twitter: details.twi,
        linkedin: details.link
      }
    });

    const publicId1 = 'degree';
    const imageUrl1 = cloudinaryUrl(cloudName, publicId1, format);

    // Create qualifications entries
    for(let i = 0; i< details.qualifications.length; i++){
      const qualupload = await prisma.qualifications.create({
        data: {
          staffId: staffInput.id,
          degree: details.qualifications[i].degree,
          degree_img: imageUrl1,
          year:details.qualifications[i].year,
          institute:details.qualifications[i].institute
        }
      })
    }
    username = req.body.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const staffinfo = await prisma.staff.findMany({});
    const qualinfo = await prisma.qualifications.findMany({});
    res.render("Admin/details", {createStatus: {success: true, message: "Details Succesfully uploaded", type: "success" }, route:"staffinfo", type: "Staff", val: staffinfo, qualval: qualinfo, data: admininfo });
});

app.post("/patientinfo", async (req, res) => {
  const details = req.body;
    // Generate a random number
    const random = (await getRandomNumber(1000, 100000)).toString();
    const randomroom = (await getRandomNumber(100, 1000-1)).toString();

    const publicId = 'patient';
    const imageUrl = cloudinaryUrl(cloudName, publicId, format);

    // Create doctor entry
    const patientInput = await prisma.patient.create({
      data: {
        image: imageUrl,
        Fname: details.Fname,
        Mname: details.Mname,
        Lname: details.Lname,
        dob: details.dob,
        phone: details.phone,
        email: details.email,
        blood_group: details.bg,
        age:69,
        sex: details.sex,
        room: 'D' + randomroom,
        address: details.addr,
        report: details.rep,
        allergies: details.aller,
        treatment: details.treat,
        reason: details.reas,
        patientType: details.type,
        discharged: false
      }
    });

    // Create qualifications entries
    for(let i = 0; i< details.dependants.length; i++){
      const depUpload = await prisma.dependant.create({
        data: {
          Fname:details.dependants[i].Fname,
          Mname:details.dependants[i].Mname,
          Lname:details.dependants[i].Lname,
          dob:details.dependants[i].dob,
          age:parseInt(details.dependants[i].age),
          phone:parseInt(details.dependants[i].phone),
          email:details.dependants[i].email,
          sex:details.dependants[i].sex,
          relation:details.dependants[i].relation,
          patientid: patientInput.id
        }
      })
    }
    username = req.body.username;
    const admininfo = await prisma.admin.findUnique({ where: { username: username } });
    const patinfo = await prisma.patient.findMany({});
    const depinfo = await prisma.dependant.findMany({});
    res.render("Admin/details", {createStatus: {success: true, message: "Details Succesfully uploaded", type: "success" }, route:"patientinfo", type: "Patient", val: patinfo, depval: depinfo, data: admininfo });
});


// Single Patient Information Routers

app.post("/singledocpatientinfo", async (req, res) => {
  const adminid = req.body.adminid;
  const docid = req.body.docid;
  const patid = req.body.patid;

  const docs = await prisma.doctor.findMany({})
  const stas = await prisma.staff.findMany({})
  const admin = await prisma.admin.findUnique({where: {id:adminid}})
  const doc = await prisma.doctor.findUnique({where: {id:docid}})
  const pat = await prisma.patient.findUnique({where: {id:patid}})

  res.render('Admin/singlepatientinfo', {type: "Doctor" ,route: "singledocinfo" ,data: admin, val: doc, patval: pat, doctor: docs, staff: stas});
  
})
app.post("/singlestaffpatientinfo", async (req, res) => {
  const adminid = req.body.adminid;
  const staffid = req.body.staffid;
  const patid = req.body.patid;

  const docs = await prisma.doctor.findMany({})
  const stas = await prisma.staff.findMany({})
  const admin = await prisma.admin.findUnique({where: {id:adminid}})
  const staff = await prisma.staff.findUnique({where: {id:staffid}})
  const pat = await prisma.patient.findUnique({where: {id:patid}})

  res.render('Admin/singlepatientinfo', {type: "Staff" ,route: "singlestaffinfo" ,data: admin, val: staff, patval: pat, doctor: docs, staff: stas});
  
})

app.post("/singlepatinfo", async (req, res) => {
  const adminid = req.body.adminid;
  const id = req.body.id;

  const docs = await prisma.doctor.findMany({})
  const stas = await prisma.staff.findMany({})
  const admin = await prisma.admin.findUnique({where: {id:adminid}})
  const pat = await prisma.patient.findUnique({where: {id:id}})

  res.render('Admin/singlepatientinfo', {type: "Patient" ,route: "patientinfo" ,data: admin, patval: pat, doctor: docs, staff: stas});
})

app.post("/singledocinfo", async (req, res) => {
  var id = req.body.id;
  var adminid = req.body.adminid;
  var admininfo = await prisma.admin.findUnique({where: {id: adminid}})
  var docinfo = await prisma.doctor.findUnique({where: {id: id}});
  var patinfo = await prisma.patient.findMany({})
  var dopinfo = await prisma.doctorOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {doctorId: id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: false}, type: "Doctor", changeroute: "changedocinfo", val: docinfo, patval: patinfo, qualval: qualinfo, dopval: dopinfo, data: admininfo})
})

app.post("/singlestaffinfo", async (req, res) => {
  var id = req.body.id;
  var adminid = req.body.adminid;
  var admininfo = await prisma.admin.findUnique({where: {id: adminid}})
  var staffinfo = await prisma.staff.findUnique({where: {id: id}});
  var patinfo = await prisma.patient.findMany({})
  var sopinfo = await prisma.staffOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {staffId: id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: false}, type: "Staff", changeroute: "changestaffinfo",val: staffinfo, patval: patinfo, qualval: qualinfo, sopval: sopinfo, data: admininfo})
})



app.post("/patupdate", async (req, res) => {
  var details = req.body;
  console.log(details)

  if(details.doctor){
    for (let i = 0; i < details.doc.length; i++){
      var newDOP = await prisma.doctorOnPatient.create({
        data: {
          doctorid: details.doc[i],
          patientid: details.patId
        }
      })
    }
  }

  if(details.staff){
    for (let j = 0; j < details.staff.length; j++){
      var newSOP = await prisma.staffOnPatient.create({
        data: {
          staffid: details.staff[j],
          patientid: details.patId
        }
      })
    }
  }
  if(details.type == "Doctor"){

    const docs = await prisma.doctor.findMany({})
    const stas = await prisma.staff.findMany({})
    const admin = await prisma.admin.findUnique({where: {id:details.adminId}})
    const doc = await prisma.doctor.findUnique({where: {id:details.id}})
    const pat = await prisma.patient.findUnique({where: {id:details.patId}})

    res.render('Admin/singlepatientinfo', {type: "Doctor" ,route: "singledocinfo" ,data: admin, val: doc, patval: pat, doctor: docs, staff: stas});
  }else if (details.type == "Staff"){

    const docs = await prisma.doctor.findMany({})
    const stas = await prisma.staff.findMany({})
    const admin = await prisma.admin.findUnique({where: {id:details.adminId}})
    const staff = await prisma.staff.findUnique({where: {id:details.id}})
    const pat = await prisma.patient.findUnique({where: {id:details.patId}})

    res.render('Admin/singlepatientinfo', {type: "Staff" ,route: "singlestaffinfo" ,data: admin, val: staff, patval: pat, doctor: docs, staff: stas});
  }else{

    const docs = await prisma.doctor.findMany({})
    const stas = await prisma.staff.findMany({})
    const admin = await prisma.admin.findUnique({where: {id:details.adminId}})
    const pat = await prisma.patient.findUnique({where: {id:details.patId}})

    res.render('Admin/singlepatientinfo', {type: "Patient" ,route: "patientinfo" ,data: admin, patval: pat, doctor: docs, staff: stas});
  }


})



// Editing Routers

app.post("/changedoctordetails", async (req, res) => {
  var details=req.body;
  if (details.Fname != ""){
    var fnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Fname:details.Fname}}
    )
  }
  if (details.Mname != ""){
    var mnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Mname:details.Mname}}
    )
  }
  if (details.Lname != ""){
    var lnameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {Lname:details.Lname}}
    )
  }
  // if (details.img != ""){
  //   imgPath=details.img;
  //   customPublicId = details.Fname+'_'+details.Lname;
  //   imageInput(imgPath, customPublicId);
  //   const imageUrl = cloudinaryUrl(cloudName, customPublicId, format);
  //   var imgChange = await prisma.doctor.update(
  //     {where: {id:details.id},
  //     data: {image:details.imageUrl}}
  //   )
  // }
  if (details.username != ""){
    var usernameChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {username:details.username}}
    )
  }
  if (details.password != ""){
    var passwordChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {password:details.password}}
    )
  }
  if (details.dob != ""){
    var dobChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {dob:details.dob}}
    )
  }
  if (details.email != ""){
    var emailChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {email:details.email}}
    )
  }
  if (details.phone != ""){
    var phoneChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {phone:details.phone}}
    )
  }
  if (details.sex != ""){
    var sexChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {sex:details.sex}}
    )
  }
  if (details.bg != ""){
    var bgChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {blood_group:details.bg}}
    )
  }
  if (details.spec != ""){
    var specChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {speciality:details.spec}}
    )
  }
  if (details.field != ""){
    var fieldChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {field:details.field}}
    )
  }
  if (details.desig != ""){
    var desigChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {designation:details.desig}}
    )
  }
  if (details.sal != ""){
    var salChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {salary:details.sal}}
    )
  }
  if (details.quote != ""){
    var quoteChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {quote:details.quote}}
    )
  }
  if (details.fb != ""){
    var fbChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {facebook:details.fb}}
    )
  }
  if (details.twi != ""){
    var twiChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {twitter:details.twi}}
    )
  }
  if (details.link != ""){
    var linkChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {linkedin:details.link}}
    )
  }
  if (details.git != ""){
    var gitChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {github:details.git}}
    )
  }
  if (details.inst != ""){
    var instChange = await prisma.doctor.update(
      {where: {id:details.id},
      data: {instagram:details.inst}}
    )
  }

  var admininfo = await prisma.admin.findUnique({where: {id: details.adminid}})
  var docinfo = await prisma.doctor.findUnique({where: {id: details.id}});
  var patinfo = await prisma.patient.findMany({})
  var dopinfo = await prisma.doctorOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {doctorId: details.id}})
  res.render("Admin/singleinfo", {val: docinfo, patval: patinfo, qualval: qualinfo, dopval: dopinfo, data: admininfo})
});

app.post("/fired", async (req, res) => {
  var details = req.body;
  if(details.type == "Doctor"){
  var docinfo = await prisma.doctor.findUnique({where: {id: details.id}});
    var update = await prisma.doctor.update({
      where: {id: details.id},
      data: {employed: false, Lname: docinfo.Lname + "(FIRED)"}
    })
  var admininfo = await prisma.admin.findUnique({where: {id: details.adminid}})
  var patinfo = await prisma.patient.findMany({})
  var dopinfo = await prisma.doctorOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {doctorId: details.id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: false}, type: "Doctor", changeroute: "changedocinfo", val: docinfo, patval: patinfo, qualval: qualinfo, dopval: dopinfo, data: admininfo})
  }else{
    var staffinfo = await prisma.staff.findUnique({where: {id: details.id}});
    var update = await prisma.staff.update({
      where: {id: details.id},
      data: {employed: false, Lname: staffinfo.Lname + "(FIRED)"}
    })
  var admininfo = await prisma.admin.findUnique({where: {id: details.adminid}})
  var patinfo = await prisma.patient.findMany({})
  var sopinfo = await prisma.staffOnPatient.findMany({})
  var qualinfo = await prisma.qualifications.findMany({where: {staffId: details.id}})
  res.render("Admin/singleinfo", {singleInfoStatus: {success: false}, type: "Staff", changeroute: "changestaffinfo",val: staffinfo, patval: patinfo, qualval: qualinfo, sopval: sopinfo, data: admininfo})
  }

})

app.get("/changelog", async (req, res) => {
  var username = req.query.username;
  var adminlogin = await prisma.admin.findUnique({where: {username: username}})
  var changelog = await prisma.changeLog.findMany({})
  var admininfo = await prisma.admin.findMany({})
  var docinfo = await prisma.doctor.findMany({})
  var staffinfo = await prisma.staff.findMany({})
  res.render("Admin/changelog", {data: adminlogin, val: changelog, admin: admininfo, doctor: docinfo, staff: staffinfo})
})


app.listen(PORT, (req, res) => {
    console.log("Server Running on port 3000");
});