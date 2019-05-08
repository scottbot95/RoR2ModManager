export const deepObjectContaining = (obj: any) => {
  if (typeof obj !== 'object') return obj;
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          result[key] = obj[key].map(val => deepObjectContaining(val));
        } else {
          result[key] = deepObjectContaining(obj[key]);
        }
      } else {
        result[key] = obj[key];
      }
    }
  }

  return jasmine.objectContaining(result);
};
