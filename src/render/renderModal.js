export default (elements, i18nextInstance, initialState) => {
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

  const currentVisitedPost = document.querySelector(`[data-id="${initialState.uiState.postId}"]`);
  currentVisitedPost.classList.remove('fw-bold');
  currentVisitedPost.classList.add('fw-normal', 'link-secondary');
};
