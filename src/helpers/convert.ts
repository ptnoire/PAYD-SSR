export const convertCurr = (inputCurrency: number) => {
    const userLang = navigator.language;
    const xchange = new Intl.NumberFormat(userLang, {
      style: "currency",
      currency: "USD",
    }).format(inputCurrency);
  
    return xchange;
  };
  
  export const convertLocalDate = (input: string) => {
    const userLang = navigator.language;
    const newDate = new Date(input);
    const localDateString = newDate.toLocaleDateString(userLang, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  
    return localDateString;
  };