export type Country = {
  iso: string;
  name: string;
  dial: string;
  /** National mobile number length, not counting the country code. */
  digits: number | { min: number; max: number };
  example: string;
  pattern?: RegExp;
  states?: string[];
};

export const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const COUNTRIES: Country[] = [
  {
    iso: "IN",
    name: "India",
    dial: "91",
    digits: 10,
    example: "98765 43210",
    pattern: /^[6-9]\d{9}$/,
    states: INDIA_STATES,
  },
  {
    iso: "AE",
    name: "United Arab Emirates",
    dial: "971",
    digits: 9,
    example: "50 123 4567",
    pattern: /^5\d{8}$/,
    states: [
      "Abu Dhabi",
      "Ajman",
      "Dubai",
      "Fujairah",
      "Ras Al Khaimah",
      "Sharjah",
      "Umm Al Quwain",
    ],
  },
  {
    iso: "US",
    name: "United States",
    dial: "1",
    digits: 10,
    example: "415 555 0132",
    pattern: /^[2-9]\d{9}$/,
    states: US_STATES,
  },
  {
    iso: "GB",
    name: "United Kingdom",
    dial: "44",
    digits: 10,
    example: "7400 123456",
    pattern: /^7\d{9}$/,
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  {
    iso: "AU",
    name: "Australia",
    dial: "61",
    digits: 9,
    example: "412 345 678",
    pattern: /^4\d{8}$/,
    states: [
      "Australian Capital Territory",
      "New South Wales",
      "Northern Territory",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
    ],
  },
  {
    iso: "CA",
    name: "Canada",
    dial: "1",
    digits: 10,
    example: "416 555 0134",
    pattern: /^[2-9]\d{9}$/,
    states: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Northwest Territories",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ],
  },
  { iso: "SG", name: "Singapore", dial: "65", digits: 8, example: "9123 4567", pattern: /^[89]\d{7}$/ },
  { iso: "MY", name: "Malaysia", dial: "60", digits: { min: 9, max: 10 }, example: "12 345 6789" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", digits: 9, example: "50 123 4567", pattern: /^5\d{8}$/ },
  { iso: "QA", name: "Qatar", dial: "974", digits: 8, example: "3312 3456" },
  { iso: "KW", name: "Kuwait", dial: "965", digits: 8, example: "5000 1234" },
  { iso: "OM", name: "Oman", dial: "968", digits: 8, example: "9212 3456" },
  { iso: "BH", name: "Bahrain", dial: "973", digits: 8, example: "3600 1234" },
  { iso: "NP", name: "Nepal", dial: "977", digits: 10, example: "9801234567" },
  { iso: "BD", name: "Bangladesh", dial: "880", digits: 10, example: "1712 345678" },
  { iso: "LK", name: "Sri Lanka", dial: "94", digits: 9, example: "71 234 5678" },
  { iso: "PK", name: "Pakistan", dial: "92", digits: 10, example: "300 1234567" },
  { iso: "DE", name: "Germany", dial: "49", digits: { min: 10, max: 11 }, example: "1512 3456789" },
  { iso: "FR", name: "France", dial: "33", digits: 9, example: "6 12 34 56 78", pattern: /^[67]\d{8}$/ },
  { iso: "IT", name: "Italy", dial: "39", digits: { min: 9, max: 10 }, example: "312 345 6789" },
  { iso: "ES", name: "Spain", dial: "34", digits: 9, example: "612 34 56 78" },
  { iso: "NL", name: "Netherlands", dial: "31", digits: 9, example: "6 12345678" },
  { iso: "IE", name: "Ireland", dial: "353", digits: 9, example: "85 123 4567" },
  { iso: "NZ", name: "New Zealand", dial: "64", digits: { min: 8, max: 10 }, example: "21 123 4567" },
  { iso: "ZA", name: "South Africa", dial: "27", digits: 9, example: "82 123 4567" },
  { iso: "NG", name: "Nigeria", dial: "234", digits: 10, example: "802 123 4567" },
  { iso: "KE", name: "Kenya", dial: "254", digits: 9, example: "712 345678" },
  { iso: "TH", name: "Thailand", dial: "66", digits: 9, example: "81 234 5678" },
  { iso: "ID", name: "Indonesia", dial: "62", digits: { min: 10, max: 12 }, example: "812 3456 7890" },
  { iso: "PH", name: "Philippines", dial: "63", digits: 10, example: "917 123 4567" },
  { iso: "JP", name: "Japan", dial: "81", digits: { min: 10, max: 11 }, example: "90 1234 5678" },
  { iso: "KR", name: "South Korea", dial: "82", digits: { min: 9, max: 10 }, example: "10 1234 5678" },
  { iso: "HK", name: "Hong Kong", dial: "852", digits: 8, example: "5123 4567" },
].sort((a, b) => {
  if (a.iso === "IN") return -1;
  if (b.iso === "IN") return 1;
  return a.name.localeCompare(b.name);
});

export const DEFAULT_COUNTRY_ISO = "IN";

export function getCountry(iso: string) {
  return COUNTRIES.find((country) => country.iso === iso);
}

export function digitRange(country: Country) {
  if (typeof country.digits === "number") {
    return { min: country.digits, max: country.digits };
  }
  return country.digits;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function phoneLengthHint(country: Country) {
  const { min, max } = digitRange(country);
  if (min === max) return `${min} digits, without the +${country.dial} code`;
  return `${min}–${max} digits, without the +${country.dial} code`;
}

export function validateNationalNumber(country: Country, digits: string) {
  const { min, max } = digitRange(country);
  if (digits.length < min || digits.length > max) {
    if (min === max) {
      return `Enter a full ${country.name} mobile number (${min} digits).`;
    }
    return `Enter a full ${country.name} mobile number (${min}–${max} digits).`;
  }
  if (country.pattern && !country.pattern.test(digits)) {
    return `That number does not match ${country.name} mobile format. Example: ${country.example}`;
  }
  return null;
}

export function formatInternational(country: Country, digits: string) {
  return `+${country.dial} ${digits}`;
}
