import onChange from 'on-change';
import renderFeeds from './renderFeed.js';
import { renderFormError, renderDowloadError } from './renderError.js';
import renderPosts from './renderPost.js';
import renderModal from './renderModal.js';
import renderTranslate from './renderTranslate.js';

const handleFormStatus = (elements, status) => {
  const { feedback, input } = elements;
  if (!status) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
  }
};

const handleDowloadStatus = (elements, i18nextInstance, status) => {
  const {
    form,
    submit,
    feedback,
    input,
  } = elements;
  switch (status) {
    case 'loading':
      feedback.textContent = '';
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      submit.disabled = true;
      input.disabled = true;
      break;
    case 'success':
      submit.disabled = false;
      input.disabled = false;
      feedback.textContent = i18nextInstance.t('form.rssLoadSucces');
      form.reset();
      input.focus();
      break;
    case 'failed':
      submit.disabled = false;
      input.disabled = false;
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    default:
      break;
  }
};

const render = (elements, i18nextInstance, initialState) => (path, value) => {
  switch (path) {
    case 'form.isValid':
      handleFormStatus(elements, value);
      break;
    case 'form.error':
      renderFormError(elements, i18nextInstance, value);
      break;
    case 'loadingProcess.status':
      handleDowloadStatus(elements, i18nextInstance, value);
      break;
    case 'loadingProcess.error':
      renderDowloadError(elements, i18nextInstance, value);
      break;
    case 'feeds':
      renderFeeds(elements, i18nextInstance, value);
      break;
    case 'posts':
      renderPosts(elements, initialState, i18nextInstance, value);
      break;
    case 'uiState.activeFeed':
      renderPosts(elements, initialState, i18nextInstance, initialState.posts);
      break;
    case 'uiState.postId':
      renderModal(elements, i18nextInstance, initialState);
      break;
    case 'lng':
      i18nextInstance.changeLanguage(value).then(() => {
        renderTranslate(elements, i18nextInstance);
        renderPosts(elements, initialState, i18nextInstance, initialState.posts);
        renderFeeds(elements, i18nextInstance, initialState.feeds);
      });
      break;
    default:
      break;
  }
};

export default (initialState, elements, language) => onChange(
  initialState,
  render(elements, language, initialState),
);
