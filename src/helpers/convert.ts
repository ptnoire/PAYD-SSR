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

export function incrementMonthAndRetainDate(date: string) {
    const newDate = new Date(date);

    const isLastDayOfMonth = newDate.getDate() === new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
        if (isLastDayOfMonth) {
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);
            newDate.setDate(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate());
            const updatedDate = newDate.toISOString();
            return updatedDate;
        }
    newDate.setMonth(newDate.getMonth() + 1);
    const updatedDate = newDate.toISOString();

    return updatedDate;
}

export function decrementMonthAndRetainDate(date: string) {
    const newDate = new Date(date);
    const isLastDayOfMonth = newDate.getDate() === new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();

    if (isLastDayOfMonth) {
      newDate.setDate(1);
      newDate.setDate(newDate.getDate() - 1);
      const updatedDate = newDate.toISOString();
      return updatedDate;
    }
  
    newDate.setMonth(newDate.getMonth() - 1);
    const updatedDate = newDate.toISOString();
    return updatedDate;
  }