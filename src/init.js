import * as yup from 'yup';
import onChange from 'on-change';

const handleError = (elements, error) => {
  const { feedback } = elements;
  switch (error) {
    case 'url':
      feedback.textContent = 'Ссылка должна быть валидным URL';
      break;
    case 'notOneOf':
      feedback.textContent = 'RSS уже существует';
      break;
    case null:
      feedback.textContent = '';
      break;
    default:
      break;
  }
};

const render = (elements, state) => (path, value, prevValue) => {
  switch (path) {
    case 'form.error':
      handleError(elements, value);
      break;
    case 'form.valid':
      if (value) {
        elements.input.classList.remove('is-invalid');
        return;
      }
      elements.input.classList.add('is-invalid');
      break;
    default:
      break;
  }
};

export default () => {
  const state = {
    form: {
      valid: true,
      rssLink: [],
      error: null,
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
  };

  const watchState = onChange(state, render(elements, state));

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currentUrl = formData.get('url').trim();

    const schema = yup.string()
      .required()
      .url('Ссылка должна быть валидным URL')
      .notOneOf(watchState.form.rssLink, 'RSS уже существует');

    schema.validate(currentUrl)
      .then(() => {
        watchState.form.rssLink.push(currentUrl);
        watchState.form.valid = true;
        watchState.form.error = null;
      })
      .catch((error) => {
        watchState.form.error = error.type;
        watchState.form.valid = false;
      });
  });
};
