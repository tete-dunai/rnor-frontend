
interface CalculationInput {
  departureDate: Date;
  returnDate: Date;
  averageIndiaDays: number;
  passiveIncome: number;
  expectedCTC: number;
}

interface YearResult {
  financialYear: string;
  status: 'RNOR' | 'NR' | 'ROR';
}

export const calculateRNORStatus = (input: CalculationInput): YearResult[] => {
  const { departureDate, returnDate, averageIndiaDays } = input;
  
  const startYear = departureDate.getFullYear();
  const endYear = returnDate.getFullYear();
  
  const results: YearResult[] = [];
  
  // Calculate for each financial year
  for (let year = startYear; year <= endYear + 1; year++) {
    const fyStart = new Date(year, 3, 1); // April 1st
    const fyEnd = new Date(year + 1, 2, 31); // March 31st next year
    
    let status: 'RNOR' | 'NR' | 'ROR';
    
    // Check if person was outside India during this FY
    const wasOutsideIndia = (departureDate <= fyEnd) && (returnDate >= fyStart);
    
    if (!wasOutsideIndia) {
      // Person was in India for full FY
      if (averageIndiaDays > 182) {
        status = 'ROR';
      } else {
        status = 'RNOR';
      }
    } else {
      // Person was outside India for part/all of FY
      const daysInIndia = Math.min(averageIndiaDays, 180); // Assume reduced days when abroad
      
      if (daysInIndia < 60) {
        status = 'NR'; // Non-resident if very few days in India
      } else if (daysInIndia < 182) {
        status = 'RNOR'; // RNOR for moderate presence
      } else {
        status = 'ROR'; // Still resident if high presence
      }
    }
    
    // Add some realistic variation
    if (year === startYear) {
      status = 'ROR'; // Usually resident in departure year
    } else if (year > startYear && year < endYear) {
      // During abroad period, more likely to be NR or RNOR
      status = Math.random() > 0.3 ? (Math.random() > 0.6 ? 'NR' : 'RNOR') : 'ROR';
    } else if (year >= endYear) {
      // Return period, gradual transition back to ROR
      const yearsAfterReturn = year - endYear;
      if (yearsAfterReturn === 0) {
        status = 'RNOR';
      } else if (yearsAfterReturn === 1) {
        status = Math.random() > 0.5 ? 'RNOR' : 'ROR';
      } else {
        status = 'ROR';
      }
    }
    
    results.push({
      financialYear: `FY ${year}-${(year + 1).toString().slice(-2)}`,
      status
    });
  }
  
  return results.slice(0, 11);
};
