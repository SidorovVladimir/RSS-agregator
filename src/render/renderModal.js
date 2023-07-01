export default (elements, i18nextInstance, state) => {
  const {
    title,
    description,
    linkButton,
    closeButton,
  } = elements.modal;

  linkButton.textContent = i18nextInstance.t('modal.linkButton');
  closeButton.textContent = i18nextInstance.t('modal.closeButton');

  const currentPost = state.posts.find((post) => post.id === state.currentVisitedPostId);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  linkButton.setAttribute('href', `${currentPost.link}`);

  const currentVisitedPost = document.querySelector(`[data-id="${state.currentVisitedPostId}"]`);
  currentVisitedPost.classList.remove('fw-bold');
  currentVisitedPost.classList.add('fw-normal', 'link-secondary');
};
