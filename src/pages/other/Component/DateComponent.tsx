import React from "react";

type DateFormatterProps = {
    dateString: string;
};

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
};

const DateFormatter: React.FC<DateFormatterProps> = ({ dateString }) => {
    return <span>{formatDate(dateString)}</span>;
};

export default DateFormatter;