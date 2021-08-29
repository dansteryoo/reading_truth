import React from "react";

/******************************
 *    SideNavbarItem Component   *
 ******************************/

const SideNavbarItem = ({ dailyDevo, days, fetchDevo }) => {
    return (
        <li className="daily-devo-li" onClick={() => fetchDevo(dailyDevo.id)}>
            <div className="daily-devo-days">
                <span>Day: </span>
                {days + 1}
            </div>
            <div className="daily-devo-title">
                <span>Title: </span>
                {dailyDevo.title}
            </div>
        </li>
    );
};

export default SideNavbarItem;
