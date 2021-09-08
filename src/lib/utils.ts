const format = {
  phone(value: any) {
    let phone = value.replace(/\D/g, '');

    if (phone.length > 11) phone = phone.slice(0, -1);

    phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2');

    return phone;
  },
  date(timestamp: any) {
    const date = new Date(timestamp);

    // O UTC mostra a data universal
    // yyyy
    const year = date.getUTCFullYear();
    // mm
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    // dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      ptbr: `${day}/${month}/${year}`,
    };
  },
};

export default format;
