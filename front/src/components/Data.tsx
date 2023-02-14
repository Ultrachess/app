//Create react typescript component that takes in utc date and returns a human readable date
import React from 'react';

const DateDisplay = ({current}: {current: number}) => {
    const date = new Date(current)
    const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
    return (
        <div>
            {date.toLocaleDateString("en-US", options)}
        </div>
    );
}

export default DateDisplay;