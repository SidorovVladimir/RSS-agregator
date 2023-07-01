import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import initView from './render/view.js';
import loadRss from './utils.js';

export default () => {
  const state = {
    form: {
      processState: 'filling',
      rssLink: [],
      error: null,
    },
    feeds: [],
    posts: [],
    currentVisitedPostId: '',
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    mainButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    title: document.querySelector('section h1'),
    subtitle: document.querySelector('section p'),
    exampleUrl: document.querySelector('form ~p'),
    inputPlaceholder: document.querySelector('label[for="url-input"]'),
    modal: {
      title: document.querySelector('.modal-title'),
      description: document.querySelector('.modal-body'),
      linkButton: document.querySelector('.modal-footer a'),
      closeButton: document.querySelector('.modal-footer button'),
    },
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const i18nextInstance = i18next.createInstance();
  const defaultLanguage = 'ru';

  i18nextInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: 'rssDublicate',
    },
    string: {
      url: 'urlValid',
    },
  });
  const watchState = onChange(state, initView(elements, i18nextInstance, state));

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currentUrl = formData.get('url').trim();

    const schema = yup.string()
      .required()
      .url()
      .notOneOf(watchState.form.rssLink);

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
        return response;
      })
      .catch((error) => {
        watchState.form.processState = 'filling';
        watchState.form.error = error.message;
      });
  });
  elements.posts.addEventListener('click', (e) => {
    const currentTarget = e.target;
    if (currentTarget.nodeName === 'A' || currentTarget.nodeName === 'BUTTON') {
      watchState.currentVisitedPostId = currentTarget.dataset.id;
    }
  });
};
