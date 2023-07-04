import ChatListingStyles from "./chatListing.module.css";
import { ReactComponent as FiUserPlusSVG } from "@SVG/fiUserPlus.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMemberListingHandler } from "@/redux_toolkit/slices/addMemberListing";
import { ReactComponent as FiChevronLeftSVG } from "@SVG/fiChevronLeft.svg";
import { ReactComponent as SearchSVG } from "@SVG/search.svg";

firebase.initializeApp(firebaseConfig);

const AddMembers = ({
  allChannelItem,
  showAddMemberModel,
  setShowAddMemberModel,
  setHideMemberModel,
  userDataList,
}) => {
  const [search, setSearch] = useState("");
  const [showUserName, setUserName] = useState([]);
  let channelInfoId = allChannelItem.allChannelItem.enc_channelID;
  const [channelIds, setChannelIds] = useState("");

  const dispatch = useDispatch();
  const addMemberListingdata = useSelector((state) => state?.addMemberListing);

  useEffect(() => {
    dispatch(addMemberListingHandler());
  }, []);

  useEffect(() => {
    setChannelIds(allChannelItem?.allChannelItem?.enc_channelID);
  }, [allChannelItem]);

  const [listData, setListData] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  const handleChange = (e) => {
    if (e) {
      const filterData = sortedData?.filter((item) => {
        return item?.userName?.toLowerCase()?.includes(e?.toLowerCase());
      });
      setSearch(e);
      setListData(filterData);
    } else {
      setSearch(e);
      setListData(sortedData);
    }
  };

  useEffect(() => {
    if (addMemberListingdata) {
      const filterData = addMemberListingdata?.data?.details?.filter((item) => {
        const newObj = { ...item, isChecked: false };
        return newObj;
      });
      setListData(filterData);
      setSortedData(filterData);
    }
  }, [addMemberListingdata?.data?.details]);

  const userNameList = (e, item, i) => {
    if (e.target.checked) {
      const tempData = listData.map((item, index) => {
        return index == i ? { ...item, isChecked: true } : item;
      });
      setListData(tempData);
      const filterData = tempData.filter((item) => item.isChecked == true);
      setUserName(filterData);
    } else {
      const tempData = listData.map((item, index) => {
        return index == i ? { ...item, isChecked: false } : item;
      });
      setListData(tempData);
      const filterData = tempData.filter((item) => item.isChecked == true);
      setUserName(filterData);
    }
  };

  const removeSelectedMember = (item, i) => {
    if (showUserName) {
      const removeMember = listData.findIndex((itemData, index) => {
        return itemData.userEmpId == item.userEmpId;
      });
      const removeData = listData.map((item, index) => {
        return index === removeMember ? { ...item, isChecked: false } : item;
      });
      setListData(removeData);
      // const filterData = tempData.filter((item) => item.isChecked == true);
      setUserName(showUserName.filter((showUserName) => showUserName !== item));
    }
  };

  const addMembers = async () => {
    let tempObj;
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelUserMapping/${allChannelItem?.allChannelItem?.enc_channelID}/user`
      );
      for (let i = 0; i < showUserName.length; i++) {
        tempObj = showUserName[i];
        delete showUserName[i].isChecked;
        tempObj.channelID = allChannelItem.allChannelItem.enc_channelID;
        console.log(tempObj, "tempObj");
        await collectionRef.add(tempObj);
      }
      setShowAddMemberModel(!showAddMemberModel);
      setHideMemberModel(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      ChatListingStyles.blueThumb,
      ChatListingStyles.darkRedThumb,
      ChatListingStyles.greenThumb,
      ChatListingStyles.yellowThumb,
      ChatListingStyles.orangeThumb,
      ChatListingStyles.skyBlueThumb,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  //compare two objects

  // useEffect(() => {
  //   var array1 = listData;
  //   var array2 = userDataList;

  //   const properties = ["userEmpId"];

  //   const result = array1
  //     .filter(
  //       (object1) =>
  //         !array2.some((object2) => object1.userEmpId === object2.userEmpId)
  //     ) // requires unique id
  //     .map((item) =>
  //       properties.reduce((newObject, name) => {
  //         newObject[name] = item[name];
  //         return newObject;
  //       }, {})
  //     );

  //   console.log(JSON.stringify(result, null, 4), "datatattata");
  // }, [listData, userDataList]);

  return (
    <>
      <div className={ChatListingStyles.addMembersPopup}>
        <ul className={ChatListingStyles.membersMenuMain}>
          <li className={ChatListingStyles.membersAreaHeader}>
            <FiUserPlusSVG />
            Add Members
            <span className={ChatListingStyles.chatWindowBack}>
              <FiChevronLeftSVG
                width="14"
                onClick={() => {
                  setShowAddMemberModel(!showAddMemberModel);
                  setHideMemberModel(true);
                }}
              />
            </span>
          </li>
          <li className={ChatListingStyles.membersAreaSearch}>
            <SearchSVG />
            <input
              type="search"
              placeholder="Search Name, Employee ID or Email."
              value={search}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
          </li>
          {search ? (
            <li
              className={ChatListingStyles.listingLabel}
            >{`Results for "${search}"`}</li>
          ) : (
            <li className={ChatListingStyles.listingLabel}>Recommended</li>
          )}
          <li className={ChatListingStyles.memberListing}>
            {listData?.map((item, index) => {
              console.log(item, "itemData123");
              return (
                <div className={ChatListingStyles.membersArea}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    <span
                      className={` ${
                        ChatListingStyles.circle
                      } ${getRandomColor()} `}
                      // style={{ backgroundColor: getRandomColor() }}
                    >
                      {item?.userInitial}
                    </span>
                    <div className={ChatListingStyles.profileName}>
                      {item?.userName}({item?.userEmpId})
                    </div>
                    <span
                      className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
                    >
                      {item?.userDesignation}
                    </span>
                  </div>
                  <div className={ChatListingStyles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      name="selectMember"
                      // value={item?.userName}
                      checked={item?.isChecked}
                      onChange={(e) => userNameList(e, item, index)}
                    />
                    <span></span>
                  </div>
                </div>
              );
            })}
            {listData?.length === 0 && (
              <span className={ChatListingStyles.noDataFound}>
                No Members Found
              </span>
            )}
          </li>

          <li>
            <div className={ChatListingStyles.addedMember}>
              {showUserName?.map((item, index) => {
                return (
                  <span>
                    {`${item?.userName}(${item?.userEmpId})`}
                    <span
                      className={ChatListingStyles.removeMember}
                      onClick={() => removeSelectedMember(item, index)}
                    ></span>
                  </span>
                );
              })}
            </div>
          </li>

          <li>
            <div className={ChatListingStyles.addMembersAreaFooter}>
              <button
                disabled={showUserName.length === 0 ? true : false}
                onClick={() => addMembers()}
              >
                Add
              </button>
            </div>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddMembers;
