import onChange from 'on-change';
import renderFeeds from './renders/renderFeed.js';
import renderPosts from './renders/renderPost.js';
import renderModal from './renders/renderModal.js';
import renderTranslate from './renders/renderTranslate.js';

const handleForm = (elements, initialState, i18nextInstance) => {
  const { isValid, error } = initialState.form;
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

const handleLoadingProcess = (elements, initialState, i18nextInstance) => {
  const { status, error } = initialState.loadingProcess;
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

const handle = (elements, initialState, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'form':
      handleForm(elements, initialState, i18nextInstance);
      break;
    case 'loadingProcess':
      handleLoadingProcess(elements, initialState, i18nextInstance);
      break;
    case 'feeds':
      renderFeeds(elements, initialState, i18nextInstance);
      break;
    case 'posts':
    case 'ui.visitedPosts':
      renderPosts(elements, initialState, i18nextInstance);
      break;
    case 'ui.postId':
      renderModal(elements, initialState, i18nextInstance);
      break;
    case 'lng':
      i18nextInstance.changeLanguage(value).then(() => {
        renderTranslate(elements, i18nextInstance, value);
        renderPosts(elements, initialState, i18nextInstance);
        renderFeeds(elements, initialState, i18nextInstance);
        if (!initialState.form.isValid) {
          handleForm(elements, initialState, i18nextInstance);
        } else {
          handleLoadingProcess(elements, initialState, i18nextInstance);
        }
      });
      break;
    default:
      break;
  }
};

export default (elements, initialState, i18nextInstance) => onChange(
  initialState,
  handle(elements, initialState, i18nextInstance),
);
