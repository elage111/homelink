import Listing from "../models/Listing.js";
import { validationResult } from "express-validator";
import db from "../config/database.js";

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
    const listing = await Listing.create(req.body);
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
    const listing = await Listing.addView(req.params.id, ip);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.update(req.params.id, req.body);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const deleted = await Listing.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const trackLead = async (req, res) => {
  try {
    const listing = await Listing.addLead(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({
      success: true,
      message: "Lead tracked successfully",
      data: { leads: listing.leads }
    });
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

// Get lead stats (admin only)
export const getLeadStats = async (req, res) => {
  try {
    await db.read();
    const listings = db.data.listings || [];
    const totalLeads = listings.reduce((sum, l) => sum + (l.leads || 0), 0);
    const listingsWithLeads = listings.filter(l => (l.leads || 0) > 0).length;

    // Top listings by leads
    const topListings = [...listings]
      .sort((a, b) => (b.leads || 0) - (a.leads || 0))
      .slice(0, 10)
      .map(l => ({
        id: l._id,
        title: l.title || 'Untitled',
        location: l.location || 'Unknown',
        leads: l.leads || 0,
        isAvailable: l.isAvailable !== false,
        price: l.price || 0
      }));

    // All listings with lead count
    const allListings = listings.map(l => ({
      id: l._id,
      title: l.title || 'Untitled',
      location: l.location || 'Unknown',
      leads: l.leads || 0,
      isAvailable: l.isAvailable !== false
    }));

    res.json({
      success: true,
      data: {
        totalLeads,
        listingsWithLeads,
        topListings,
        allListings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
