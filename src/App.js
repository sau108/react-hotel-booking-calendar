import React from 'react';
import './App.css';
import Calender from './components/Calender';
import bookingData from './data/bookings';
import roomData from './data/rooms';
import BookingHelper from './helpers/BookingHelper';

function App() {
  
  let rooms = roomData;

  let bookings = bookingData;

  bookings = bookings.map((book, index) => {

    let today = new Date();
    today.setDate(today.getDate() + 2 * index  + Math.floor(Math.random() * 10) % 2 + 1);
    book.from_date = BookingHelper.formatDate(today);
    today.setDate(today.getDate() + Math.floor(Math.random() * 10) % 5 + 1);
    book.to_date = BookingHelper.formatDate(today);
    return book;
  });

  let viewStartDate = BookingHelper.formatDate(new Date());

  console.log('aa', bookings);

  let dataCallback = (data) => {
    console.log('Exported Booking Data :: ', data);
  }

  return (
    <div className="App">
      <Calender rooms={rooms} bookings={bookings} bookingDataCallback={dataCallback} viewStartDate={viewStartDate} ></Calender>
    </div>
  );
}

export default App;
