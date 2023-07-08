import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import errorMessages from './locales/validationMessages.js';
import initView from './render/view.js';
import parseRss from './parser.js';

const makeProxy = (url) => {
  const newProxy = new URL('https://allorigins.hexlet.app');
  newProxy.pathname = '/get';
  newProxy.searchParams.append('disableCache', 'true');
  newProxy.searchParams.append('url', url);
  return newProxy.href.toString();
};

const loadRss = (url) => {
  const proxy = makeProxy(url);
  return axios.get(proxy)
    .then((response) => {
      const content = response.data.contents;
      const parseContent = parseRss(content, url);
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

const checkNewPost = (watchState) => {
  const request = watchState.feeds.map((feed) => loadRss(feed.link));
  Promise.all(request)
    .then((responses) => responses.forEach((response) => updatePost(watchState, response)))
    .then(() => setTimeout(() => checkNewPost(watchState), 5000))
    .catch((e) => {
      console.error(e);
    });
};

export default () => {
  const defaultLanguage = 'ru';
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
          processState: 'filling',
          rssLink: [],
          error: null,
        },
        feeds: [],
        posts: [],
        uiState: {
          currentVisitedPostId: '',
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

      yup.setLocale(errorMessages);

      const watchState = initView(state, elements, i18nextInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const currentUrl = formData.get('url').trim();

        const schema = yup.string()
          .required()
          .url()
          .notOneOf(state.form.rssLink);

        schema.validate(currentUrl)
          .then(() => {
            watchState.form.processState = 'sending';
            return loadRss(currentUrl);
          })
          .then((response) => {
            const { feed, posts } = response;
            watchState.feeds = [feed, ...watchState.feeds];
            watchState.posts = [...posts, ...watchState.posts];
            watchState.form.processState = 'rssLoadSucces';
            watchState.form.rssLink.push(currentUrl);
            state.form.error = null;
            return response;
          })
          .then(() => setTimeout(() => checkNewPost(watchState), 5000))
          .catch((error) => {
            watchState.form.processState = 'filling';
            watchState.form.error = error.message;
          });
      });

      elements.posts.addEventListener('click', (e) => {
        const currentTarget = e.target;
        if (currentTarget.nodeName === 'A' || currentTarget.nodeName === 'BUTTON') {
          watchState.uiState.currentVisitedPostId = currentTarget.dataset.id;
          state.uiState.visitedPostsId = [
            currentTarget.dataset.id,
            ...state.uiState.visitedPostsId,
          ];
        }
      });

      const selectedLng = document.querySelector('.change-lang');
      selectedLng.addEventListener('click', () => {
        watchState.lng = selectedLng.value;
      });
    });
};
