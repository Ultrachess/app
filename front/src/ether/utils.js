import { CONTRACTS } from '../ether/contracts';

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}..${match[2]}`;
};
  
export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};
  
export function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDate(date) {
  return (
      [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
      ].join('/') +
      ' ' +
      [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
      ].join(':')
  );
}

export function getTokenNameFromAddress(address) {
  const lowerCaseAddress = address.toLowerCase()
  var name = lowerCaseAddress
  switch (lowerCaseAddress) {
    case CONTRACTS.localhost.CartesiToken.address.toLowerCase():
      name = "CTSI"
      break;
    case "0x326C977E6efc84E512bB9C30f76E30c160eD06FB".toLowerCase():
      name = "LINK"
      break;
    default:
      name = truncateAddress(lowerCaseAddress)
      break;
  }
  return name
}