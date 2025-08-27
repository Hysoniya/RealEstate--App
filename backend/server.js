const express = require("express");
const app = express();

const usersRouter = require("./controllers/newuser");
const loginRouter = require("./controllers/login");
const {
  AdminRouter,
  AdminUpdateRouter,
  AdminDashUsersDetail,
} = require("./controllers/adminlogin");
const adminSignupRouter = require("./controllers/adminsignup");
const staffRouter = require("./controllers/staffControllers.js");
const userProfileRoutes = require("./controllers/userProfileRoutes.js");
const propertyRoutes = require("./controllers/propertyRoutes");
const propertyImageRoutes = require("./controllers/propertyImageRoutes");
const testimonialRoutes = require("./controllers/testimonialRoutes");
const emailVerification = require("./controllers/emailVerification");
const Appointment = require("./controllers/Appointment");
const TitleSearch = require("./controllers/titleSearch.js");
const PropertyReviewRouter = require("./controllers/PropertyReviewsControllers.js");
const BankingPartnerRouter = require("./routes/BankingPartner.js");
// const staffRoutes = require("./routes/staffRoutes");
const contractorRoutes = require("./routes/contractorRoutes.js");
const { authenticate, checkAuth } = require("./middleware/authenticate");
const AuthRoutes = require("./routes/AuthRoutes.js");
const builderRoutes = require("./routes/BuilderRoutes.js");


require("dotenv").config();
const mongoDB = require("./db");
const cors = require("cors");
const path = require("path");
const EnquiryRouter = require("./controllers/EnquiryControllers.js");
const PrePurchaseProVerRouter = require("./controllers/PrePurchasePropertyVerification.js");

const port = process.env.PORT || 8000;

mongoDB();
app.use(cors());

app.use(cors());

app.use(express.json());

// API Routes
app.get('/api/check-auth', authenticate, checkAuth);
app.use("/api/users", usersRouter);
app.use("/api/users", loginRouter);
app.use("/api/user-update", userProfileRoutes);
app.use("/api/admin/login", AdminRouter);
app.use("/api/admin/update", AdminUpdateRouter);
app.use("/api/admin/users-details", AdminDashUsersDetail);
app.use("/api/admin", adminSignupRouter);
app.use("/api/contractor", contractorRoutes);
app.use("/api", propertyRoutes);
app.use("/api", propertyImageRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api", emailVerification);
app.use("/api", Appointment);
app.use("/api/staff", staffRouter);
app.use("/api/reviews", PropertyReviewRouter);
app.use("/api/enquiry", EnquiryRouter);
app.use("/api/title-search", TitleSearch);
app.use("/api/Pre-Purchase-Property-Verification", PrePurchaseProVerRouter);
app.use("/api/banking-partners", BankingPartnerRouter);
app.use("/api/auth", AuthRoutes);
app.use("/api/builders", builderRoutes);



// app.use("/api/staff", staffRoutes);

// Static file access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Backend is alive!");
})
// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
