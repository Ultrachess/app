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