export default (elements, i18nextInstance, initialState) => {
  const {
    title,
    description,
    linkButton,
  } = elements.modal;

  const currentPost = initialState.posts.find((post) => post.id === initialState.uiState.postId);
  title.textContent = currentPost.title;
  description.textContent = currentPost.description;
  linkButton.setAttribute('href', `${currentPost.link}`);

  const currentVisitedPost = document.querySelector(`[data-id="${initialState.uiState.postId}"]`);
  currentVisitedPost.classList.remove('fw-bold');
  currentVisitedPost.classList.add('fw-normal', 'link-secondary');
};
