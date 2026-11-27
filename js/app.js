/**
 * MAIN BIODATA APPLICATION LOGIC (EXECUTIVE MATRIMONIAL LAYOUT)
 * Exact replica of the Kanak Bagga Matrimonial Profile design
 * Dual View: Admin (Full Details) vs User (Selective Details)
 */

let appState = {
  currentViewMode: 'admin', // 'admin' | 'user'
  zoomLevel: 1.0,
  theme: "theme-emerald-modern",
  header: {
    category: "MATRIMONIAL PROFILE",
    fullName: "Kanak Bagga",
    headline: "Consultant @Acquco • Remote work for US Client",
    subHeadline: "B.Tech, Computer Science & Eng — PEC University of Technology",
    email: { value: "kanakbagga1@gmail.com", showInUser: true },
    phone: { value: "+91-9803982585", showInUser: true },
    showPhotoInUser: true,
    photoUrl: ""
  },
  aboutMyself: [
    { id: "am_1", label: "Height & Weight", value: "5'11\" | 70 Kg approx.", showInUser: true },
    { id: "am_2", label: "Current Location", value: "Mohali, Punjab", showInUser: true },
    { id: "am_3", label: "Annual Package", value: "₹ 35 LPA (US Client Consulting)", showInUser: false }, // Sensitive -> Admin Only
    { id: "am_4", label: "Lifestyle & Habits", value: "Health & Fitness Conscious. Vegetarian. No Alcohol, No Drugs, No Smoking.", showInUser: true },
    { id: "am_5", label: "Association", value: "Faculty, Art of Living", showInUser: true }
  ],
  horoscope: [
    { id: "hb_1", label: "Date of Birth", value: "15-09-1995", showInUser: true },
    { id: "hb_2", label: "Time of Birth", value: "07:20 AM", showInUser: false }, // Sensitive -> Admin Only
    { id: "hb_3", label: "Place of Birth", value: "Ludhiana, Punjab", showInUser: false },
    { id: "hb_4", label: "Manglik Status", value: "Not Manglik", showInUser: true },
    { id: "hb_5", label: "Religion & Caste", value: "Hindu | Caste: Valmiki", showInUser: true }
  ],
  familyMembers: [
    {
      id: "fm_1",
      relation: "Father",
      name: "Mr. Charan Dass",
      details: "Retired Govt Employee, Canara Bank",
      showInUser: true
    },
    {
      id: "fm_2",
      relation: "Mother",
      name: "Mrs. Shashi Kiran",
      details: "Govt Employee, PUDA",
      showInUser: true
    },
    {
      id: "fm_3",
      relation: "Brother",
      name: "Rajat Bagga (Lives in US)",
      details: "B.Tech, IIT Delhi • M.Des, California College of Arts • Faculty, Art of Living",
      showInUser: true
    },
    {
      id: "fm_4",
      relation: "Contact Address",
      name: "Family Residence",
      details: "House #142, Sector 70, Mohali, Punjab (Near Community Center)",
      showInUser: false // Sensitive -> Admin Only
    }
  ],
  lifeValues: [
    { id: "lv_1", text: "Empathetic, Disciplined, and Growth Mindset.", showInUser: true },
    { id: "lv_2", text: "Spiritual and deeply values Cultural Roots.", showInUser: true },
    { id: "lv_3", text: "Committed to maintaining a healthy Work-Life Balance.", showInUser: true },
    { id: "lv_4", text: "Family-oriented with strong financial planning and investments.", showInUser: false } // Sensitive note
  ],
  partnerPreferences: [
    { id: "pp_1", text: "Loving, Caring, and Supportive.", showInUser: true },
    { id: "pp_2", text: "Preferably Vegetarian and a Teetotaller.", showInUser: true },
    { id: "pp_3", text: "Educated professional open to relocating or mutual career growth.", showInUser: false } // Sensitive note
  ],
  aboutUs: {
    title: "ABOUT US",
    text: "Kanak is a grounded, hardworking, and calm individual who strikes a fine balance between progressive modern thinking and deep-rooted family traditions. Our family is closely knit, educated, and values mutual respect, simplicity, and continuous learning. We look forward to connecting with a cultured family sharing similar life philosophies.",
    showInUser: true
  },
  photos: [
    { id: "photo_1", label: "Photo 1 (Portrait)", url: "", showInUser: true },
    { id: "photo_2", label: "Photo 2 (Full Length)", url: "", showInUser: true },
    { id: "photo_3", label: "Photo 3 (Casual)", url: "", showInUser: true }
  ],
  footer: {
    tagline: "Matrimonial Biodata",
    pageText: "Page 1 of 1"
  }
};

window.appState = appState;
const STORAGE_KEY = "ANTIGRAVITY_BIODATA_DATA_EXECUTIVE_V2";

/* =========================================================
   INITIALIZATION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  setupEventListeners();
  populateFormFields();
  renderAllFormLists();
  renderBiodataPreview();
});

/* =========================================================
   LOCAL STORAGE PERSISTENCE
   ========================================================= */
function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("Storage save failed:", e);
  }
}

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = deepMerge(appState, parsed);
      window.appState = appState;
      return;
    }
  } catch (e) {
    console.warn("Storage load failed:", e);
  }

  // Load sample data if no saved state
  if (typeof window.SAMPLE_DATA !== "undefined") {
    loadSampleData(false);
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      target[key] = source[key];
    } else if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/* =========================================================
   EVENT LISTENERS SETUP
   ========================================================= */
function setupEventListeners() {
  // Tabs: Admin vs User
  const tabAdmin = document.getElementById("tabAdminView");
  const tabUser = document.getElementById("tabUserView");

  if (tabAdmin) tabAdmin.addEventListener("click", () => setViewMode("admin", true));
  if (tabUser) tabUser.addEventListener("click", () => setViewMode("user", true));

  // Theme dropdown
  const themeSelect = document.getElementById("themeSelector");
  if (themeSelect) {
    themeSelect.value = appState.theme;
    themeSelect.addEventListener("change", (e) => setTheme(e.target.value));
  }

  // Header Text Inputs
  const categoryInput = document.getElementById("input_header_category");
  const nameInput = document.getElementById("input_header_fullName");
  const headlineInput = document.getElementById("input_header_headline");
  const subHeadlineInput = document.getElementById("input_header_subHeadline");
  const emailInput = document.getElementById("input_header_email");
  const emailToggle = document.getElementById("toggle_header_email");
  const phoneInput = document.getElementById("input_header_phone");
  const phoneToggle = document.getElementById("toggle_header_phone");

  if (categoryInput) {
    categoryInput.addEventListener("input", (e) => {
      appState.header.category = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      appState.header.fullName = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (headlineInput) {
    headlineInput.addEventListener("input", (e) => {
      appState.header.headline = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (subHeadlineInput) {
    subHeadlineInput.addEventListener("input", (e) => {
      appState.header.subHeadline = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (emailInput) {
    emailInput.addEventListener("input", (e) => {
      appState.header.email.value = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (emailToggle) {
    emailToggle.addEventListener("change", (e) => {
      appState.header.email.showInUser = e.target.checked;
      updateVisibilityPillVisuals();
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      appState.header.phone.value = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (phoneToggle) {
    phoneToggle.addEventListener("change", (e) => {
      appState.header.phone.showInUser = e.target.checked;
      updateVisibilityPillVisuals();
      saveStateToStorage();
      renderBiodataPreview();
    });
  }

  // About Us Inputs
  const aboutUsTitleInput = document.getElementById("input_aboutUs_title");
  const aboutUsTextInput = document.getElementById("input_aboutUs_text");
  const aboutUsToggle = document.getElementById("toggle_aboutUs_showInUser");

  if (aboutUsTitleInput) {
    aboutUsTitleInput.addEventListener("input", (e) => {
      if (!appState.aboutUs) appState.aboutUs = {};
      appState.aboutUs.title = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (aboutUsTextInput) {
    aboutUsTextInput.addEventListener("input", (e) => {
      if (!appState.aboutUs) appState.aboutUs = {};
      appState.aboutUs.text = e.target.value;
      saveStateToStorage();
      renderBiodataPreview();
    });
  }
  if (aboutUsToggle) {
    aboutUsToggle.addEventListener("change", (e) => {
      if (!appState.aboutUs) appState.aboutUs = {};
      appState.aboutUs.showInUser = e.target.checked;
      updateVisibilityPillVisuals();
      saveStateToStorage();
      renderBiodataPreview();
    });
  }

  // 3 Photos Event Listeners
  [1, 2, 3].forEach(idx => {
    const fileInput = document.getElementById(`fileInput_photo_${idx}`);
    const uploadBtn = document.getElementById(`uploadPhotoBtn_${idx}`);
    const removeBtn = document.getElementById(`removePhotoBtn_${idx}`);
    const toggle = document.getElementById(`toggle_photo_${idx}_showInUser`);

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener("click", () => fileInput.click());
    }
    if (removeBtn) {
      removeBtn.addEventListener("click", () => removePhoto(idx - 1));
    }
    if (fileInput) {
      fileInput.addEventListener("change", (e) => handlePhotoUpload(e, idx - 1));
    }
    if (toggle) {
      toggle.addEventListener("change", (e) => {
        if (!appState.photos) appState.photos = [];
        if (!appState.photos[idx - 1]) {
          appState.photos[idx - 1] = { id: `photo_${idx}`, label: `Photo ${idx}`, url: "", showInUser: true };
        }
        appState.photos[idx - 1].showInUser = e.target.checked;
        updateVisibilityPillVisuals();
        saveStateToStorage();
        renderBiodataPreview();
      });
    }
  });

  // Presets
  const presetHideSensitive = document.getElementById("presetHideSensitive");
  const presetShowAll = document.getElementById("presetShowAll");
  const presetEssential = document.getElementById("presetEssential");

  if (presetHideSensitive) presetHideSensitive.addEventListener("click", applyPresetHideSensitive);
  if (presetShowAll) presetShowAll.addEventListener("click", applyPresetShowAll);
  if (presetEssential) presetEssential.addEventListener("click", applyPresetEssentialOnly);

  // Top action buttons
  const btnLoadSample = document.getElementById("btnLoadSample");
  const btnClearAll = document.getElementById("btnClearAll");

  if (btnLoadSample) btnLoadSample.addEventListener("click", () => loadSampleData(true));
  if (btnClearAll) btnClearAll.addEventListener("click", clearAllFields);

  // Export buttons
  const btnDownloadAdmin = document.getElementById("btnDownloadAdmin");
  const btnDownloadUser = document.getElementById("btnDownloadUser");
  const btnPrintAdmin = document.getElementById("btnPrintAdmin");
  const btnPrintUser = document.getElementById("btnPrintUser");

  if (btnDownloadAdmin) {
    btnDownloadAdmin.addEventListener("click", () => {
      if (window.PDFService) window.PDFService.downloadPDF("admin");
    });
  }
  if (btnDownloadUser) {
    btnDownloadUser.addEventListener("click", () => {
      if (window.PDFService) window.PDFService.downloadPDF("user");
    });
  }
  if (btnPrintAdmin) {
    btnPrintAdmin.addEventListener("click", () => {
      if (window.PDFService) window.PDFService.print("admin");
    });
  }
  if (btnPrintUser) {
    btnPrintUser.addEventListener("click", () => {
      if (window.PDFService) window.PDFService.print("user");
    });
  }

  // Zoom Controls
  const zoomIn = document.getElementById("zoomInBtn");
  const zoomOut = document.getElementById("zoomOutBtn");
  const zoomFit = document.getElementById("zoomFitBtn");

  if (zoomIn) zoomIn.addEventListener("click", () => setZoom(appState.zoomLevel + 0.1));
  if (zoomOut) zoomOut.addEventListener("click", () => setZoom(appState.zoomLevel - 0.1));
  if (zoomFit) zoomFit.addEventListener("click", () => setZoom(1.0));

  // Add Item Buttons for Lists
  const btnAddAboutMyself = document.getElementById("btnAddAboutMyself");
  const btnAddHoroscope = document.getElementById("btnAddHoroscope");
  const btnAddFamilyMember = document.getElementById("btnAddFamilyMember");
  const btnAddLifeValue = document.getElementById("btnAddLifeValue");
  const btnAddPartnerPref = document.getElementById("btnAddPartnerPref");

  if (btnAddAboutMyself) btnAddAboutMyself.addEventListener("click", handleAddAboutMyself);
  if (btnAddHoroscope) btnAddHoroscope.addEventListener("click", handleAddHoroscope);
  if (btnAddFamilyMember) btnAddFamilyMember.addEventListener("click", handleAddFamilyMember);
  if (btnAddLifeValue) btnAddLifeValue.addEventListener("click", handleAddLifeValue);
  if (btnAddPartnerPref) btnAddPartnerPref.addEventListener("click", handleAddPartnerPref);

  // Collapsible Accordions
  document.querySelectorAll(".form-section-header").forEach(header => {
    header.addEventListener("click", (e) => {
      if (e.target.closest(".section-bulk-toggle")) return;
      const section = header.closest(".form-section");
      if (section) section.classList.toggle("open");
    });
  });

  // Section bulk toggle
  document.querySelectorAll(".section-bulk-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const sectionKey = btn.dataset.section;
      if (sectionKey) toggleAllInSection(sectionKey);
    });
  });
}

/* =========================================================
   VIEW MODE TOGGLING (ADMIN vs USER)
   ========================================================= */
function setViewMode(mode, showNotification = false) {
  appState.currentViewMode = mode;
  const tabAdmin = document.getElementById("tabAdminView");
  const tabUser = document.getElementById("tabUserView");
  const statusPill = document.getElementById("previewStatusPill");

  if (mode === 'admin') {
    if (tabAdmin) tabAdmin.className = "view-tab active-admin";
    if (tabUser) tabUser.className = "view-tab";
    if (statusPill) {
      statusPill.innerHTML = `<span class="status-dot admin"></span> <strong>ADMIN PREVIEW</strong> — Showing All Details + Red Privacy Flags`;
    }
  } else {
    if (tabAdmin) tabAdmin.className = "view-tab";
    if (tabUser) tabUser.className = "view-tab active-user";
    if (statusPill) {
      statusPill.innerHTML = `<span class="status-dot user"></span> <strong>USER PREVIEW</strong> — Strictly Showing Selected Details Only`;
    }
  }

  renderBiodataPreview();
}
window.setViewMode = setViewMode;

/* =========================================================
   THEME SWITCHING
   ========================================================= */
function setTheme(themeName) {
  const theme = "theme-emerald-modern";
  appState.theme = theme;
  const sheet = document.getElementById("biodataSheet");
  if (sheet) {
    sheet.className = `biodata-sheet ${theme}`;
  }
  saveStateToStorage();
}

/* =========================================================
   ZOOM ENGINE
   ========================================================= */
function setZoom(val) {
  val = Math.max(0.6, Math.min(1.4, Math.round(val * 10) / 10));
  appState.zoomLevel = val;
  const box = document.getElementById("previewCenterBox");
  const zoomFit = document.getElementById("zoomFitBtn");
  if (box) {
    box.style.transform = `scale(${val})`;
  }
  if (zoomFit) {
    zoomFit.textContent = `${Math.round(val * 100)}%`;
  }
}

/* =========================================================
   POPULATE FORM FIELDS
   ========================================================= */
function populateFormFields() {
  const h = appState.header;
  setInputValue("input_header_category", h.category);
  setInputValue("input_header_fullName", h.fullName);
  setInputValue("input_header_headline", h.headline);
  setInputValue("input_header_subHeadline", h.subHeadline);
  setInputValue("input_header_email", h.email.value);
  setCheckboxValue("toggle_header_email", h.email.showInUser);
  setInputValue("input_header_phone", h.phone.value);
  setCheckboxValue("toggle_header_phone", h.phone.showInUser);

  if (appState.aboutUs) {
    setInputValue("input_aboutUs_title", appState.aboutUs.title);
    setInputValue("input_aboutUs_text", appState.aboutUs.text);
    setCheckboxValue("toggle_aboutUs_showInUser", appState.aboutUs.showInUser);
  }

  // Populate 3 Photos
  [1, 2, 3].forEach(idx => {
    const p = (appState.photos && appState.photos[idx - 1]) ? appState.photos[idx - 1] : { url: "", showInUser: true };
    setCheckboxValue(`toggle_photo_${idx}_showInUser`, p.showInUser);
    updatePhotoThumb(idx - 1);
  });
  updateVisibilityPillVisuals();
  setTheme(appState.theme);
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function setCheckboxValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = !!val;
}

function updateVisibilityPillVisuals() {
  document.querySelectorAll(".visibility-toggle-label").forEach(label => {
    const cb = label.querySelector("input[type='checkbox']");
    if (!cb) return;
    if (cb.checked) {
      label.classList.remove("unchecked");
      label.classList.add("checked");
      label.title = "Included in User PDF";
    } else {
      label.classList.remove("checked");
      label.classList.add("unchecked");
      label.title = "Hidden from User PDF (Admin Only)";
    }
  });
  updateStatsCount();
}

function updateStatsCount() {
  let total = 0;
  let userVisible = 0;

  // Header items
  if (appState.header.email.value) { total++; if (appState.header.email.showInUser) userVisible++; }
  if (appState.header.phone.value) { total++; if (appState.header.phone.showInUser) userVisible++; }

  // About Myself
  appState.aboutMyself.forEach(item => {
    if (item.value && item.value.trim()) {
      total++;
      if (item.showInUser) userVisible++;
    }
  });

  // Horoscope
  appState.horoscope.forEach(item => {
    if (item.value && item.value.trim()) {
      total++;
      if (item.showInUser) userVisible++;
    }
  });

  // Family Members
  appState.familyMembers.forEach(item => {
    if (item.name || item.details) {
      total++;
      if (item.showInUser) userVisible++;
    }
  });

  // Life Values
  appState.lifeValues.forEach(item => {
    if (item.text && item.text.trim()) {
      total++;
      if (item.showInUser) userVisible++;
    }
  });

  // Partner Preferences
  appState.partnerPreferences.forEach(item => {
    if (item.text && item.text.trim()) {
      total++;
      if (item.showInUser) userVisible++;
    }
  });

  // About Us
  if (appState.aboutUs && appState.aboutUs.text && appState.aboutUs.text.trim()) {
    total++;
    if (appState.aboutUs.showInUser) userVisible++;
  }

  const statsElem = document.getElementById("activeFieldsCounter");
  if (statsElem) {
    statsElem.textContent = `${userVisible} of ${total} items visible in User PDF`;
  }
}

/* =========================================================
   LIST EDITORS RENDERING
   ========================================================= */
function renderAllFormLists() {
  renderAboutMyselfEditor();
  renderHoroscopeEditor();
  renderFamilyEditor();
  renderLifeValuesEditor();
  renderPartnerPrefEditor();
}

// 1. About Myself Editor
function renderAboutMyselfEditor() {
  const container = document.getElementById("aboutMyselfList");
  if (!container) return;

  container.innerHTML = appState.aboutMyself.map((item, idx) => `
    <div class="field-item">
      <div class="field-header-row">
        <input type="text" class="form-input" style="font-weight: 700; width: 160px;" value="${escapeHtml(item.label)}" onchange="updateAboutMyselfField('${item.id}', 'label', this.value)" placeholder="Label">
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="visibility-toggle-label ${item.showInUser ? 'checked' : 'unchecked'}">
            <input type="checkbox" ${item.showInUser ? 'checked' : ''} onchange="updateAboutMyselfField('${item.id}', 'showInUser', this.checked)">
            <span>${item.showInUser ? 'In User PDF' : 'Admin Only'}</span>
          </label>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteAboutMyselfField('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <input type="text" class="form-input" value="${escapeHtml(item.value)}" onchange="updateAboutMyselfField('${item.id}', 'value', this.value)" placeholder="Value">
    </div>
  `).join("");
}

window.updateAboutMyselfField = function (id, key, val) {
  const item = appState.aboutMyself.find(x => x.id === id);
  if (item) {
    item[key] = val;
    renderAboutMyselfEditor();
    saveStateToStorage();
    renderBiodataPreview();
  }
};

window.deleteAboutMyselfField = function (id) {
  appState.aboutMyself = appState.aboutMyself.filter(x => x.id !== id);
  renderAboutMyselfEditor();
  saveStateToStorage();
  renderBiodataPreview();
};

function handleAddAboutMyself() {
  const labelEl = document.getElementById("newAboutMyselfLabel");
  const valEl = document.getElementById("newAboutMyselfValue");
  const showEl = document.getElementById("newAboutMyselfShowInUser");
  if (!labelEl || !valEl) return;

  const label = labelEl.value.trim();
  const val = valEl.value.trim();
  if (!label) { labelEl.focus(); return; }

  appState.aboutMyself.push({
    id: "am_" + Date.now(),
    label: label,
    value: val,
    showInUser: showEl ? showEl.checked : true
  });

  labelEl.value = "";
  valEl.value = "";
  renderAboutMyselfEditor();
  saveStateToStorage();
  renderBiodataPreview();
  showToast(`Added "${label}" to About Myself`, 'success');
}

// 2. Horoscope Editor
function renderHoroscopeEditor() {
  const container = document.getElementById("horoscopeList");
  if (!container) return;

  container.innerHTML = appState.horoscope.map(item => `
    <div class="field-item">
      <div class="field-header-row">
        <input type="text" class="form-input" style="font-weight: 700; width: 160px;" value="${escapeHtml(item.label)}" onchange="updateHoroscopeField('${item.id}', 'label', this.value)" placeholder="Label">
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="visibility-toggle-label ${item.showInUser ? 'checked' : 'unchecked'}">
            <input type="checkbox" ${item.showInUser ? 'checked' : ''} onchange="updateHoroscopeField('${item.id}', 'showInUser', this.checked)">
            <span>${item.showInUser ? 'In User PDF' : 'Admin Only'}</span>
          </label>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteHoroscopeField('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <input type="text" class="form-input" value="${escapeHtml(item.value)}" onchange="updateHoroscopeField('${item.id}', 'value', this.value)" placeholder="Value">
    </div>
  `).join("");
}

window.updateHoroscopeField = function (id, key, val) {
  const item = appState.horoscope.find(x => x.id === id);
  if (item) {
    item[key] = val;
    renderHoroscopeEditor();
    saveStateToStorage();
    renderBiodataPreview();
  }
};

window.deleteHoroscopeField = function (id) {
  appState.horoscope = appState.horoscope.filter(x => x.id !== id);
  renderHoroscopeEditor();
  saveStateToStorage();
  renderBiodataPreview();
};

function handleAddHoroscope() {
  const labelEl = document.getElementById("newHoroscopeLabel");
  const valEl = document.getElementById("newHoroscopeValue");
  const showEl = document.getElementById("newHoroscopeShowInUser");
  if (!labelEl || !valEl) return;

  const label = labelEl.value.trim();
  const val = valEl.value.trim();
  if (!label) { labelEl.focus(); return; }

  appState.horoscope.push({
    id: "hb_" + Date.now(),
    label: label,
    value: val,
    showInUser: showEl ? showEl.checked : true
  });

  labelEl.value = "";
  valEl.value = "";
  renderHoroscopeEditor();
  saveStateToStorage();
  renderBiodataPreview();
  showToast(`Added "${label}" to Horoscope`, 'success');
}

// 3. Family Members Table Editor
function renderFamilyEditor() {
  const container = document.getElementById("familyMembersList");
  if (!container) return;

  container.innerHTML = appState.familyMembers.map(item => `
    <div class="field-item" style="border-left: 3px solid var(--primary-brand);">
      <div class="field-header-row" style="margin-bottom: 6px;">
        <input type="text" class="form-input" style="font-weight: 700; width: 140px;" value="${escapeHtml(item.relation)}" onchange="updateFamilyMember('${item.id}', 'relation', this.value)" placeholder="Relation (e.g. Father)">
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="visibility-toggle-label ${item.showInUser ? 'checked' : 'unchecked'}">
            <input type="checkbox" ${item.showInUser ? 'checked' : ''} onchange="updateFamilyMember('${item.id}', 'showInUser', this.checked)">
            <span>${item.showInUser ? 'In User PDF' : 'Admin Only'}</span>
          </label>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteFamilyMember('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 180px 1fr; gap: 8px;">
        <input type="text" class="form-input" value="${escapeHtml(item.name)}" onchange="updateFamilyMember('${item.id}', 'name', this.value)" placeholder="Name (e.g. Mr. Charan Dass)">
        <input type="text" class="form-input" value="${escapeHtml(item.details)}" onchange="updateFamilyMember('${item.id}', 'details', this.value)" placeholder="Qualification & Occupation">
      </div>
    </div>
  `).join("");
}

window.updateFamilyMember = function (id, key, val) {
  const item = appState.familyMembers.find(x => x.id === id);
  if (item) {
    item[key] = val;
    renderFamilyEditor();
    saveStateToStorage();
    renderBiodataPreview();
  }
};

window.deleteFamilyMember = function (id) {
  appState.familyMembers = appState.familyMembers.filter(x => x.id !== id);
  renderFamilyEditor();
  saveStateToStorage();
  renderBiodataPreview();
};

function handleAddFamilyMember() {
  const relEl = document.getElementById("newFamilyRelation");
  const nameEl = document.getElementById("newFamilyName");
  const detailsEl = document.getElementById("newFamilyDetails");
  const showEl = document.getElementById("newFamilyShowInUser");
  if (!relEl || !nameEl) return;

  const rel = relEl.value.trim();
  const name = nameEl.value.trim();
  const details = detailsEl ? detailsEl.value.trim() : "";
  if (!rel || !name) {
    if (!rel) relEl.focus();
    else nameEl.focus();
    return;
  }

  appState.familyMembers.push({
    id: "fm_" + Date.now(),
    relation: rel,
    name: name,
    details: details,
    showInUser: showEl ? showEl.checked : true
  });

  relEl.value = "";
  nameEl.value = "";
  if (detailsEl) detailsEl.value = "";
  renderFamilyEditor();
  saveStateToStorage();
  renderBiodataPreview();
  showToast(`Added ${rel} to Family Table`, 'success');
}

// 4. Life Values Editor
function renderLifeValuesEditor() {
  const container = document.getElementById("lifeValuesList");
  if (!container) return;

  container.innerHTML = appState.lifeValues.map(item => `
    <div class="field-item">
      <div class="field-header-row">
        <span style="font-size: 11px; font-weight: 600; color: #4b5563;">• Bullet Item</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="visibility-toggle-label ${item.showInUser ? 'checked' : 'unchecked'}">
            <input type="checkbox" ${item.showInUser ? 'checked' : ''} onchange="updateLifeValue('${item.id}', 'showInUser', this.checked)">
            <span>${item.showInUser ? 'In User PDF' : 'Admin Only'}</span>
          </label>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteLifeValue('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <input type="text" class="form-input" value="${escapeHtml(item.text)}" onchange="updateLifeValue('${item.id}', 'text', this.value)" placeholder="Life value statement...">
    </div>
  `).join("");
}

window.updateLifeValue = function (id, key, val) {
  const item = appState.lifeValues.find(x => x.id === id);
  if (item) {
    item[key] = val;
    renderLifeValuesEditor();
    saveStateToStorage();
    renderBiodataPreview();
  }
};

window.deleteLifeValue = function (id) {
  appState.lifeValues = appState.lifeValues.filter(x => x.id !== id);
  renderLifeValuesEditor();
  saveStateToStorage();
  renderBiodataPreview();
};

function handleAddLifeValue() {
  const textEl = document.getElementById("newLifeValueText");
  const showEl = document.getElementById("newLifeValueShowInUser");
  if (!textEl) return;
  const text = textEl.value.trim();
  if (!text) { textEl.focus(); return; }

  appState.lifeValues.push({
    id: "lv_" + Date.now(),
    text: text,
    showInUser: showEl ? showEl.checked : true
  });

  textEl.value = "";
  renderLifeValuesEditor();
  saveStateToStorage();
  renderBiodataPreview();
  showToast("Added Life Value item", 'success');
}

// 5. Partner Preferences Editor
function renderPartnerPrefEditor() {
  const container = document.getElementById("partnerPrefList");
  if (!container) return;

  container.innerHTML = appState.partnerPreferences.map(item => `
    <div class="field-item">
      <div class="field-header-row">
        <span style="font-size: 11px; font-weight: 600; color: #4b5563;">• Bullet Item</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="visibility-toggle-label ${item.showInUser ? 'checked' : 'unchecked'}">
            <input type="checkbox" ${item.showInUser ? 'checked' : ''} onchange="updatePartnerPref('${item.id}', 'showInUser', this.checked)">
            <span>${item.showInUser ? 'In User PDF' : 'Admin Only'}</span>
          </label>
          <button type="button" class="btn btn-sm btn-danger" onclick="deletePartnerPref('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <input type="text" class="form-input" value="${escapeHtml(item.text)}" onchange="updatePartnerPref('${item.id}', 'text', this.value)" placeholder="Preference statement...">
    </div>
  `).join("");
}

window.updatePartnerPref = function (id, key, val) {
  const item = appState.partnerPreferences.find(x => x.id === id);
  if (item) {
    item[key] = val;
    renderPartnerPrefEditor();
    saveStateToStorage();
    renderBiodataPreview();
  }
};

window.deletePartnerPref = function (id) {
  appState.partnerPreferences = appState.partnerPreferences.filter(x => x.id !== id);
  renderPartnerPrefEditor();
  saveStateToStorage();
  renderBiodataPreview();
};

function handleAddPartnerPref() {
  const textEl = document.getElementById("newPartnerPrefText");
  const showEl = document.getElementById("newPartnerPrefShowInUser");
  if (!textEl) return;
  const text = textEl.value.trim();
  if (!text) { textEl.focus(); return; }

  appState.partnerPreferences.push({
    id: "pp_" + Date.now(),
    text: text,
    showInUser: showEl ? showEl.checked : true
  });

  textEl.value = "";
  renderPartnerPrefEditor();
  saveStateToStorage();
  renderBiodataPreview();
}

/* =========================================================
   3-PHOTOS UPLOAD / REMOVE LOGIC
   ========================================================= */
function handlePhotoUpload(e, photoIndex) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 600;
      const MAX_HEIGHT = 750;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      if (!appState.photos) appState.photos = [];
      if (!appState.photos[photoIndex]) {
        appState.photos[photoIndex] = { id: `photo_${photoIndex + 1}`, label: `Photo ${photoIndex + 1}`, url: "", showInUser: true };
      }
      appState.photos[photoIndex].url = canvas.toDataURL("image/jpeg", 0.92);

      updatePhotoThumb(photoIndex);
      saveStateToStorage();
      renderBiodataPreview();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto(photoIndex) {
  if (appState.photos && appState.photos[photoIndex]) {
    appState.photos[photoIndex].url = "";
  }
  const fileInput = document.getElementById(`fileInput_photo_${photoIndex + 1}`);
  if (fileInput) fileInput.value = "";
  updatePhotoThumb(photoIndex);
  saveStateToStorage();
  renderBiodataPreview();
}
window.removePhoto = removePhoto;

function updatePhotoThumb(photoIndex) {
  const idx = photoIndex + 1;
  const thumb = document.getElementById(`photoThumb_${idx}`);
  const removeBtn = document.getElementById(`removePhotoBtn_${idx}`);
  if (!thumb) return;

  const p = (appState.photos && appState.photos[photoIndex]) ? appState.photos[photoIndex] : null;
  if (p && p.url) {
    thumb.innerHTML = `<img src="${p.url}" alt="Photo ${idx}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 3px;" />`;
    if (removeBtn) removeBtn.style.display = "inline-flex";
  } else {
    thumb.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    if (removeBtn) removeBtn.style.display = "none";
  }
}

/* =========================================================
   PRESETS
   ========================================================= */
function applyPresetHideSensitive() {
  // Hide sensitive details from User PDF
  appState.aboutMyself.forEach(item => {
    if (item.label.toLowerCase().includes("income") || item.label.toLowerCase().includes("package")) {
      item.showInUser = false;
    }
  });

  appState.horoscope.forEach(item => {
    if (item.label.toLowerCase().includes("time") || item.label.toLowerCase().includes("place")) {
      item.showInUser = false;
    }
  });

  appState.familyMembers.forEach(item => {
    if (item.relation.toLowerCase().includes("address") || item.relation.toLowerCase().includes("property")) {
      item.showInUser = false;
    }
  });

  renderAllFormLists();
  saveStateToStorage();
  renderBiodataPreview();
  showToast("Applied Preset: Sensitive details hidden from User PDF!", "success");
}

function applyPresetShowAll() {
  appState.header.email.showInUser = true;
  appState.header.phone.showInUser = true;

  appState.aboutMyself.forEach(item => item.showInUser = true);
  appState.horoscope.forEach(item => item.showInUser = true);
  appState.familyMembers.forEach(item => item.showInUser = true);
  appState.lifeValues.forEach(item => item.showInUser = true);
  appState.partnerPreferences.forEach(item => item.showInUser = true);
  if (appState.aboutUs) appState.aboutUs.showInUser = true;
  if (appState.photos) appState.photos.forEach(p => p.showInUser = true);

  populateFormFields();
  renderAllFormLists();
  saveStateToStorage();
  renderBiodataPreview();
  showToast("Applied Preset: All details visible in User PDF!", "info");
}

function applyPresetEssentialOnly() {
  applyPresetHideSensitive();
  appState.header.email.showInUser = false;
  populateFormFields();
  renderAllFormLists();
  saveStateToStorage();
  renderBiodataPreview();
  showToast("Applied Preset: Basic matrimonial details only!", "info");
}

function toggleAllInSection(secKey) {
  let list;
  if (secKey === 'aboutMyself') list = appState.aboutMyself;
  else if (secKey === 'horoscope') list = appState.horoscope;
  else if (secKey === 'family') list = appState.familyMembers;
  else if (secKey === 'lifeValues') list = appState.lifeValues;
  else if (secKey === 'partnerPreferences') list = appState.partnerPreferences;

  if (!list) return;
  const anyChecked = list.some(x => x.showInUser);
  const target = !anyChecked;
  list.forEach(x => x.showInUser = target);

  renderAllFormLists();
  saveStateToStorage();
  renderBiodataPreview();
  showToast(`${target ? "Included" : "Excluded"} all items in User PDF`, "info");
}

/* =========================================================
   SAMPLE DATA LOADER & CLEAR ALL
   ========================================================= */
function loadSampleData(showToastMsg = true) {
  if (typeof window.SAMPLE_DATA === "undefined") {
    return;
  }

  appState = JSON.parse(JSON.stringify(window.SAMPLE_DATA));
  window.appState = appState;
  appState.currentViewMode = 'admin';
  appState.zoomLevel = 1.0;

  populateFormFields();
  renderAllFormLists();
  saveStateToStorage();
  setViewMode('admin', false);
  renderBiodataPreview();
}

function clearAllFields() {
  // Clear directly without any browser confirm popup
  appState.header.fullName = "";
  appState.header.headline = "";
  appState.header.subHeadline = "";
  appState.header.email.value = "";
  appState.header.phone.value = "";
  appState.header.photoUrl = "";
  appState.aboutMyself = [];
  appState.horoscope = [];
  appState.familyMembers = [];
  appState.lifeValues = [];
  appState.partnerPreferences = [];
  if (appState.aboutUs) {
    appState.aboutUs.text = "";
  }
  if (appState.photos) {
    appState.photos.forEach(p => p.url = "");
  }

  populateFormFields();
  renderAllFormLists();
  saveStateToStorage();
  renderBiodataPreview();
}

/* =========================================================
   CORE PREVIEW RENDERER
   Replicates the exact Executive Matrimonial Profile layout!
   ========================================================= */
function renderBiodataPreview() {
  const sheet = document.getElementById("biodataSheet");
  if (!sheet) return;

  const mode = appState.currentViewMode; // 'admin' | 'user'
  const h = appState.header;

  // 1. Top Stripe
  const topStripeHtml = `<div class="sheet-top-stripe"></div>`;

  // 2. Profile Header (Left: Name & details, Right: Photo)
  // Contact bar elements
  const showEmail = (mode === 'admin') ? !!h.email.value : (h.email.showInUser && !!h.email.value);
  const showPhone = (mode === 'admin') ? !!h.phone.value : (h.phone.showInUser && !!h.phone.value);

  const emailBadge = (mode === 'admin' && !h.email.showInUser && h.email.value) ? `<span class="admin-badge-indicator">🔒 Admin Only</span>` : '';
  const phoneBadge = (mode === 'admin' && !h.phone.showInUser && h.phone.value) ? `<span class="admin-badge-indicator">🔒 Admin Only</span>` : '';

  let contactItems = [];
  if (showEmail) {
    contactItems.push(`<span class="contact-item-group"><strong>Mail:</strong> ${escapeHtml(h.email.value)}${emailBadge}</span>`);
  }
  if (showPhone) {
    contactItems.push(`<span class="contact-item-group"><strong>Phone:</strong> ${escapeHtml(h.phone.value)}${phoneBadge}</span>`);
  }

  const contactBarHtml = contactItems.length > 0 ? `
    <div class="profile-contact-bar">
      ${contactItems.join('<span class="contact-divider">|</span>')}
    </div>
  ` : '';

  const headerBlockHtml = `
    <div class="profile-header-container" style="display: block;">
      <div class="profile-header-left" style="max-width: 100%; width: 100%;">
        ${h.category ? `<div class="profile-category-tag">${escapeHtml(h.category)}</div>` : ''}
        ${h.fullName ? `<h1 class="profile-full-name">${escapeHtml(h.fullName)}</h1>` : ''}
        ${h.headline ? `<div class="profile-headline">${escapeHtml(h.headline)}</div>` : ''}
        ${h.subHeadline ? `<div class="profile-subheadline">${escapeHtml(h.subHeadline)}</div>` : ''}
        ${contactBarHtml}
      </div>
    </div>
  `;

  // 3. ABOUT MYSELF Section
  const visibleAboutMyself = appState.aboutMyself.filter(item => {
    if (!item.value || !item.value.trim()) return false;
    return (mode === 'admin') ? true : item.showInUser;
  });

  const aboutMyselfHtml = visibleAboutMyself.length > 0 ? `
    <div class="sheet-section">
      <h2 class="section-heading-text">ABOUT MYSELF</h2>
      <table class="details-table">
        <tbody>
          ${visibleAboutMyself.map(item => `
            <tr>
              <td class="details-label">
                ${escapeHtml(item.label)}
                ${(mode === 'admin' && !item.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : ''}
              </td>
              <td class="details-value">${escapeHtml(item.value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : '';

  // 4. HOROSCOPE & BELIEFS Section
  const visibleHoroscope = appState.horoscope.filter(item => {
    if (!item.value || !item.value.trim()) return false;
    return (mode === 'admin') ? true : item.showInUser;
  });

  const horoscopeHtml = visibleHoroscope.length > 0 ? `
    <div class="sheet-section">
      <h2 class="section-heading-text">HOROSCOPE &amp; BELIEFS</h2>
      <table class="details-table">
        <tbody>
          ${visibleHoroscope.map(item => `
            <tr>
              <td class="details-label">
                ${escapeHtml(item.label)}
                ${(mode === 'admin' && !item.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : ''}
              </td>
              <td class="details-value">${escapeHtml(item.value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : '';

  // 5. ABOUT MY FAMILY Table Section
  const visibleFamily = appState.familyMembers.filter(item => {
    if (!item.relation && !item.name && !item.details) return false;
    return (mode === 'admin') ? true : item.showInUser;
  });

  const familyTableHtml = visibleFamily.length > 0 ? `
    <div class="sheet-section">
      <h2 class="section-heading-text">ABOUT MY FAMILY</h2>
      <table class="family-table">
        <thead>
          <tr>
            <th>Relation</th>
            <th>Name</th>
            <th>Qualification &amp; Occupation</th>
          </tr>
        </thead>
        <tbody>
          ${visibleFamily.map(item => `
            <tr>
              <td class="col-relation">
                ${escapeHtml(item.relation)}
                ${(mode === 'admin' && !item.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : ''}
              </td>
              <td class="col-name">${escapeHtml(item.name)}</td>
              <td class="col-details">${escapeHtml(item.details)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : '';

  // 6. LIFE VALUES Section
  const visibleLifeValues = appState.lifeValues.filter(item => {
    if (!item.text || !item.text.trim()) return false;
    return (mode === 'admin') ? true : item.showInUser;
  });

  const lifeValuesHtml = visibleLifeValues.length > 0 ? `
    <div class="sheet-section">
      <h2 class="section-heading-text">LIFE VALUES</h2>
      <ul class="bullet-list">
        ${visibleLifeValues.map(item => `
          <li>
            ${escapeHtml(item.text)}
            ${(mode === 'admin' && !item.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : ''}
          </li>
        `).join("")}
      </ul>
    </div>
  ` : '';

  // 7. PARTNER PREFERENCES Section
  const visiblePartnerPrefs = appState.partnerPreferences.filter(item => {
    if (!item.text || !item.text.trim()) return false;
    return (mode === 'admin') ? true : item.showInUser;
  });

  const partnerPrefsHtml = visiblePartnerPrefs.length > 0 ? `
    <div class="sheet-section">
      <h2 class="section-heading-text">PARTNER PREFERENCES</h2>
      <ul class="bullet-list">
        ${visiblePartnerPrefs.map(item => `
          <li>
            ${escapeHtml(item.text)}
            ${(mode === 'admin' && !item.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : ''}
          </li>
        `).join("")}
      </ul>
    </div>
  ` : '';

  // 8. ABOUT US Section
  let aboutUsHtml = "";
  const hasAboutUsText = appState.aboutUs && appState.aboutUs.text && appState.aboutUs.text.trim();
  const canShowAboutUs = (mode === 'admin') ? hasAboutUsText : (hasAboutUsText && appState.aboutUs.showInUser);

  if (canShowAboutUs) {
    const aboutUsBadge = (mode === 'admin' && !appState.aboutUs.showInUser) ? '<span class="admin-badge-indicator">🔒 Admin Only</span>' : '';
    aboutUsHtml = `
      <div class="sheet-section">
        <h2 class="section-heading-text">
          ${escapeHtml(appState.aboutUs.title || "ABOUT US")}
          ${aboutUsBadge}
        </h2>
        <div class="about-us-paragraph">${escapeHtml(appState.aboutUs.text)}</div>
      </div>
    `;
  }

  // 9. BOTTOM 3-PHOTOGRAPHS GALLERY
  let photosHtml = "";
  const photosList = (appState.photos && appState.photos.length > 0) ? appState.photos : [
    { id: "photo_1", label: "Portrait Photo", url: "", showInUser: true },
    { id: "photo_2", label: "Full Length Photo", url: "", showInUser: true },
    { id: "photo_3", label: "Casual / Modern Photo", url: "", showInUser: true }
  ];

  const visiblePhotos = photosList.filter(p => {
    if (mode === 'admin') return true;
    return p.showInUser;
  });

  if (visiblePhotos.length > 0) {
    const photoCards = visiblePhotos.map((p, idx) => {
      const isHiddenInUser = !p.showInUser;
      const adminBadge = (mode === 'admin' && isHiddenInUser)
        ? `<div class="admin-badge-indicator" style="position: absolute; bottom: 6px; left: 6px; font-size: 7.5px; z-index: 2;">🔒 Admin Only</div>`
        : '';

      const photoContent = p.url
        ? `<img src="${p.url}" alt="${escapeHtml(p.label || ('Photo ' + (idx + 1)))}" />`
        : `<div class="bottom-photo-placeholder">
             <div class="p-icon">📷</div>
             <div class="p-title">${escapeHtml(p.label || ('Photo ' + (idx + 1)))}</div>
             <div class="p-sub">(Insert Photo)</div>
           </div>`;

      return `
        <div class="bottom-photo-card">
          <div class="bottom-photo-inner">
            ${photoContent}
            ${adminBadge}
          </div>
        </div>
      `;
    }).join("");

    photosHtml = `
      <div class="sheet-section bottom-photos-section">
        <div class="bottom-photos-grid" style="grid-template-columns: repeat(${visiblePhotos.length}, 1fr);">
          ${photoCards}
        </div>
      </div>
    `;
  }

  // 10. Footer
  const personName = h.fullName ? h.fullName.trim() : "Candidate";
  const footerHtml = `
    <div class="sheet-footer">
      <div class="sheet-footer-left">${escapeHtml(personName)} — Matrimonial Biodata</div>
      <div class="sheet-footer-right">Page 1 of 1</div>
    </div>
  `;

  // Assemble the exact sheet DOM
  sheet.innerHTML = `
    <div>
      ${topStripeHtml}
      ${headerBlockHtml}
      <div class="sheet-main-content">
        ${aboutMyselfHtml}
        ${horoscopeHtml}
        ${familyTableHtml}
        ${lifeValuesHtml}
        ${partnerPrefsHtml}
        ${aboutUsHtml}
        ${photosHtml}
      </div>
    </div>
    ${footerHtml}
  `;

  updateStatsCount();
}

/* =========================================================
   UTILITIES
   ========================================================= */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = 'info') {
  // Silent - No popups or toast messages on screen
  return;
}

window.showToast = showToast;
window.renderBiodataPreview = renderBiodataPreview;
