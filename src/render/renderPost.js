export default (elements, state, i18nextInstance, posts) => {
  if (posts.length === 0) return;

  elements.posts.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t('posts');

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const linkItem = document.createElement('a');
    linkItem.setAttribute('href', `${post.link}`);
    linkItem.setAttribute('target', '_blank');
    linkItem.setAttribute('rel', 'noopener noreferrer');
    linkItem.setAttribute('data-id', `${post.id}`);
    linkItem.textContent = post.title;

    if (state.uiState.visitedPostsId.includes(post.id)) {
      linkItem.classList.add('fw-normal', 'link-secondary');
    } else {
      linkItem.classList.add('fw-bold');
    }

    const buttonItem = document.createElement('button');
    buttonItem.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonItem.setAttribute('type', 'button');
    buttonItem.setAttribute('data-id', `${post.id}`);
    buttonItem.setAttribute('data-bs-toggle', 'modal');
    buttonItem.setAttribute('data-bs-target', '#modal');
    buttonItem.textContent = i18nextInstance.t('viewPost');
    listGroupItem.append(linkItem, buttonItem);
    listGroup.append(listGroupItem);
  });
  cardBody.append(cardTitle);
  card.append(cardBody, listGroup);
  elements.posts.append(card);
};
