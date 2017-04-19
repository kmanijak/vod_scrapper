import jsdom from 'jsdom';
import { trim } from 'lodash';

// ---JSDOM---
const getDocument = (rawHtml) => jsdom.jsdom(rawHtml);
const closeWindow = (document) => {
  const window = document.document.defaultView;
  window.close();
};
export const transformHtml = (rawHtml, parser) => {
  const document = getDocument(rawHtml);
  const parsedMovie = parser(document);
  closeWindow(document);
  return parsedMovie;
};



// ---DOM---
export const getValue = (text) => trim(text.replace(/\\n/g));
export const getInnerHtmlOptionalValue = (element) => element ? getValue(element.innerHTML) : '';
export const getSplitValues = (element, querySelector, splitChar) => {
  const value = element.querySelector(querySelector);

  return value ?
    value.innerHTML.split(splitChar).map((text) => getValue(text)) :
    [];
};
export const getValueByQuerySelector = (element, querySelector) => {
  const subElement = element.querySelector(querySelector);
  return subElement ? getValue(subElement.innerHTML) : '';
};
