"use client";

import TimeAgoComponent from "react-timeago";

const TimeAgo = ({ date }: { date: Date }) => {
  return <TimeAgoComponent date={date} />;
}

export default TimeAgo;
