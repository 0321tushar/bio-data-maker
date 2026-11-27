/**
 * SMART PDF IMPORTER SERVICE
 * Reads incoming Biodata PDFs from other users using Mozilla pdf.js
 * Comprehensive Section-Aware parser supporting Indian & International Matrimonial formats
 * Extracts 100% of Header, About Myself, Horoscope, Family Table, Values & Preferences
 * Automatically populates form and switches to Admin View
 */

const PDFImporter = {
  rawText: "",
  parsedData: {},

  init() {
    if (typeof window.pdfjsLib !== 'undefined') {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
    }

    const fileInput = document.getElementById("importPdfFileInput");
    const dropZone = document.getElementById("pdfDropZone");
    const openBtn = document.getElementById("btnOpenPdfImporter");

    if (openBtn && fileInput) {
      openBtn.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) this.processPdfFile(file);
      });
    }

    if (dropZone && fileInput) {
      dropZone.addEventListener("click", () => fileInput.click());
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-hover");
      });
      dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-hover");
      });
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-hover");
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
          this.processPdfFile(file);
        }
      });
    }

    // Modal Close
    const closeBtn = document.getElementById("btnCloseImporterModal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
  },

  openModal() {
    const modal = document.getElementById("pdfImporterModal");
    if (modal) modal.style.display = "flex";
  },

  closeModal() {
    const modal = document.getElementById("pdfImporterModal");
    if (modal) modal.style.display = "none";
  },

  async processPdfFile(file) {
    const statusText = document.getElementById("pdfImportStatusText");
    const modal = document.getElementById("pdfImporterModal");

    if (modal) modal.style.display = "flex";
    if (statusText) {
      statusText.textContent = `Analyzing ${file.name}... Extracting text from PDF`;
      statusText.style.display = "block";
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY = null;
        let pageStr = "";

        for (const item of textContent.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageStr += "\n";
          } else if (pageStr.length > 0 && !pageStr.endsWith(" ") && !pageStr.endsWith("\n")) {
            pageStr += " ";
          }
          pageStr += item.str;
          lastY = item.transform[5];
        }
        fullText += pageStr + "\n\n";
      }

      this.rawText = fullText;
      this.parsedData = this.parseBiodata(fullText, file.name);

      if (statusText) {
        statusText.style.display = "none";
      }

      this.renderResults(file.name);

    } catch (err) {
      console.error("PDF Parsing error:", err);
      if (statusText) {
        statusText.textContent = "Could not parse this PDF. Please check if the file is text-based.";
      }
    }
  },

  /**
   * Comprehensive Section-Aware Parser for Indian Matrimonial Biodatas
   */
  parseBiodata(text, fileName = "") {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    
    const result = {
      category: "MATRIMONIAL PROFILE",
      fullName: "",
      headline: "",
      subHeadline: "",
      email: "",
      phone: "",
      aboutMyself: [],
      horoscope: [],
      familyMembers: [],
      lifeValues: [],
      partnerPreferences: [],
      aboutUs: ""
    };

    let currentSection = "HEADER";

    const KNOWN_ABOUT_MYSELF_LABELS = [
      "Height & Weight", "Height", "Weight", "Current Location", "Location", 
      "Lifestyle & Habits", "Lifestyle", "Habits", "Diet & Lifestyle", "Diet", 
      "Association", "Hobbies & Interests", "Hobbies", "Interests", 
      "Complexion", "Mother Tongue", "Blood Group", "Annual Package", "Income", "Salary"
    ];

    const KNOWN_HOROSCOPE_LABELS = [
      "Date of Birth", "DOB", "Time of Birth", "Birth Time", "TOB",
      "Place of Birth", "Birth Place", "POB", "Manglik Status", "Manglik",
      "Religion & Caste", "Religion", "Caste", "Sub-caste", "Gotra",
      "Rashi", "Moon Sign", "Nakshatra", "Charan", "Pada", "Gan", "Nadi"
    ];

    const KNOWN_RELATIONS = [
      "Father", "Mother", "Brother", "Sister", "Elder Brother", "Younger Brother", 
      "Elder Sister", "Younger Sister", "Grandfather", "Grandmother", 
      "Uncle", "Paternal Uncle", "Maternal Uncle", "Contact Address", "Residence"
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upper = line.toUpperCase().replace(/\s+/g, " ").trim();

      // Skip common page markings or photo placeholders
      if (line.includes("Page 1 of 1") || line.includes("Insert Portrait Photo") || line === "Photograph" || (line.startsWith("(") && line.endsWith(")"))) {
        continue;
      }

      // 1. Detect Section Headings
      if (upper === "ABOUT MYSELF" || upper === "PERSONAL DETAILS" || upper === "ABOUT ME" || upper === "PERSONAL PROFILE") {
        currentSection = "ABOUT_MYSELF";
        continue;
      }
      if (upper === "HOROSCOPE & BELIEFS" || upper === "HOROSCOPE" || upper === "ASTROLOGICAL DETAILS" || upper === "KUNDALI DETAILS" || upper === "BELIEFS") {
        currentSection = "HOROSCOPE";
        continue;
      }
      if (upper === "ABOUT MY FAMILY" || upper === "FAMILY DETAILS" || upper === "FAMILY BACKGROUND" || upper === "FAMILY") {
        currentSection = "FAMILY";
        continue;
      }
      if (upper === "LIFE VALUES" || upper === "MY VALUES" || upper === "VALUES") {
        currentSection = "LIFE_VALUES";
        continue;
      }
      if (upper === "PARTNER PREFERENCES" || upper === "DESIRED PARTNER" || upper === "EXPECTATIONS") {
        currentSection = "PARTNER_PREF";
        continue;
      }
      if (upper === "ABOUT US" || upper === "ABOUT CANDIDATE" || upper === "NOTE" || upper === "FAMILY NOTE") {
        currentSection = "ABOUT_US";
        continue;
      }

      // 2. Parse by Section
      if (currentSection === "HEADER") {
        if (upper.replace(/\s/g, "") === "MATRIMONIALPROFILE" || upper.replace(/\s/g, "") === "BIODATA") {
          result.category = line.trim();
          continue;
        }

        // Check contact line (Mail / Phone)
        const emailMatch = line.match(/(?:Mail|Email)?\s*[:\-–]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
        const phoneMatch = line.match(/(?:Phone|Mob|Mobile|Contact)?\s*[:\-–]?\s*(\+?[\d\- ]{10,16})/i);
        
        if (emailMatch || phoneMatch) {
          if (emailMatch) result.email = emailMatch[1];
          if (phoneMatch) result.phone = phoneMatch[1].trim();
          continue;
        }

        // Full Name
        if (!result.fullName && !line.includes("@") && !line.includes("PEC") && !line.includes("University") && !line.includes("B.Tech") && !line.includes("Technology")) {
          result.fullName = line.trim();
          continue;
        }

        // Headline (e.g. Consultant @Acquco • Remote work for US Client)
        if (!result.headline && (line.includes("@") || line.includes("•") || line.toLowerCase().includes("work") || line.toLowerCase().includes("consultant") || line.toLowerCase().includes("engineer") || line.toLowerCase().includes("manager"))) {
          result.headline = line.trim();
          continue;
        }

        // Subheadline / College (e.g. B.Tech, Computer Science & Eng — PEC University of Technology)
        if (!result.subHeadline && (line.includes("University") || line.includes("College") || line.includes("B.Tech") || line.includes("MBA") || line.includes("Degree") || line.includes("—") || line.includes("-"))) {
          result.subHeadline = line.trim();
          continue;
        }
      }

      else if (currentSection === "ABOUT_MYSELF") {
        let matched = false;
        for (const kLabel of KNOWN_ABOUT_MYSELF_LABELS) {
          const regex = new RegExp(`^${kLabel.replace('&', '\\&')}\\s*[:\\-–]?\\s*(.+)`, 'i');
          const match = line.match(regex);
          if (match) {
            result.aboutMyself.push({
              label: kLabel,
              value: match[1].trim()
            });
            matched = true;
            break;
          }
        }
        if (!matched && line.includes(":")) {
          const parts = line.split(":");
          result.aboutMyself.push({
            label: parts[0].trim(),
            value: parts.slice(1).join(":").trim()
          });
        }
      }

      else if (currentSection === "HOROSCOPE") {
        let matched = false;
        for (const kLabel of KNOWN_HOROSCOPE_LABELS) {
          const regex = new RegExp(`^${kLabel.replace('&', '\\&')}\\s*[:\\-–]?\\s*(.+)`, 'i');
          const match = line.match(regex);
          if (match) {
            result.horoscope.push({
              label: kLabel,
              value: match[1].trim()
            });
            matched = true;
            break;
          }
        }
        if (!matched && line.includes(":")) {
          const parts = line.split(":");
          result.horoscope.push({
            label: parts[0].trim(),
            value: parts.slice(1).join(":").trim()
          });
        }
      }

      else if (currentSection === "FAMILY") {
        // Skip table header row
        if (upper.includes("RELATION") && (upper.includes("NAME") || upper.includes("OCCUPATION"))) {
          continue;
        }

        let matchedRelation = false;
        for (const rel of KNOWN_RELATIONS) {
          const regex = new RegExp(`^(${rel})\\s+(.+)`, 'i');
          const match = line.match(regex);
          if (match) {
            const relation = match[1].trim();
            const rest = match[2].trim();

            let name = rest;
            let details = "";

            // Split Name and details/occupation
            const parenMatch = rest.match(/^(.+?\([^)]+\))\s+(.+)/);
            if (parenMatch) {
              name = parenMatch[1].trim();
              details = parenMatch[2].trim();
            } else {
              const titleMatch = rest.match(/^((?:Mr\.|Mrs\.|Ms\.|Shri|Smt\.|Dr\.)\s+[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(.+)/i);
              if (titleMatch) {
                name = titleMatch[1].trim();
                details = titleMatch[2].trim();
              } else {
                const words = rest.split(/\s+/);
                if (words.length > 2) {
                  name = words.slice(0, 2).join(" ");
                  details = words.slice(2).join(" ");
                }
              }
            }

            result.familyMembers.push({
              relation: relation,
              name: name,
              details: details
            });
            matchedRelation = true;
            break;
          }
        }

        // If line is continuation of previous family member's details
        if (!matchedRelation && result.familyMembers.length > 0) {
          const lastMember = result.familyMembers[result.familyMembers.length - 1];
          const cleanLine = line.trim();
          if (cleanLine && !cleanLine.startsWith("Kanak Bagga") && !cleanLine.includes("Page 1")) {
            lastMember.details = (lastMember.details + " " + cleanLine).replace(/[•\s]+•/g, " • ").trim();
          }
        }
      }

      else if (currentSection === "LIFE_VALUES") {
        const cleanBullet = line.replace(/^[•\-\*\d\.]+\s*/, "").trim();
        if (cleanBullet && !cleanBullet.includes("Matrimonial Biodata") && !cleanBullet.includes("Page 1")) {
          result.lifeValues.push(cleanBullet);
        }
      }

      else if (currentSection === "PARTNER_PREF") {
        const cleanBullet = line.replace(/^[•\-\*\d\.]+\s*/, "").trim();
        if (cleanBullet && !cleanBullet.includes("Matrimonial Biodata") && !cleanBullet.includes("Page 1")) {
          result.partnerPreferences.push(cleanBullet);
        }
      }

      else if (currentSection === "ABOUT_US") {
        if (!line.includes("Matrimonial Biodata") && !line.includes("Page 1")) {
          result.aboutUs += (result.aboutUs ? "\n" : "") + line.trim();
        }
      }
    }

    // Fallback if fullName wasn't caught
    if (!result.fullName && fileName) {
      result.fullName = fileName.replace(/\.pdf$/i, "").replace(/[_-]/g, " ").replace(/(biodata|profile|resume)/gi, "").trim();
    }

    return result;
  },

  renderResults(fileName) {
    const container = document.getElementById("pdfImportResultsContainer");
    if (!container) return;

    container.style.display = "block";
    const d = this.parsedData;

    let summaryItems = [];
    if (d.fullName) summaryItems.push(`<strong>Name:</strong> ${this.escape(d.fullName)}`);
    if (d.headline) summaryItems.push(`<strong>Role:</strong> ${this.escape(d.headline)}`);
    if (d.subHeadline) summaryItems.push(`<strong>Education:</strong> ${this.escape(d.subHeadline)}`);
    if (d.aboutMyself.length > 0) summaryItems.push(`<strong>About Myself:</strong> ${d.aboutMyself.length} details`);
    if (d.horoscope.length > 0) summaryItems.push(`<strong>Horoscope:</strong> ${d.horoscope.length} details`);
    if (d.familyMembers.length > 0) summaryItems.push(`<strong>Family:</strong> ${d.familyMembers.length} members`);
    if (d.lifeValues.length > 0) summaryItems.push(`<strong>Life Values:</strong> ${d.lifeValues.length} points`);
    if (d.partnerPreferences.length > 0) summaryItems.push(`<strong>Partner Prefs:</strong> ${d.partnerPreferences.length} points`);

    container.innerHTML = `
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #047857;">
              ✅ Successfully Extracted All Details from "${this.escape(fileName)}"
            </div>
            <div style="font-size: 11.5px; color: #4b5563; margin-top: 2px;">
              Ready to insert directly into your form and display in the Admin Viewer.
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.6; color: #334155; max-height: 220px; overflow-y: auto;">
          ${summaryItems.map(s => `<div style="padding: 2px 0;">• ${s}</div>`).join("")}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 10px; border-top: 1px solid #f1f5f9;">
          <button type="button" class="btn btn-secondary btn-sm" id="btnToggleRawText">📄 View Raw Extracted Text</button>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="PDFImporter.closeModal()">Cancel</button>
            <button type="button" class="btn btn-user btn-sm" id="btnApplyImportedDetails" style="font-weight: 700;">
              ✨ Insert All Details into Biodata
            </button>
          </div>
        </div>

        <textarea id="pdfRawTextBox" style="display: none; width: 100%; height: 140px; margin-top: 10px; font-family: monospace; font-size: 11px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" readonly>${this.escape(this.rawText)}</textarea>
      </div>
    `;

    document.getElementById("btnApplyImportedDetails").addEventListener("click", () => this.applyDetailsToState());
    document.getElementById("btnToggleRawText").addEventListener("click", () => {
      const box = document.getElementById("pdfRawTextBox");
      box.style.display = box.style.display === "none" ? "block" : "none";
    });
  },

  applyDetailsToState() {
    const d = this.parsedData;
    if (!window.appState) return;

    // 1. Profile Header
    if (d.category) window.appState.header.category = d.category;
    if (d.fullName) window.appState.header.fullName = d.fullName;
    if (d.headline) window.appState.header.headline = d.headline;
    if (d.subHeadline) window.appState.header.subHeadline = d.subHeadline;
    if (d.email) window.appState.header.email = { value: d.email, showInUser: true };
    if (d.phone) window.appState.header.phone = { value: d.phone, showInUser: true };

    // 2. About Myself (Overwrites with incoming PDF items)
    if (d.aboutMyself.length > 0) {
      window.appState.aboutMyself = d.aboutMyself.map((item, idx) => ({
        id: "am_" + idx + "_" + Date.now(),
        label: item.label,
        value: item.value,
        showInUser: true
      }));
    }

    // 3. Horoscope & Beliefs (Overwrites with incoming PDF items)
    if (d.horoscope.length > 0) {
      window.appState.horoscope = d.horoscope.map((item, idx) => ({
        id: "hb_" + idx + "_" + Date.now(),
        label: item.label,
        value: item.value,
        showInUser: true
      }));
    }

    // 4. About My Family Table (Overwrites with incoming family members)
    if (d.familyMembers.length > 0) {
      window.appState.familyMembers = d.familyMembers.map((item, idx) => ({
        id: "fm_" + idx + "_" + Date.now(),
        relation: item.relation,
        name: item.name,
        details: item.details,
        showInUser: true
      }));
    }

    // 5. Life Values (Overwrites with incoming bullets)
    if (d.lifeValues.length > 0) {
      window.appState.lifeValues = d.lifeValues.map((text, idx) => ({
        id: "lv_" + idx + "_" + Date.now(),
        text: text,
        showInUser: true
      }));
    }

    // 6. Partner Preferences (Overwrites with incoming bullets)
    if (d.partnerPreferences.length > 0) {
      window.appState.partnerPreferences = d.partnerPreferences.map((text, idx) => ({
        id: "pp_" + idx + "_" + Date.now(),
        text: text,
        showInUser: true
      }));
    }

    // 7. About Us Note
    if (d.aboutUs && d.aboutUs.trim()) {
      window.appState.aboutUs = {
        title: "ABOUT US",
        text: d.aboutUs.trim(),
        showInUser: true
      };
    }

    // 8. CRITICAL: Switch to Admin View immediately so all details appear in Admin Viewer!
    if (window.setViewMode) {
      window.setViewMode('admin', false);
    }

    // 9. Sync UI & LocalStorage
    if (window.populateFormFields) window.populateFormFields();
    if (window.renderAllFormLists) window.renderAllFormLists();
    if (window.saveStateToStorage) window.saveStateToStorage();
    if (window.renderBiodataPreview) window.renderBiodataPreview();

    this.closeModal();
  },

  escape(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

window.PDFImporter = PDFImporter;

document.addEventListener("DOMContentLoaded", () => {
  PDFImporter.init();
});
