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
  watchState.loadingProcess.dowloadStatus = 'loading';
  watchState.loadingProcess.error = null;
  const proxy = makeProxy(url);
  const data = axios.get(proxy)
    .then((response) => {
      const content = response.data.contents;
      const parseContent = parseRss(content, url);
      const { feed, posts } = parseContent;
      feed.id = uniqueId();
      posts.forEach((post) => {
        post.id = uniqueId();
        post.feedId = feed.id;
      });
      watchState.loadingProcess.dowloadStatus = 'success';
      watchState.loadingProcess.error = null;
      watchState.feeds = [feed, ...watchState.feeds];
      watchState.posts = [...posts, ...watchState.posts];
    })
    .catch((error) => {
      watchState.loadingProcess.error = handlerError(error);
      watchState.loadingProcess.dowloadStatus = 'failed';
    });
  return data;
};

const updatePost = (watchState) => {
  const requests = watchState.feeds.map((feed) => {
    const { link, id } = feed;
    const request = axios.get(makeProxy(link))
      .then((response) => {
        const content = response.data.contents;
        const parseContent = parseRss(content, link);
        const { posts } = parseContent;
        const uploadedTitlePosts = watchState.posts.map((post) => post.title);
        const newPosts = posts.filter((newPost) => !uploadedTitlePosts.includes(newPost.title));
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
      const state = {
        lng: defaultLanguage,
        form: {
          validationStatus: '',
          error: null,
        },
        loadingProcess: {
          dowloadStatus: '',
          error: null,
        },
        feeds: [],
        posts: [],
        uiState: {
          activeFeed: '',
          postId: '',
          visitedPostsId: [],
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('.form-control'),
        mainButton: document.querySelector('button[type="submit"]'),
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

      const watchState = initView(state, elements, i18nextInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const currentUrl = formData.get('url');

        const urls = state.feeds.map((feed) => feed.link);

        validate(currentUrl, urls)
          .then((error) => {
            if (error) {
              watchState.form.validationStatus = false;
              watchState.form.error = error.message;
              return;
            }
            watchState.form.validationStatus = true;
            state.form.error = null;
            loadRss(currentUrl, watchState);
          });
      });

      setTimeout(() => updatePost(watchState), timeUpdate);

      elements.posts.addEventListener('click', (e) => {
        const currentTarget = e.target;
        if (currentTarget.nodeName === 'A' || currentTarget.nodeName === 'BUTTON') {
          watchState.uiState.postId = currentTarget.dataset.id;
          state.uiState.visitedPostsId = [
            currentTarget.dataset.id,
            ...state.uiState.visitedPostsId,
          ];
        }
      });
      elements.feeds.addEventListener('click', (e) => {
        const currentTarget = e.target;
        if (currentTarget.nodeName === 'H2') {
          watchState.uiState.activeFeed = '';
        }

        if (currentTarget.nodeName === 'H3') {
          watchState.uiState.activeFeed = currentTarget.dataset.id;
        }
      });

      const selectedLng = document.querySelector('.change-lang');
      selectedLng.addEventListener('click', () => {
        watchState.lng = selectedLng.value;
      });
    });
};
