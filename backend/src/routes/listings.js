import express from "express";
import { 
  createListing, 
  getListings, 
  getListing, 
  updateListing, 
  deleteListing,
  adminLogin,
  getFilters,
  getStats
} from "../controllers/listingController.js";
import { body } from "express-validator";

const router = express.Router();

const validateListing = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("houseType").notEmpty().withMessage("House type is required"),
  body("whatsappNumber").notEmpty().withMessage("WhatsApp number is required")
];

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/stats", getStats);

// Listing routes
router.post("/listings", validateListing, createListing);
router.get("/listings", getListings);
router.get("/listings/:id", getListing);
router.put("/listings/:id", updateListing);
router.delete("/listings/:id", deleteListing);
router.get("/filters", getFilters);

export default router;
