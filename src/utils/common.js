import isEmpty from "lodash/isEmpty";
import queryString from "query-string";

import { API_CONFIG, STATUS_TYPE } from "../constants/constant";
import moment from "moment";

export const getUrl = (url, params = {}) => {
  if (!url.includes("https")) {
    let urlString = `${API_CONFIG.baseUrl}/${url}`;
    if (params && !isEmpty(params)) {
      urlString += `?${queryString.stringify(params)}`;
    }
    return urlString;
  }
  return url;
};

export const visiblePath = (pathName) => {
  return pathName === "leaderboard" ||
    pathName === "users" ||
    pathName === "fiatPlans" ||
    pathName === "minimumMobileVersion" ||
    pathName === "marketingBanner" ||
    pathName === "boosterPlans" ||
    pathName === "mobileNotification" ||
    pathName === ""
    ? true
    : false;
};

export const gameOptions = [
  { id: "1", value: "rocket-doge", label: "rocket-doge" },
  { id: "2", value: "to-the-moon", label: "to-the-moon" },
  { id: "3", value: "tamadoge-run", label: "tamadoge-run" },
  { id: "4", value: "tama-blast", label: "tama-blast" },
  { id: "5", value: "super-doge", label: "super-doge" },
];

export const boolOptions = [
  { id: "1", value: true, label: "True" },
  { id: "2", value: false, label: "False" },
];

export const translateNum = (num) => {
  if (num.toString().length > 4) {
    return num.toLocaleString();
  } else {
    return num;
  }
};

export const formatWalletAddress = (item) => {
  if (item.web3WalletAddress) {
    return item.web3WalletAddress;
  }
  if (item.walletAddress) {
    return item.walletAddress;
  }
  return "NA";
};

export const createAction = (type, payload = {}) => {
  return {
    type: type,
    payload: payload,
  };
};

export const FIAT_PLATFORM_OPTIONS = [
  {
    label: "Apple Pay",
    value: "APPLE_PAY",
  },
  {
    label: "Google Pay",
    value: "GOOGLE_PAY",
  },
  {
    label: "Stripe",
    value: "STRIPE",
  },
];

export const ConvertDropDownValueToArray = (dropDown, value) => {
  if (value) {
    const availableArray = dropDown.find((item) => item.value === value);
    return availableArray;
  }
  return [];
};

export const languages = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fr",
    label: "French",
  },
  {
    value: "it",
    label: "Italian",
  },
  {
    value: "de",
    label: "German",
  },
  {
    value: "ja",
    label: "Japanese",
  },
  {
    value: "es",
    label: "Spanish",
  },
  {
    value: "ko",
    label: "Korean",
  },
  {
    value: "ru",
    label: "Russian",
  },
  {
    value: "tr",
    label: "Turkish",
  },
];

export const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
export const BOOSTER_TYPES = [
  {
    value: "MAGNET",
    label: "MAGNET",
  },
  {
    value: "HEART",
    label: "HEART",
  },
  {
    value: "SHEILD",
    label: "SHEILD",
  },
  {
    value: "TIMER",
    label: "TIMER",
  },
  {
    value: "BONES",
    label: "BONES",
  },
  {
    value: "GOAL_POST",
    label: "GOAL_POST",
  },
];

export const getLanguage = (key) => {
  const lang = languages.find((l) => l.value === key);
  return lang ? lang.label : "";
};
const imagesName = {
  MAGNET: "Magnet.png",
  HEART: "Health.png",
  SHEILD: "Sheild.png",
  TIMER: "TimerFreez.png",
  BONES: "Bones.png",
  GOAL_POST: "BiggerGoal.png",
};

export const getImageNameBySlug = (slug) => {
  const img = imagesName[slug];
  return img;
};

export const SOCIAL_TYPES = [
  {
    value: "Twitter",
    label: "Twitter",
  },
  {
    value: "Instagram",
    label: "Instagram",
  },
  {
    value: "Telegram",
    label: "Telegram",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "Discord",
    label: "Discord",
  },
  {
    value: "Reddit",
    label: "Reddit",
  },
  {
    value: "Youtube",
    label: "Youtube",
  },
  {
    value: "TikTok",
    label: "TikTok",
  },
];

export const strictValidArray = (arr) => arr && Array.isArray(arr);

export const strictValidArrayWithLength = (arr) =>
  strictValidArray(arr) && !!arr.length;

export const radioOptions = [
  { name: "Active", value: true },
  { name: "In Active", value: false },
];

export const modalType = {
  permission: "permission",
};

export const LotteryStatus = (startDate, endDate, payoutDate, isPayoutDone) => {
  const today = moment();
  const start = moment(startDate, "DD-MM-YYYY");
  const end = moment(endDate, "DD-MM-YYYY");
  const payoutDay = moment(payoutDate, "DD-MM-YYYY");

  if (today.isBetween(start, end)) {
    return STATUS_TYPE.IN_PROGRESS;
  } else if (today.isBefore(start)) {
    return STATUS_TYPE.UPCOMING;
  } else if (
    today.isAfter(end) &&
    payoutDay.isSameOrBefore(today) &&
    !isPayoutDone
  ) {
    return STATUS_TYPE.TODAY_PAYOUT;
  } else if (today.isAfter(end) && isPayoutDone) {
    return STATUS_TYPE.COMPLETED;
  } else if (today.isAfter(end) && !isPayoutDone) {
    return STATUS_TYPE.REMAINING_PAYOUT;
  }
  return null;
};

export const calculateTimeRemaining = (createdAt) => {
  const startDateTime = moment(createdAt);
  const now = moment();

  const duration = moment.duration(now.diff(startDateTime));

  const days = Number(duration.days());
  const hours = Number(duration.hours());
  const minutes = Number(duration.minutes());
  const seconds = Number(duration.seconds());

  return days > 0
    ? `${days} days ago`
    : hours > 0
    ? `${hours} hours ago`
    : minutes > 0
    ? `${minutes} minute ago`
    : `${seconds} second ago`;
};
