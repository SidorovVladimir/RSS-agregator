export default (elements, initialState, i18nextInstance) => {
  const {
    title,
    description,
    linkButton,
    closeButton,
  } = elements.modal;

  const currentPost = initialState.posts.find((post) => post.id === initialState.uiState.postId);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  linkButton.setAttribute('href', `${currentPost.link}`);
  linkButton.textContent = i18nextInstance.t('modal.linkButton');
  closeButton.textContent = i18nextInstance.t('modal.closeButton');
};
