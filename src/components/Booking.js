import React, {useContext} from 'react';
import { ItemTypes } from './Constant';
import { useDrag } from 'react-dnd'
import CalendarContext from './CalendarContext';

function Booking(props) {

    // load default context
    const context = useContext(CalendarContext);

    // enable dragging of component
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.BOOKING, singleBooking:props.book },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    // generate random background color for a booking
    const bgColor = () => {
        let h = ((new Date(props.book.from_date)).getTime() * 21 * props.book.room_id) % 255;
        return "hsla("+h+", 29%, 60%, 0.9)";
    }

    // get inner content of the booking
    const getContent = () => {
        let title = "AD-" + props.book.adult_count + " CD-" + props.book.child_count;
        let guests = props.book.guests;
        if (guests.length > 0) {
            title = guests[0].name;
            if (guests.length > 1) {
                title = title + '(+' + (guests.length-1) + 'more)';
            }
        }
        return title;
    }

    // get title attribute of the booking
    const getTitle = () => {
        let title = [];
        let guests = props.book.guests;
        for (let aa = 0; aa < guests.length; aa++) {
            title[aa] = '- ' + guests[aa].name + '('+guests[aa].age+'y)';
        }
        return title.join("\n") + "\n  for " + number_of_days + " days";
    }


    // calculate number of days for which booking is done
    let number_of_days = ((new Date(props.book.to_date)).getTime() - (new Date(props.book.from_date)).getTime()) / (60 * 60 * 24 * 1000) + 1;

    if (number_of_days > 0) {
        let style = {
            width: (number_of_days * 100) + '%',
            backgroundColor:bgColor()
        };
        return (
            <div onClick={(event) => {context.actionOpenPopup(props.book);event.stopPropagation();event.preventDefault();}} ref={drag} className="booking"  style={style} >
                <div title={getTitle()} className="booking-inner">{getContent()}</div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default Booking;