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

app.get('/seed', async (req, res) => {

  const patientResult = await prisma.patient.create({
    data: {
      image: "patient_image_url", // Replace with the actual image URL or path
      Fname: "Michael",
      Mname: "Alexander",
      Lname: "Davis",
      dob: "1985-08-12T00:00:00Z",
      age: 37,
      phone: 8765432108,
      email: "michael.davis@example.com",
      room: "301",
      sex: "Male",
      blood_group: "B+",
      allergies: "Pollen",
      treatment: "General Treatment",
      discharged: false,
    },
  });
  
  const paymentResult = await prisma.payment.create({
    data: {
      reason: "Surgery Cost",
      inital_cost: 5000.00,
      extra_cost: 1500.00,
      total_amount: 6500.00,
      paid_amount: 5000.00,
      due_amount: 1500.00,
      mode_of_payment: "Cash",
      patientid: patientResult.id,
    },
  });
  
  const doctorResult = await prisma.doctor.create({
    data: {
      image: "doctor_image_url", // Replace with the actual image URL or path
      Fname: "Dr. Jessica",
      username: "dr_jessica",
      password: "doctor456",
      dob: "1982-05-20T00:00:00Z",
      age: 40,
      phone: 9876543215,
      email: "dr.jessica@example.com",
      room: "202",
      sex: "Female",
      blood_group: "A+",
      address: "abcde",
      designation: "Orthopedic Surgeon",
      salary: 120000.00,
      qualification: "MS",
      speciality: "Orthopedics",
      field: "Surgery"
    },
  });
  
  const doctorOnPatientResult = await prisma.doctorOnPatient.create({
    data: {
      patientid: patientResult.id,
      doctorid: doctorResult.id,
    },
  });
  
  const staffResult = await prisma.staff.create({
    data: {
      image: "staff_image_url", // Replace with the actual image URL or path
      Fname: "Christopher",
      Lname: "Hill",
      username: "chris_hill",
      password: "chris123",
      dob: "1990-11-15T00:00:00Z",
      age: 32,
      phone: 8765432102,
      email: "chris.hill@example.com",
      room: "403",
      sex: "Male",
      role: "Receptionist",
      blood_group: "AB+",
      designation: "Physiotherapist",
      salary: 90000.00,
      qualification: "DPT",
    },
  });
  
  const staffOnPatientResult = await prisma.staffOnPatient.create({
    data: {
      patientid: patientResult.id,
      staffid: staffResult.id,
    },
  });
  
  
  const dependantResult = await prisma.dependant.create({
    data: {
      Fname: "Sophie",
      Lname: "Davis",
      dob: "2015-03-10T00:00:00Z",
      age: 6,
      phone: 1234567894,
      email: "sophie.davis@example.com",
      sex: "Female",
      relation: "Daughter",
      patientid: patientResult.id,
    },
  });

    const adminResult = await prisma.admin.create({
      data: {
        image: "https://res.cloudinary.com/dw8pgouns/image/upload/Admin.jpg",
        Fname: "Jayden",
        Lname: "Fernandes",
        username: "jade2003",
        password: "admin@caresphere",
        dob: "2003-10-09",
        age: 20,
        phone: 9930086904,
        email: "jadefern09@gmail.com"
      },
  });

  const medicationResult = await prisma.medication.create({
    data: {
      name: "Ibuprofen",
      dosage: "200mg",
      frequency: "Three times a day",
      patientid: patientResult.id,
    },
  });
});

app.get("/del", async (req, res) => {
  try {
    // Delete all entries in the Dependant table
    await prisma.dependant.deleteMany();
  
    // Delete all entries in the Medication table
    await prisma.medication.deleteMany();
  
    // Delete all entries in the StaffOnPatient table
    await prisma.staffOnPatient.deleteMany();
  
    // Delete all entries in the DoctorOnPatient table
    await prisma.doctorOnPatient.deleteMany();
  
    // Delete all entries in the Payment table
    await prisma.payment.deleteMany();
  
    // Delete all entries in the Medication table
    await prisma.medication.deleteMany();
  
    // Delete all entries in the Patient table
    await prisma.patient.deleteMany();
  
    // Delete all entries in the Doctor table
    await prisma.doctor.deleteMany();
  
    // Delete all entries in the Staff table
    await prisma.staff.deleteMany();
  
    console.log("All data deleted successfully.");
  } catch (error) {
    // Handle errors
    console.error(error);
  }
})

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