export default (elements, error, i18nextInstance) => {
  const { feedback, input } = elements;
  input.classList.add('is-invalid');
  feedback.classList.add('text-danger');
  feedback.textContent = i18nextInstance.t(`errors.${error}`);
};
