import React, {useContext, useState} from 'react';
import CalendarContext from './../CalendarContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingHelper from './../../helpers/BookingHelper';
 


function BookingPopup(props) {
    
    // enter default from_date
    if (props.data.booking && props.data.booking.from_date != null) {
        props.data.booking.from_date = new Date(props.data.booking.from_date);
        props.data.booking.to_date = new Date(props.data.booking.to_date);   
    }

    let booking = Object.assign({
        id : null,
        room_id: null,
        guest_name:'New resv',
        objective:'',
        unit:'',
        channel:null,
        adult_count:0,
        child_count:0,  
        from_date:new Date(),
        to_date: new Date(),
        guests:[],
        checkAvailability: true
    }, props.data.booking, );
    
    const [state, setState] = useState( booking );

    const onChangeHandler = (event) => {
        let newBooking = {...state};
        newBooking[event.target.name] = event.target.value;
        setState(newBooking);
    }

    const dateChangeHandler = (property, date) => {
        let newBooking = {...state};
        newBooking[property] = date;
        newBooking.checkAvailability = true;
        setState(newBooking);
    }

    const context = useContext(CalendarContext);

    const checkAvailabilityHandler = (e) => {
        
        let status = context.actionCanExistBooking(state, state.room_id, state.from_date, state.to_date);
        if (status == false) {
            alert('This booking conflicts with other booking');
        } else {
            let newState = {...state};
            newState.checkAvailability = false;
            setState(newState);
        }

        e.preventDefault();
    }

    const confirmBookingHandler = (e) => {
        if (props.data.booking.id == null) {
            state.id = BookingHelper.guid();
            context.actionCreateBooking(state);

        } else
            context.actionMoveBooking(state, state.room_id, state.from_date, state.to_date);

        context.actionClosePopup();
        e.preventDefault();
    }

    const addGuestHandler = (e) => {
        if (document.querySelector('[name=new_guest_name]').value != '' && document.querySelector('[name=new_guest_age]').value != '') {
            let newState = {...state};
            newState.guests.push({
                name:document.querySelector('[name=new_guest_name]').value,
                age:document.querySelector('[name=new_guest_age]').value,
                security_number: document.querySelector('[name=new_guest_security_no]').value
            });
            setState(newState);
            document.querySelector('[name=new_guest_name]').value = '';
            document.querySelector('[name=new_guest_age]').value = '';
            document.querySelector('[name=new_guest_security_no]').value = '';
        }
        e.preventDefault();
    };

    let style = props.data.show == false ? {display:"none",zIndex:-1} : {display:'block',zIndex:10};

    const changeCount = (name, direction, event) => {
        let input = document.querySelector('input[name='+name+']');
        let inputValue = input.value != "" ? input.value : 0;
        
        if (direction == 'up') {
            inputValue++;
        } else if (inputValue > 0) {
            inputValue--;
        }
        input.value = inputValue;
        
        let newState = {...state};
        newState[name] = inputValue;
        setState(newState);
        
        event.preventDefault();
    }

    let bottomActionButton = null;
    if (state.checkAvailability) {
        bottomActionButton = <button className="btn btn-danger" onClick={(e) => checkAvailabilityHandler(e)}>Check avalability</button>;
    } else {
        bottomActionButton = <button className="btn btn-success" onClick={(e) => confirmBookingHandler(e)}>Confirm booking</button>;
    }

    let heading = (state.id == null) ? 'New Reservation' : 'Edit Reservation';

    let guestJsx = state.guests.map((guest, index) => {
        return <tr key={index}>
                <td>{index + 1}</td>
                <td>{guest.name}</td>
                <td>{guest.age}</td>
                <td>{guest.security_number}</td>
            </tr>;
    })

    return (
        <div className="popup-wrapper" style={style}>
            <div className="popup booking-popup">
                <div className="card">
                    <div className="card-header text-center">
                        <h5>
                            <span>{heading}</span>
                            <button onClick={() => context.actionClosePopup()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </h5>
                    </div>
                    <div className="card-body">
                        <form action="" className="form">

                            <div className="row">
                                <div className="col-md-4 ">
                                    <h5>Reservation Dates : </h5>
                                </div>
                                <div className="col-md-3 ">
                                        <DatePicker
                                        selected={state.from_date}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('from_date', date)}
                                        />
                                </div>
                                <div className="col-md-1"> &nbsp; &nbsp;to </div>
                                <div className="col-md-3">
                                    <DatePicker
                                        selected={state.to_date}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('to_date', date)}
                                        />
                                </div>
                            </div>
                            <hr/>

                            <h5>Guests</h5>
                            <table className="table table-striped table-bordered table-sm" id="guest-list-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Security No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guestJsx}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_name" placeholder="Name" />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_age" placeholder="Age" />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_security_no" placeholder="Social Security number" />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="text-right">
                            <button onClick={(e) => addGuestHandler(e)} className="btn btn-success btn-block1">ADD GUEST</button>

                            </div>

                            <hr/>

                            <div className="row">
                                <div className="col-md-2"><h5>Objective :</h5> </div>
                                <div className="col-md-10">
                                    <textarea name="objective" id=""  rows="3" className="form-control" onChange={(event) => onChangeHandler(event)} defaultValue={state.objective}></textarea>
                                </div>
                            </div>
                            <hr />

                            <div className="text-center">
                                {bottomActionButton}
                            </div>
                            
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPopup;