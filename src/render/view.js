import onChange from 'on-change';
import renderFeeds from './renderFeed.js';
import renderPosts from './renderPost.js';
import renderModal from './renderModal.js';
import renderTranslate from './renderTranslate.js';

const handleForm = (elements, i18nextInstance, value) => {
  const { isValid, error } = value;
  const { feedback, input } = elements;
  if (!isValid) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nextInstance.t(`errors.${error}`);
    return;
  }
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.textContent = '';
};

const handleLoadingProcess = (elements, i18nextInstance, value) => {
  const { status, error } = value;
  const {
    form,
    submit,
    feedback,
    input,
  } = elements;
  switch (status) {
    case 'loading':
      feedback.classList.remove('text-success');
      input.classList.remove('is-invalid');
      submit.disabled = true;
      input.disabled = true;
      break;
    case 'success':
      submit.disabled = false;
      input.disabled = false;
      feedback.classList.add('text-success');
      feedback.textContent = i18nextInstance.t('form.rssLoadSucces');
      form.reset();
      input.focus();
      break;
    case 'failed':
      submit.disabled = false;
      input.disabled = false;
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t(`errors.${error}`);
      break;
    default:
      break;
  }
};

const render = (elements, i18nextInstance, initialState) => (path, value) => {
  switch (path) {
    case 'form':
      handleForm(elements, i18nextInstance, value);
      break;
    case 'loadingProcess':
      handleLoadingProcess(elements, i18nextInstance, value);
      break;
    case 'feeds':
      renderFeeds(elements, i18nextInstance, value);
      break;
    case 'posts':
      renderPosts(elements, initialState, i18nextInstance, value);
      break;
    case 'uiState.postId':
      renderModal(elements, i18nextInstance, initialState);
      break;
    case 'lng':
      i18nextInstance.changeLanguage(value).then(() => {
        renderTranslate(elements, i18nextInstance, value);
        renderPosts(elements, initialState, i18nextInstance, initialState.posts);
        renderFeeds(elements, i18nextInstance, initialState.feeds);
        handleForm(elements, i18nextInstance, initialState.form);
        handleLoadingProcess(elements, i18nextInstance, initialState.loadingProcess);
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
