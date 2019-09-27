/**
 * Unique key generator
 */
const guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + '-' + s4() + '-' + s4();
}
/**
 * Format in yyyy-mm-dd format
 * @param {*} date 
 */
const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const numberOfDaysBetweenDates = (date1, date2) => {
    return Math.floor(Math.abs(( date1.getTime() - date2.getTime() ) / (60 * 60 * 24 * 1000))) + 1;
}

/**
 * Generates dates from start to number of days
 * @param {*} startDate 
 * @param {*} numberOfDays 
 */
const generateDates = (startDate, numberOfDays) => {
    let from_date = new Date(startDate);
    let dates = [];
    
    dates.push(from_date.toDateString());
    for (var aa = 0; aa < (numberOfDays - 1); aa++) {
        from_date.setDate(from_date.getDate() + 1);
        dates.push(from_date.toDateString());
    }
    return dates;
}

/**
 * Return All booking dates for the given booking
 **/
export const getAllBookingDates = (singleBooking) => {
    let from_date = new Date(singleBooking.from_date);
    let numberOfDays = numberOfDaysOfBooking(singleBooking);    
    return generateDates(from_date, numberOfDays);
}

/**
 * Get number of days of booking
 * @param {*} booking 
 */
export const numberOfDaysOfBooking = (booking) => {
    return ((new Date(booking.to_date)).getTime() - (new Date(booking.from_date)).getTime()) / (60 * 60 * 24 * 1000) + 1;
}

/**
 * Check if the current booking exists with given config
 * @param {*} currentBooking move this booking 
 * @param {*} room_id move currentBooking to this room
 * @param {*} newStartDate move currentBooking to this date
 * @param {*} allBookings list of all booking
 */
export const canExistBooking = (currentBooking, room_id, newStartDate, newEndDate, allBookings) => {

    let numberOfDays = newEndDate == undefined ? numberOfDaysOfBooking(currentBooking) : numberOfDaysBetweenDates(newEndDate, newStartDate);
    let targetBookingDates = generateDates(newStartDate, numberOfDays);

    let conflictedBookings = allBookings.filter(filterSingleBooking => {

        // check is room matches
        if (filterSingleBooking.room_id == room_id && currentBooking.id != filterSingleBooking.id) {
            // check if dates matches
            let filterSingleBookingDates = getAllBookingDates(filterSingleBooking);
            let commonDates = filterSingleBookingDates.filter(tempDate => targetBookingDates.indexOf(tempDate) > -1);

            if (commonDates.length > 0) {
                return true;
            }
        }
        return false;
    });

    return conflictedBookings.length > 0 ? false : true;
}

/**
 * Check if there are conflicts if booking is moved
 * @param {*} currentBooking move this booking 
 * @param {*} room_id move currentBooking to this room
 * @param {*} newStartDate move currentBooking to this date
 * @param {*} allBookings list of all booking
 */
export const moveBooking = (currentBooking, room_id, newStartDate, newEndDate, allBookings) => {
    if (canExistBooking(currentBooking, room_id, newStartDate, newEndDate, allBookings)) {
        allBookings = allBookings.map((booking) => {
            if (booking.id == currentBooking.id) {
                
                booking = currentBooking;
                booking.room_id = room_id;

                let numberOfDays = newEndDate == null ? numberOfDaysOfBooking(currentBooking) : numberOfDaysBetweenDates(newStartDate, newEndDate);
                let allDatesForBooking = generateDates(newStartDate, numberOfDays);
                booking.from_date = formatDate(allDatesForBooking[0]);
                booking.to_date = formatDate(allDatesForBooking[allDatesForBooking.length - 1]);                
            
            }
            return booking;
        })
        return allBookings;
    }
    return false;
}


export default {
    getAllBookingDates: getAllBookingDates,
    canExistBooking: canExistBooking,
    moveBooking: moveBooking,
    guid: guid,
    formatDate: formatDate
}