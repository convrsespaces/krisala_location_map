const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  export const getFormalNameFromNumber = (num: number | string): string => {
    const numStr = num.toString();
    if (numStr === "-1") return "Upper basement";
    if (numStr === "G") return "Ground";
  
    const n = parseInt(numStr);
    if (isNaN(n)) return `${numStr}th`;
  
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;
  
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${n}th`;
    if (lastDigit === 1) return `${n}st`;
    if (lastDigit === 2) return `${n}nd`;
    if (lastDigit === 3) return `${n}rd`;
    return `${n}th`;
  };
  
  export const getDateFromTimestamp = (timestamp: number | string): string => {
    const parsed = parseInt(timestamp.toString());
    if (isNaN(parsed)) return "Invalid Date";
  
    const date = new Date(parsed);
    return `${date.getDate()}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
  };
  
  export const getTimeFromTimestamp = (timestamp: number | string): string => {
    const parsed = parseInt(timestamp.toString());
    if (isNaN(parsed)) return "Invalid Time";
  
    const date = new Date(parsed);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  
  export const getFormalCurrencyFromNum = (num: number | string | null | undefined): string => {
    if (num == null || isNaN(Number(num))) return "0";
  
    const numStr = Number(num).toString();
    const len = numStr.length;
  
    if (len <= 3) return numStr;
  
    let unit = "";
    let sliceEnd = 2;
  
    if (len === 4 || len === 5) {
      unit = "k";
      sliceEnd = len === 4 ? 1 : 2;
    } else if (len === 6 || len === 7) {
      unit = "lakh";
      sliceEnd = len === 6 ? 1 : 2;
    } else if (len >= 8) {
      unit = "cr";
      sliceEnd = len === 8 ? 1 : 2;
    }
  
    return `${numStr.slice(0, sliceEnd)}.${numStr.slice(sliceEnd, sliceEnd + 2)}${unit}`;
  };