import { Fragment, useEffect, useState } from "react";
import PinAccordianStyle from "./pinAccordian.module.css";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import Tile from "@Components/tile/tile.components";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import PinChatDetails from "../pinChats/pinChatsDetails";

firebase.initializeApp(firebaseConfig);

const PinAccordian = ({
  icon,
  label,
  isCollapsible,
  search,
  data,
  LastPinnedGroups,
  setData,
}) => {
  const [showBody, setShowBody] = useState(true);

  const toggleAccordion = () => {
    setShowBody(!showBody);
  };

  return (
    <Fragment>
      <div
        className={PinAccordianStyle.container}
        onClick={isCollapsible ? toggleAccordion : null}
      >
        <div className={PinAccordianStyle.containerInnerHeader}>
          {icon}
          <div className={PinAccordianStyle.title}>{label}</div>
        </div>
        <div>
          <ArrowDownSVG />
        </div>
      </div>
      {showBody && (
        <PinChatDetails
          search={search}
          data={data}
          LastPinnedGroups={LastPinnedGroups}
          setData={setData}
        />
      )}
    </Fragment>
  );
};

export default PinAccordian;
