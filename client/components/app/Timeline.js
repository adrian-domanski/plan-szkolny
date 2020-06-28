import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import { getAllTasksByClassQuery } from "../../queries/taskQueries";
import { AuthContext } from "../../context/authContext";

const Timeline = ({ selectedDay, setSelectedDay }) => {
  const {
    authContext: { user },
  } = useContext(AuthContext);
  const { data: tasksData, loading: tasksLoading } = useQuery(
    getAllTasksByClassQuery,
    {
      variables: { code: user.class && user.class.code },
      ssr: false,
      skip: !user.class,
    }
  );
  const [days, setDays] = useState([]);

  const checkIfDayHasTasks = (dayNumber) => {
    const tasks = tasksData
      ? [...tasksData.getTasksByClass, ...user.tasks]
      : user.tasks;

    return !!tasks.find(
      (task) => new Date(task.date).getDate().toString() === dayNumber
    );
  };

  useEffect(() => {
    function getCurrentWeek() {
      const currentDate = moment();
      // Start from sunday
      const weekStart = currentDate.clone();
      let days = [];
      for (let i = 0; i <= 6; i++) {
        const day = moment(weekStart).add(i, "days");
        days.push({
          dayShort: day.locale("pl").format("dd").toUpperCase(),
          dayNumber: day.format("D"),
          isSelected: day.date() === selectedDay,
          isToday: day.format("D") === currentDate.format("D"),
          hasTasks: checkIfDayHasTasks(day.format("D")),
        });
      }
      return days;
    }

    if (!tasksLoading) {
      setDays(getCurrentWeek());
    }
  }, [tasksLoading]);

  const handleSelectedChange = (dayNumber) => {
    const tempArr = days.map((day) => {
      if (day.dayNumber === dayNumber) {
        day.isSelected = true;
      } else {
        day.isSelected = false;
      }
      return day;
    });
    setDays(tempArr);
    setSelectedDay(dayNumber);
  };
  return (
    <div className="timeline">
      <div className="timeline-grid">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            className={`timeline-item ${day.isToday ? "today" : ""} ${
              day.isSelected ? "selected" : ""
            } ${day.hasTasks ? "has-tasks" : ""}`}
            onClick={() => handleSelectedChange(day.dayNumber)}>
            <div className="timeline-item__day-short">{day.dayShort}</div>
            <div className="timeline-item__day-number">{day.dayNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
