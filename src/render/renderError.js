const renderFormError = (elements, i18nextInstance, error) => {
  const { feedback } = elements;
  switch (error) {
    case 'urlValid':
      feedback.textContent = i18nextInstance.t('errors.urlValid');
      break;
    case 'rssDublicate':
      feedback.textContent = i18nextInstance.t('errors.rssDublicate');
      break;
    default:
      throw new Error(`Unknown validationError: ${error}`);
  }
};

const renderDowloadError = (elements, i18nextInstance, error) => {
  const { feedback } = elements;
  switch (error) {
    case null: return;
    case 'networkError':
      feedback.textContent = i18nextInstance.t('error.networkError');
      break;
    case 'parserError':
      feedback.textContent = i18nextInstance.t('errors.parserError');
      break;
    case 'unknownError':
      feedback.textContent = i18nextInstance.t('errors.unknownError');
      break;
    default:
      break;
  }
};
export { renderDowloadError, renderFormError };
