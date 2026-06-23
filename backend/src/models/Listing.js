import db from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Listing = {
  async create(data) {
    await db.read();
    const listing = {
      _id: uuidv4(),
      ...data,
      images: data.images || [],
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      createdAt: new Date().toISOString(),
      price: parseFloat(data.price),
      views: 0,
      viewedBy: [],
      featured: data.featured || false,
      badges: data.badges || []  // NEW: badges array
    };
    db.data.listings.push(listing);
    await db.write();
    return listing;
  },

  async find(filters = {}) {
    await db.read();
    let listings = db.data.listings;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      listings = listings.filter(l =>
        l.location.toLowerCase().includes(keyword) ||
        l.title.toLowerCase().includes(keyword) ||
        l.description.toLowerCase().includes(keyword)
      );
    }
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return listings.slice(0, 100);
  },

  async findById(id) {
    await db.read();
    return db.data.listings.find(l => l._id === id) || null;
  },

  async addView(id, ip) {
    await db.read();
    const listing = db.data.listings.find(l => l._id === id);
    if (!listing) return null;
    if (!listing.viewedBy) {
      listing.viewedBy = [];
    }
    if (!listing.viewedBy.includes(ip)) {
      listing.viewedBy.push(ip);
      listing.views = (listing.views || 0) + 1;
      await db.write();
    }
    return listing;
  },

  async update(id, data) {
    await db.read();
    const index = db.data.listings.findIndex(l => l._id === id);
    if (index === -1) return null;
    db.data.listings[index] = {
      ...db.data.listings[index],
      ...data,
      badges: data.badges || db.data.listings[index].badges || []  // NEW: preserve badges
    };
    await db.write();
    return db.data.listings[index];
  },

  async delete(id) {
    await db.read();
    const index = db.data.listings.findIndex(l => l._id === id);
    if (index === -1) return false;
    db.data.listings.splice(index, 1);
    await db.write();
    return true;
  },

  async getStats() {
    await db.read();
    const listings = db.data.listings;
    const total = listings.length;
    const views = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    const locations = new Set(listings.map(l => l.location)).size;
    return { total, views, locations };
  }
};

export default Listing;
