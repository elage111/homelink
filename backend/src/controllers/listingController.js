import Listing from "../models/Listing.js";
import { validationResult } from "express-validator";

const ADMIN_PASSWORD = 'elage123@123';

export const adminLogin = (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
};

export const createListing = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, price, location, houseType, whatsappNumber, isAvailable, featured, videoUrl, images } = req.body;
    
    const listing = await Listing.create({
      title,
      description,
      price: parseFloat(price),
      location,
      houseType,
      whatsappNumber,
      videoUrl: videoUrl || 'https://example.com/video.mp4',
      images: images || ['https://example.com/image.jpg'],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      featured: featured || false
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const { search } = req.query;
    const filters = {};
    if (search) filters.keyword = search;
    
    const listings = await Listing.find(filters);
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getListing = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'unknown';
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, houseType, whatsappNumber, isAvailable, featured, videoUrl, images } = req.body;
    
    const listing = await Listing.update(id, {
      title,
      description,
      price: parseFloat(price),
      location,
      houseType,
      whatsappNumber,
      videoUrl,
      images,
      isAvailable,
      featured
    });
    
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Listing.delete(id);
    if (!deleted) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFilters = async (req, res) => {
  try {
    const filters = await Listing.getFilters();
    res.json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await Listing.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
