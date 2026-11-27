/**
 * PDF GENERATION & PRINT SERVICE
 * Handles high-resolution A4 export using html2pdf.js and native browser print
 */

const PDFService = {
  /**
   * Export A4 sheet directly to PDF file
   * @param {'admin'|'user'} mode - Which version to export
   */
  async downloadPDF(mode) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const sheetElement = document.getElementById('biodataSheet');

    if (!sheetElement) {
      console.warn("Biodata sheet not found!");
      return;
    }

    try {
      // Show loading spinner
      if (loadingOverlay) {
        loadingText.textContent = `Preparing ${mode.toUpperCase()} PDF with High-Res Layout...`;
        loadingOverlay.classList.add('active');
      }

      // Temporarily switch view to the target mode
      const previousMode = window.appState ? window.appState.currentViewMode : 'admin';
      if (window.setViewMode) {
        window.setViewMode(mode, false);
      }

      // Allow DOM to settle and images to finish rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // Determine person name for filename
      const personName = (window.appState && window.appState.personal && window.appState.personal.fullName && window.appState.personal.fullName.value)
        ? window.appState.personal.fullName.value.trim().replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_")
        : "Profile";

      const filename = `Biodata_${mode.toUpperCase()}_${personName}.pdf`;

      // Check if html2pdf is available
      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin: 0,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2, // High resolution (crisp text and images)
            useCORS: true,
            logging: false,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
          }
        };

        await html2pdf().set(opt).from(sheetElement).save();

        if (window.showToast) {
          window.showToast(`✅ ${mode.toUpperCase()} PDF downloaded successfully!`, 'success');
        }
      } else {
        // Fallback to print dialog silently
        window.print();
      }

      // Restore view mode if it was changed
      if (window.setViewMode && previousMode !== mode) {
        window.setViewMode(previousMode, false);
      }

    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
      }
    }
  },

  /**
   * Open native print dialog tailored for A4 vector print
   * @param {'admin'|'user'} mode - Which version to print
   */
  print(mode) {
    const previousMode = window.appState ? window.appState.currentViewMode : 'admin';
    if (window.setViewMode) {
      window.setViewMode(mode, false);
    }

    // Set document title so browser names the PDF nicely in Print to PDF
    const personName = (window.appState && window.appState.personal && window.appState.personal.fullName && window.appState.personal.fullName.value)
      ? window.appState.personal.fullName.value.trim()
      : "Biodata";
    const oldTitle = document.title;
    document.title = `Biodata_${mode.toUpperCase()}_${personName}`;

    setTimeout(() => {
      window.print();
      document.title = oldTitle;
      if (window.setViewMode && previousMode !== mode) {
        window.setViewMode(previousMode, false);
      }
    }, 250);
  }
};

window.PDFService = PDFService;
