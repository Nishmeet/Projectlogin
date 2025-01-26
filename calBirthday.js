export function calBirthday(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
  
    const timeDiff = nextBirthday - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return daysDiff;
  }