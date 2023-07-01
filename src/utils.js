import axios from 'axios';
import { uniqueId } from 'lodash';
import parseXml from './parser.js';

const makeProxy = (url) => {
  const newProxy = new URL('https://allorigins.hexlet.app');
  newProxy.pathname = '/get';
  newProxy.searchParams.append('disableCache', 'true');
  newProxy.searchParams.append('url', url);
  return newProxy.href.toString();
};

export default (url) => {
  const proxy = makeProxy(url);
  return axios.get(proxy)
    .then((response) => {
      const parseContent = parseXml(response);
      const { feed, posts } = parseContent;
      feed.id = uniqueId();
      posts.forEach((post) => {
        post.id = uniqueId();
        post.feedId = feed.id;
      });
      return parseContent;
    })
    .catch((error) => {
      const err = new Error();
      if (error.name === 'AxiosError') {
        err.message = 'networkError';
      }
      if (error.name === 'parserError') {
        err.message = 'parserError';
      }
      throw err;
    });
};
