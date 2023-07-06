export default (elements, i18nextInstance) => {
  elements.title.textContent = i18nextInstance.t('form.title');
  elements.subtitle.textContent = i18nextInstance.t('form.subtitle');
  elements.exampleUrl.textContent = i18nextInstance.t('form.exampleUrl');
  elements.labelInput.textContent = i18nextInstance.t('form.labelInput');
  elements.mainButton.textContent = i18nextInstance.t('form.mainButton');
  elements.modal.linkButton.textContent = i18nextInstance.t('modal.linkButton');
  elements.modal.closeButton.textContent = i18nextInstance.t('modal.closeButton');
};
