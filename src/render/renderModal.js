export default (elements, i18nextInstance, state) => {
  const {
    title,
    description,
    linkButton,
  } = elements.modal;

  const currentPost = state.posts.find((post) => post.id === state.uiState.currentVisitedPostId);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  linkButton.setAttribute('href', `${currentPost.link}`);

  const currentVisitedPost = document.querySelector(`[data-id="${state.uiState.currentVisitedPostId}"]`);
  currentVisitedPost.classList.remove('fw-bold');
  currentVisitedPost.classList.add('fw-normal', 'link-secondary');
};
