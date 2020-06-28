export const isApp = path => {
  return path.includes("/app/");
};

export const getCookie = name => {
  if (!process.browser) return;
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length == 2)
    return parts
      .pop()
      .split(";")
      .shift();
};

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const isBrowser = () => process.browser;

export const isImage = file => file["type"].split("/")[0] === "image";
