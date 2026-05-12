export const nameRegex = /^[a-zA-ZčćšđžČĆŠĐŽ\s]+$/;
export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 50;
export const MIN_PASSWORD_LENGTH = 8;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*].+$/;
export const phoneRegex = /^\+[1-9]\d{7,14}$/;

export const MIN_CITY_LENGTH = 2;
export const MAX_CITY_LENGTH = 50;
export const MIN_STREET_LENGTH = 5;
export const MAX_STREET_LENGTH = 100;
export const MIN_ZIP_LENGTH = 4;
export const MAX_ZIP_LENGTH = 10;
export const countryCodeRegex = /^[A-Z]{2}$/;
export const zipcodeRegex = /^\d+$/;
