const getEnumList = (EnumsObj, withAll = false) => {
  const list = [];
  Object.keys(EnumsObj).forEach(key => {
    if (typeof EnumsObj[key] !== 'object') return;
    if (withAll) {
      const temp = JSON.parse(JSON.stringify(EnumsObj[key]));
      list.push(temp);
      return;
    }
    const { Name, ID } = EnumsObj[key];
    const temp = {
      ID,
      Name,
    };
    list.push(temp);
  });
  return list;
};

export default getEnumList;
