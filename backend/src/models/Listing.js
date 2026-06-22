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
      featured: data.featured || false
    };
    db.data.listings.push(listing);
    await db.write();
    return listing;
  },

  async find(filters = {}) {
    await db.read();
    let listings = db.data.listings.filter(l => l.isAvailable === true);
    if (filters.location) {
      listings = listings.filter(l => l.location === filters.location);
    }
    if (filters.houseType) {
      listings = listings.filter(l => l.houseType === filters.houseType);
    }
    if (filters.minPrice) {
      listings = listings.filter(l => l.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      listings = listings.filter(l => l.price <= parseFloat(filters.maxPrice));
    }
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return listings.slice(0, 50);
  },

  async findById(id) {
    await db.read();
    const listing = db.data.listings.find(l => l._id === id);
    if (listing) {
      listing.views = (listing.views || 0) + 1;
      await db.write();
    }
    return listing || null;
  },

  async update(id, data) {
    await db.read();
    const index = db.data.listings.findIndex(l => l._id === id);
    if (index === -1) return null;
    db.data.listings[index] = { ...db.data.listings[index], ...data };
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

  async getFilters() {
    return {
      locations: ["Molyko", "Bonduma", "Buea Town", "Mile 16", "Mile 17", "Mile 18", "Bokwango", "Other"],
      houseTypes: ["Single Room", "Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Apartment", "Other"]
    };
  }
};

export default Listing;
