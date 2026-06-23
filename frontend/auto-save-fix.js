// Improved auto-save that works even after logout
function saveFormData() {
    try {
        const data = {};
        document.querySelectorAll('#listing-form input, #listing-form textarea, #listing-form select').forEach(el => {
            if (el.id) {
                if (el.type === 'checkbox') {
                    data[el.id] = el.checked;
                } else {
                    data[el.id] = el.value;
                }
            }
        });
        localStorage.setItem('homelink_form_autosave', JSON.stringify(data));
        console.log('✅ Form data saved');
    } catch(e) {}
}

function restoreFormData() {
    try {
        const savedData = localStorage.getItem('homelink_form_autosave');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    if (el.type === 'checkbox') {
                        el.checked = data[key];
                    } else {
                        el.value = data[key];
                    }
                }
            });
            console.log('✅ Form data restored');
        }
    } catch(e) {}
}

// Restore data when page loads
document.addEventListener('DOMContentLoaded', function() {
    restoreFormData();
});
