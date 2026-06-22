#!/bin/bash
echo "🔧 Fixing badges..."

# Backup current file
cp index.html index.html.before-badges-fix

# Find and replace the renderAdd function with a working version
sed -i '/function renderAdd() {/,/}/c\
function renderAdd() {\
    const houseTypes = ['\''Single Room'\'', '\''Studio'\'', '\''1 Bedroom'\'', '\''2 Bedroom'\'', '\''3 Bedroom'\'', '\''Apartment'\'', '\''Other'\''];\
    \
    return `\
        <div class="container" style="padding: 32px 0; max-width: 768px;">\
            <div class="form-card">\
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">\
                    <i class="fas fa-plus-circle" style="color: #FF385C; font-size: 28px;"></i>\
                    <h1 style="font-size: 28px; font-weight: 700; color: #0f172a;">Add New Listing</h1>\
                </div>\
                <p style="color: #64748b; margin-bottom: 24px; font-size: 16px;">Fill in the information to list your property</p>\
                <div id="form-message" style="display: none; padding: 14px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 14px;"></div>\
                <form id="listing-form" onsubmit="submitListing(event)">\
                    <div style="margin-bottom: 18px;">\
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Title *</label>\
                        <input type="text" id="title" required placeholder="e.g., Beautiful 2-bedroom apartment" class="input-field">\
                    </div>\
                    <div style="margin-bottom: 18px;">\
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Description *</label>\
                        <textarea id="description" required rows="4" placeholder="Describe your property..." class="input-field" style="resize: vertical;"></textarea>\
                    </div>\
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px;">\
                        <div>\
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Price (FCFA/month) *</label>\
                            <input type="number" id="price" required min="0" placeholder="150000" class="input-field">\
                        </div>\
                        <div>\
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Location *</label>\
                            <input type="text" id="location" required placeholder="e.g., Molyko, Buea" class="input-field">\
                        </div>\
                    </div>\
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px;">\
                        <div>\
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Property Type *</label>\
                            <select id="houseType" required class="input-field">\
                                <option value="">Select type</option>\
                                ${houseTypes.map(t => `<option value="${t}">${t}</option>`).join('\'\'')}\
                            </select>\
                        </div>\
                        <div>\
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">WhatsApp Number *</label>\
                            <input type="tel" id="whatsapp" required placeholder="690123456" class="input-field">\
                        </div>\
                    </div>\
                    <div style="margin-bottom: 18px;">\
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">TikTok Video Link *</label>\
                        <input type="url" id="video-url" required placeholder="https://www.tiktok.com/@user/video/123456789" class="input-field">\
                    </div>\
                    <div style="margin-bottom: 18px;">\
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 14px;">Image Link (optional)</label>\
                        <input type="url" id="image-url" placeholder="https://i.imgur.com/xxxxx.jpg" class="input-field">\
                    </div>\
                    <!-- BADGES SECTION - This is the important part -->\
                    <div style="margin-bottom: 18px;">\
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #0f172a; font-size: 14px;">Property Badges</label>\
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">\
                            <label style="display: flex; align-items: center; gap: 6px; background: #f0fdf4; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #dcfce7;">\
                                <input type="checkbox" value="verified" id="badge-verified" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #22c55e;">\
                                <span style="font-size: 13px; font-weight: 500;">✅ Verified by HomeVN</span>\
                            </label>\
                            <label style="display: flex; align-items: center; gap: 6px; background: #eff6ff; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #dbeafe;">\
                                <input type="checkbox" value="owner" id="badge-owner" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #3b82f6;">\
                                <span style="font-size: 13px; font-weight: 500;">🏠 Owner Listed</span>\
                            </label>\
                            <label style="display: flex; align-items: center; gap: 6px; background: #fef3c7; padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 2px solid #fde68a;">\
                                <input type="checkbox" value="agent" id="badge-agent" class="badge-checkbox" style="width: 18px; height: 18px; accent-color: #f59e0b;">\
                                <span style="font-size: 13px; font-weight: 500;">👔 Agent Listed</span>\
                            </label>\
                        </div>\
                        <span style="font-size: 12px; color: #94a3b8; margin-top: 4px; display: block;">Select the badges that apply to this property</span>\
                    </div>\
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">\
                        <div style="display: flex; align-items: center; gap: 12px;">\
                            <input type="checkbox" id="available" checked style="width: 20px; height: 20px; accent-color: #FF385C;">\
                            <label style="font-weight: 500; color: #0f172a;">Available</label>\
                        </div>\
                        <div style="display: flex; align-items: center; gap: 12px;">\
                            <input type="checkbox" id="featured" style="width: 20px; height: 20px; accent-color: #f59e0b;">\
                            <label style="font-weight: 500; color: #0f172a;">⭐ Featured</label>\
                        </div>\
                    </div>\
                    <button type="submit" class="btn-primary" style="width: 100%; padding: 16px; font-size: 18px;">\
                        <span id="submit-text"><i class="fas fa-plus"></i> Publish Listing</span>\
                        <span id="submit-loading" style="display: none;"><i class="fas fa-spinner fa-spin"></i> Publishing...</span>\
                    </button>\
                </form>\
            </div>\
        </div>\
    `;\
}' index.html

echo "✅ Badges form fixed!"
