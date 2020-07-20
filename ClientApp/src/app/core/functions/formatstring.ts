export function FormatURLString(
  serviceUrl: string,
  serviceEndpoint: string,
  ...val: any[]
) {
  let str: string = serviceUrl + serviceEndpoint;
  for (let index = 0; index <= val[0].length - 1; index++) {
    str = str.replace(`{${index}}`, String(val[0][index]));
  }
  return str;
}

export function RemoveCurrencyFormat(currencyValue: string): number {
  return Number(currencyValue.replace(/\./g, ""));
}

export function MonthDiff(d1: Date, d2: Date) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function GenerateGuid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
}

function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
