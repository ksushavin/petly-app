import numWords from 'num-words';

export const getStringAge = birthdate => {
  const today = new Date();
  const birthDate = new Date(birthdate);

  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  const ageWord = numWords(age);
  const yearsWord = ageWord === 'one' ? 'year' : 'years';

  return `${ageWord} ${yearsWord}`;
};
