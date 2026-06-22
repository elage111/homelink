import express from "express";
import { 
  createListing, 
  getListings, 
  getListing, 
  updateListing, 
  deleteListing,
  adminLogin
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/listings", createListing);
router.get("/listings", getListings);
router.get("/listings/:id", getListing);
router.put("/listings/:id", updateListing);
router.delete("/listings/:id", deleteListing);

export default router;
