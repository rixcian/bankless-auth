export const isNotPropertyEmpty = (property: string): boolean => {
  return property.length > 0;
}

export const isPropertyLongerOrSameThan = (property: string, requiredLength: number): boolean => {
  return property.length >= requiredLength;
}

export const hasPropertyNumber = (property: string): boolean => {
  return /\d/.test(property);
}

export const hasPropertyBigLetter = (property: string): boolean => {
  return /.*[A-Z]/.test(property);
}

export const isPropertyEmail = (email: string): boolean => {
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return EMAIL_REGEX.test(email);
}