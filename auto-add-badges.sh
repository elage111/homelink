#!/bin/bash
echo "🔧 Adding badges automatically..."

# 1. Update backend model
cat > backend/src/models/Listing.js << 'MODEL'
import db from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Listing = {
  async create(data) {
    await db.read();
    const listing = {
      _id: uuidv4(),
      ...data,
      images: data.images || [],
      badges: data.badges || [],
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
    let listings = db.data.listings;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      listings = listings.filter(l => 
        l.location.toLowerCase().includes(keyword) ||
        l.title.toLowerCase().includes(keyword) ||
        l.description.toLowerCase().includes(keyword)
      );
    }
    if (filters.isAvailable !== undefined) {
      listings = listings.filter(l => l.isAvailable === filters.isAvailable);
    }
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return listings.slice(0, 100).map(({ viewedBy, ...rest }) => rest);
  },
  async findById(id) {
    await db.read();
    const listing = db.data.listings.find(l => l._id === id);
    if (!listing) return null;
    const { viewedBy, ...rest } = listing;
    return rest;
  },
  async addView(id, ip) {
    await db.read();
    const listing = db.data.listings.find(l => l._id === id);
    if (!listing) return null;
    if (!listing.viewedBy) { listing.viewedBy = []; }
    if (!listing.viewedBy.includes(ip)) {
      listing.viewedBy.push(ip);
      listing.views = (listing.views || 0) + 1;
      await db.write();
    }
    const { viewedBy, ...rest } = listing;
    return rest;
  },
  async update(id, data) {
    await db.read();
    const index = db.data.listings.findIndex(l => l._id === id);
    if (index === -1) return null;
    const viewedBy = db.data.listings[index].viewedBy || [];
    db.data.listings[index] = { ...db.data.listings[index], ...data, viewedBy };
    await db.write();
    const { viewedBy: v, ...rest } = db.data.listings[index];
    return rest;
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
MODEL

# 2. Add badge CSS to frontend
cd frontend
sed -i '/<\/style>/i \
/* Badge styles */\
.badge-verified { background: #dcfce7; color: #166534; padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600; display: inline-block; }\
.badge-owner { background: #dbeafe; color: #1e40af; padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600; display: inline-block; }\
.badge-agent { background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600; display: inline-block; }\
.badge-container { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }' index.html

# 3. Add badge form to Add Listing
sed -i '/<button type="submit" class="btn-primary"/i \                            <!-- Badges Section -->\
                            <div style="margin-bottom: 18px;">\
                                <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #0f172a; font-size: 14px;">Property Badges</label>\
                                <div style="display: flex; flex-wrap: wrap; gap: 10px;">\
                                    <label style="display: flex; align-items: center; gap: 6px; background: #f0fdf4; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #dcfce7;">\
                                        <input type="checkbox" value="verified" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #22c55e;">\
                                        <span style="font-size: 13px; font-weight: 500;">✅ Verified by HomeVN</span>\
                                    </label>\
                                    <label style="display: flex; align-items: center; gap: 6px; background: #eff6ff; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #dbeafe;">\
                                        <input type="checkbox" value="owner" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #3b82f6;">\
                                        <span style="font-size: 13px; font-weight: 500;">🏠 Owner Listed</span>\
                                    </label>\
                                    <label style="display: flex; align-items: center; gap: 6px; background: #fef3c7; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #fde68a;">\
                                        <input type="checkbox" value="agent" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #f59e0b;">\
                                        <span style="font-size: 13px; font-weight: 500;">👔 Agent Listed</span>\
                                    </label>\
                                </div>\
                                <span style="font-size: 12px; color: #94a3b8; margin-top: 4px; display: block;">Select the badges that apply to this property</span>\
                            </div>' index.html

# 4. Add badges to submit function
sed -i '/const videoUrl = document.getElementById/a \            // Collect selected badges\n            const badgeCheckboxes = document.querySelectorAll('\''.badge-checkbox:checked'\'');\n            const badges = Array.from(badgeCheckboxes).map(cb => cb.value);' index.html

cd ~/storage/downloads/homelink

echo ""
echo "✅ Badges feature added successfully!"
echo ""
echo "📤 Now running: git add . && git commit -m 'Add badges feature' && git push"
git add backend/src/models/Listing.js frontend/index.html
git commit -m "Add badges feature: Verified, Owner, Agent"
git push
