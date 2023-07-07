export const setItem = (item, value) => {
   localStorage.setItem(item, JSON.stringify(value));
};

export const getItem = (item) => {
   return localStorage.getItem(item);
};

export const removeItem = (item) => {
   localStorage.removeItem(item);
};
