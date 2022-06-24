import { moment } from "../App";

export const ConvertFromUtcToLocalTimezone = {
  convert: (object) => {
    return iterate(object);
  },
};
function iterate(obj) {
  if (obj != null)
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        iterate(obj[key]);
      } else if (
        key != null &&
        (key === "createdDate" || key === "dateCreated")
      ) {
        obj[key] = moment.utc(obj[key]).local();
      }
    });
  return obj;
}
