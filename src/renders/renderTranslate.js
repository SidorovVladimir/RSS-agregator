export default (elements, i18nextInstance, lng) => {
  const {
    languageMenu,
    languageButton,
    title,
    subtitle,
    exampleUrl,
    labelInput,
    submit,
  } = elements;

  const activeLanguage = languageMenu.querySelector('.active');
  activeLanguage.classList.remove('active');
  const currentLanguage = languageMenu.querySelector(`[data-lng = "${lng}"]`);
  currentLanguage.classList.add('active');

  languageButton.textContent = i18nextInstance.t('languageButton');
  title.textContent = i18nextInstance.t('form.title');
  subtitle.textContent = i18nextInstance.t('form.subtitle');
  exampleUrl.textContent = i18nextInstance.t('form.exampleUrl');
  labelInput.textContent = i18nextInstance.t('form.labelInput');
  submit.textContent = i18nextInstance.t('form.submit');
};
