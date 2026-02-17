// Sector translation helper
export const translateSector = (sector) => {
  const translations = {
    'Engineering': 'INGENIERÍA',
    'Health': 'SALUD',
    'Finance': 'FINANZAS',
    'Education': 'EDUCACIÓN',
    'Legal': 'LEGAL',
    'General': 'GENERAL'
  };
  return translations[sector] || sector;
};
