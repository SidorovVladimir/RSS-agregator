export default (elements, i18nextInstance, feeds) => {
  if (feeds.length === 0) return;

  elements.feeds.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t('feeds');

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const itemTitle = document.createElement('h3');
    itemTitle.classList.add('h6', 'm-0');
    // --------------
    itemTitle.setAttribute('data-id', `${feed.id}`);
    // --------------
    itemTitle.textContent = feed.title;
    // ------------------
    // ------------------

    const itemDescription = document.createElement('p');
    itemDescription.classList.add('m-0', 'small', 'text-black-50');
    itemDescription.textContent = feed.description;
    listGroupItem.append(itemTitle, itemDescription);
    listGroup.append(listGroupItem);
  });
  cardBody.append(cardTitle);
  card.append(cardBody, listGroup);
  elements.feeds.append(card);
};
