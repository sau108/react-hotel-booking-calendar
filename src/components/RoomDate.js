import React, { useContext } from 'react';
import { ItemTypes } from './Constant';
import { useDrop } from 'react-dnd';
import CalendarContext from './CalendarContext';

/**
 * small grid box which forms from combination of rows(room) and columns(date)
 * @param {*} props 
 */
function RoomDate(props) {

    // load default context
    const context = useContext(CalendarContext);

    // enable drop
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.BOOKING,
        
        drop: (singleBookingDraggableItem) => {
            context.actionMoveBooking(singleBookingDraggableItem.singleBooking, props.room.id, props.day);
            // context.actionOpenPopup(singleBookingDraggableItem.singleBooking);
        },

        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    const clickHandler = (event) => {
        context.actionOpenPopup({room_id:props.room.id, from_date:props.day, to_date:props.day});
    }

    return (
        <td ref={drop} key={props.day.getTime()} style={{ "width": (props.cellWidth + "px") }} onClick={clickHandler}>
            {props.children}
        </td>
    );
}
export default RoomDate;