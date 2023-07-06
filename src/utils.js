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

export const loadRss = (url) => {
  const proxy = makeProxy(url);
  return axios.get(proxy)
    .then((response) => {
      const parseContent = parseXml(response, url);
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
const updatePost = (watchState, response) => {
  const newPosts = response.posts;
  const uploadedTitlePosts = watchState.posts.map((post) => post.title);
  const comparePosts = newPosts.filter((newPost) => !uploadedTitlePosts.includes(newPost.title));

  if (comparePosts.length === 0) return;
  comparePosts.forEach((post) => {
    watchState.posts = [post, ...watchState.posts];
  });
};

export const checkNewPost = (watchState) => {
  const request = watchState.feeds.map((feed) => loadRss(feed.link));
  Promise.all(request)
    .then((responses) => responses.forEach((response) => updatePost(watchState, response)))
    .then(() => setTimeout(() => checkNewPost(watchState), 5000))
    .catch((e) => {
      console.error(e);
    });
};
