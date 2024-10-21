export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

export const dateToMonthDay = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
};

export const removeQuotes = (value) => {
  // 단어의 시작과 끝에 따옴표가 있는 경우 제거
  if (typeof value === 'string') {
    return value.replace(/^"(.*)"$/, '$1');
  }
  return value;
};

// \n 문자열을 개행문자로 변환
export const adaptLineBreaks = (text) => {
  return text?.replace(/\\n/g, '\n') || '';
}