import {
  isNotPropertyEmpty,
  isPropertyEmail,
  isPropertyLongerOrSameThan,
  hasPropertyNumber,
  hasPropertyBigLetter
} from "../validators";


interface Credentials {
  username: string,
  email: string,
  password: string
}

export const isCredentialsValid = ({username, email, password}: Credentials): boolean => {
  return (
    isNotPropertyEmpty(username) &&
    isNotPropertyEmpty(email) &&
    isNotPropertyEmpty(password) &&

    isPropertyLongerOrSameThan(username,2) &&
    isPropertyEmail(email) &&
    isPasswordValid(password)
  )
}

const isPasswordValid = (password: string): boolean => {
  return (
    isPropertyLongerOrSameThan(password, 6) &&
    hasPropertyNumber(password) &&
    hasPropertyBigLetter(password)
  )
}