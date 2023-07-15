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
    mainButton,
    feedback,
    input,
  } = elements;
  switch (status) {
    case 'loading':
      feedback.textContent = '';
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      mainButton.disabled = true;
      input.disabled = true;
      break;
    case 'success':
      mainButton.disabled = false;
      input.disabled = false;
      feedback.textContent = i18nextInstance.t('form.rssLoadSucces');
      form.reset();
      input.focus();
      break;
    case 'failed':
      mainButton.disabled = false;
      input.disabled = false;
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    default:
      break;
  }
};

const render = (elements, i18nextInstance, state) => (path, value) => {
  switch (path) {
    case 'form.validationStatus':
      handleFormStatus(elements, value);
      break;
    case 'form.error':
      renderFormError(elements, i18nextInstance, value);
      break;
    case 'loadingProcess.dowloadStatus':
      handleDowloadStatus(elements, i18nextInstance, value);
      break;
    case 'loadingProcess.error':
      renderDowloadError(elements, i18nextInstance, value);
      break;
    case 'feeds':
      renderFeeds(elements, i18nextInstance, value);
      break;
    case 'posts':
      renderPosts(elements, state, i18nextInstance, value);
      break;
    case 'uiState.activeFeed':
      renderPosts(elements, state, i18nextInstance, state.posts);
      break;
    case 'uiState.postId':
      renderModal(elements, i18nextInstance, state);
      break;
    case 'lng':
      i18nextInstance.changeLanguage(value).then(() => {
        renderTranslate(elements, i18nextInstance);
        renderPosts(elements, state, i18nextInstance, state.posts);
        renderFeeds(elements, i18nextInstance, state.feeds);
      });
      break;
    default:
      break;
  }
};

export default (state, elements, language) => onChange(state, render(elements, language, state));
