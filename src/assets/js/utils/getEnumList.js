const getEnumList = EnumsObj => {
  const list = [];
  Object.keys(EnumsObj).forEach(key => {
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
