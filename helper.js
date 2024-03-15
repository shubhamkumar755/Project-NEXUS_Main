
    function parseDate(dateString) {
        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
    
        const monthStr = dateString.substring(0, 3);
        const month = months[monthStr];
        const day = parseInt(dateString.substring(3, 5), 10);
        const year = parseInt(dateString.substring(5), 10);
    
        return new Date(year, month, day);
    }
    
    // Function to check if two dates are within the same week
    function datesWithinSameWeek(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
        return diffDays <= 7;
    }
    
    // Function to match lost and found items within the same week
    function matchLostAndFound(lostItems, foundItems) {
        for (const lostItem of lostItems) {
            for (const foundItem of foundItems) {
                const lostDate = parseDate(lostItem.lostDate);
                const foundDate = parseDate(foundItem.foundDate);
    
                if (datesWithinSameWeek(lostDate, foundDate)) {
                    return true; // Return true if any match is found within the same week
                }
            }
        }
    
        return false; // Return false if no matches are found within the same week
    }
    
    
module.exports={
    matchLostAndFound(lostItems, foundItems){
        for (const lostItem of lostItems) {
            for (const foundItem of foundItems) {
                const lostDate = parseDate(lostItem.lostDate);
                const foundDate = parseDate(foundItem.foundDate);
    
                if (datesWithinSameWeek(lostDate, foundDate)) {
                    return true; // Return true if any match is found within the same week
                }
            }
        }
    
        return false; // Return false if no matches are found within the same week
    }
}