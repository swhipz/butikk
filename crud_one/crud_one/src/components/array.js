// Get array from localStorage or use default if none exists
const getInitialArray = () => {
  const savedArray = localStorage.getItem("array");
  if (savedArray) {
    return JSON.parse(savedArray);
  }
  // Default array if nothing in localStorage
  return [
    {
      id: "1",
      Name: "Fredrik",
      Age: "25",
      Type: "Humanoid",
    },
  ];
};

const array = getInitialArray();

export default array;
