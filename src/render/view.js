import onChange from 'on-change';
import renderFeedsHandler from './renderFeed.js';
import renderErrorHandler from './renderError.js';
import renderPostsHandler from './renderPost.js';
import renderModalHandler from './renderModal.js';
import translateText from './renderTranslate.js';

const renderFeedbackHandler = (elements, value, i18nextInstance) => {
  if (value !== 'rssLoadSucces') return;

  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.input.disabled = false;
  elements.mainButton.disabled = false;
  elements.feedback.textContent = i18nextInstance.t(`form.${value}`);
  elements.form.reset();
  elements.input.focus();
};

const handleProcessState = (elements, processState, i18nextInstance) => {
  switch (processState) {
    case 'filling':
      elements.input.disabled = false;
      elements.mainButton.disabled = false;
      break;
    case 'sending':
      elements.mainButton.disabled = true;
      elements.input.disabled = true;
      break;
    case 'rssLoadSucces':
      renderFeedbackHandler(elements, processState, i18nextInstance);
      break;
    default:
      throw new Error(`Unknown process ${processState}`);
  }
};

const render = (elements, i18nextInstance, state) => (path, value) => {
  switch (path) {
    case 'form.error':
      renderErrorHandler(elements, value, i18nextInstance);
      break;
    case 'form.processState':
      handleProcessState(elements, value, i18nextInstance);
      break;
    case 'feeds':
      renderFeedsHandler(elements, i18nextInstance, value);
      break;
    case 'posts':
      renderPostsHandler(elements, state, i18nextInstance, value);
      break;
    case 'uiState.currentVisitedPostId':
      renderModalHandler(elements, i18nextInstance, state);
      break;
    case 'lng':
      i18nextInstance.changeLanguage(value).then(() => {
        translateText(elements, i18nextInstance);
        renderPostsHandler(elements, state, i18nextInstance, state.posts);
        renderFeedsHandler(elements, i18nextInstance, state.feeds);
        renderFeedbackHandler(elements, state.form.processState, i18nextInstance);
      });
      break;
    default:
      break;
  }
};

export default (state, elements, language) => onChange(state, render(elements, language, state));
