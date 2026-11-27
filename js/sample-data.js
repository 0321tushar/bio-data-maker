/**
 * Sample Bio Data matching the exact modern executive Matrimonial Profile layout
 * Includes "About Us" section for candidate/family write-up
 */
const SAMPLE_DATA = {
  header: {
    category: "MATRIMONIAL PROFILE",
    fullName: "Kanak Bagga",
    headline: "Consultant @Acquco • Remote work for US Client",
    subHeadline: "B.Tech, Computer Science & Eng — PEC University of Technology",
    email: { value: "kanakbagga1@gmail.com", showInUser: true },
    phone: { value: "+91-9803982585", showInUser: true },
    showPhotoInUser: true,
    photoUrl: "" // Placeholder or uploaded image
  },
  aboutMyself: [
    { id: "am_1", label: "Height & Weight", value: "5'11\" | 70 Kg approx.", showInUser: true },
    { id: "am_2", label: "Current Location", value: "Mohali, Punjab", showInUser: true },
    { id: "am_3", label: "Annual Package", value: "₹ 35 LPA (US Client Consulting)", showInUser: false }, // Sensitive -> Admin Only!
    { id: "am_4", label: "Lifestyle & Habits", value: "Health & Fitness Conscious. Vegetarian. No Alcohol, No Drugs, No Smoking.", showInUser: true },
    { id: "am_5", label: "Association", value: "Faculty, Art of Living", showInUser: true }
  ],
  horoscope: [
    { id: "hb_1", label: "Date of Birth", value: "15-09-1995", showInUser: true },
    { id: "hb_2", label: "Time of Birth", value: "07:20 AM", showInUser: false }, // Sensitive -> Admin Only!
    { id: "hb_3", label: "Place of Birth", value: "Ludhiana, Punjab", showInUser: false }, // Admin Only!
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
      showInUser: false // Sensitive address -> Admin Only!
    }
  ],
  lifeValues: [
    { id: "lv_1", text: "Empathetic, Disciplined, and Growth Mindset.", showInUser: true },
    { id: "lv_2", text: "Spiritual and deeply values Cultural Roots.", showInUser: true },
    { id: "lv_3", text: "Committed to maintaining a healthy Work-Life Balance.", showInUser: true },
    { id: "lv_4", text: "Family-oriented with strong financial planning and investments.", showInUser: false } // Admin Only note
  ],
  partnerPreferences: [
    { id: "pp_1", text: "Loving, Caring, and Supportive.", showInUser: true },
    { id: "pp_2", text: "Preferably Vegetarian and a Teetotaller.", showInUser: true },
    { id: "pp_3", text: "Educated professional open to relocating or mutual career growth.", showInUser: false } // Admin Only note
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
  },
  theme: "theme-emerald-modern"
};

// Expose globally
if (typeof window !== "undefined") {
  window.SAMPLE_DATA = SAMPLE_DATA;
}
