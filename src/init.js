import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import customErrorMessage from './locales/customErrorMessage.js';
import initView from './render/view.js';
import parseRss from './parser.js';

const defaultLanguage = 'ru';
const timeUpdate = 5000;
const timeout = 10000;

const makeProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.append('disableCache', 'true');
  urlWithProxy.searchParams.append('url', url);
  return urlWithProxy.toString();
};

const handlerError = (error) => {
  switch (error.name) {
    case 'AxiosError':
      return 'networkError';
    case 'ParserError':
      return 'parserError';
    default:
      return 'unknownError';
  }
};

const loadRss = (url, watchState) => {
  watchState.loadingProcess = { status: 'loading', error: null };
  const proxy = makeProxy(url);
  const data = axios({
    metod: 'get',
    url: proxy,
    timeout,
  })
    .then((response) => {
      const content = parseRss(response.data.contents);
      const { feed, posts } = content;
      feed.url = url;
      feed.id = uniqueId();
      posts.forEach((post) => {
        post.id = uniqueId();
        post.feedId = feed.id;
      });
      watchState.loadingProcess = { status: 'success', error: null };
      watchState.feeds = [feed, ...watchState.feeds];
      watchState.posts = [...posts, ...watchState.posts];
    })
    .catch((error) => {
      watchState.loadingProcess = { error: handlerError(error), status: 'failed' };
    });
  return data;
};

const updatePost = (watchState) => {
  const requests = watchState.feeds.map((feed) => {
    const { url, id } = feed;
    const request = axios.get(makeProxy(url))
      .then((response) => {
        const content = parseRss(response.data.contents);
        const { posts } = content;
        const titles = watchState.posts.map((post) => post.title);
        const newPosts = posts.filter((newPost) => !titles.includes(newPost.title));
        newPosts.forEach((post) => {
          post.id = uniqueId();
          post.feedId = id;
        });
        watchState.posts = [...newPosts, ...watchState.posts];
      })
      .catch((e) => {
        console.error(e);
      });
    return request;
  });
  return Promise.all(requests)
    .then(() => setTimeout(() => updatePost(watchState), timeUpdate));
};

const validate = (url, urls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(urls);
  return schema.validate(url)
    .then(() => null)
    .catch((error) => error);
};

export default () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      const initialState = {
        lng: defaultLanguage,
        form: {
          isValid: true,
          error: null,
        },
        loadingProcess: {
          status: '',
          error: null,
        },
        feeds: [],
        posts: [],
        uiState: {
          postId: '',
          visitedPostsId: new Set(),
        },
      };

      const elements = {
        languageButton: document.querySelector('.dropdown-toggle'),
        languageMenu: document.querySelector('.dropdown-menu'),
        form: document.querySelector('.rss-form'),
        input: document.querySelector('.form-control'),
        submit: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        title: document.querySelector('section h1'),
        subtitle: document.querySelector('section p'),
        exampleUrl: document.querySelector('form ~p'),
        labelInput: document.querySelector('label[for="url-input"]'),
        modal: {
          title: document.querySelector('.modal-title'),
          description: document.querySelector('.modal-body'),
          linkButton: document.querySelector('.modal-footer a'),
          closeButton: document.querySelector('.modal-footer button'),
        },
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
      };

      yup.setLocale(customErrorMessage);

      const watchState = initView(initialState, elements, i18nextInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');

        const urls = initialState.feeds.map((feed) => feed.url);

        validate(url, urls)
          .then((error) => {
            if (error) {
              watchState.form = { isValid: false, error: error.message };
              return;
            }
            watchState.form = { isValid: true, error: null };
            loadRss(url, watchState);
          });
      });

      setTimeout(() => updatePost(watchState), timeUpdate);

      elements.posts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        if (id) {
          watchState.uiState.postId = id;
          initialState.uiState.visitedPostsId.add(id);
        }
      });

      elements.languageMenu.addEventListener('click', (e) => {
        const { lng } = e.target.dataset;
        if (lng) {
          watchState.lng = lng;
        }
      });
    });
};
