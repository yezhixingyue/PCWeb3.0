const getEnumList = (EnumsObj, moreKeys = []) => {
  const list = [];
  Object.keys(EnumsObj).forEach(key => {
    const { Name, ID } = EnumsObj[key];
    const temp = {
      ID,
      Name,
    };
    if (moreKeys && moreKeys.length > 0) {
      moreKeys.forEach(_key => {
        temp[_key] = EnumsObj[key][_key];
      });
    }
    list.push(temp);
  });
  return list;
};

export default getEnumList;
