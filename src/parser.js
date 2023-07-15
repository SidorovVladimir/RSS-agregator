export default (content, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/xml');
  if (doc.querySelector('parsererror')) {
    const error = new Error();
    error.name = 'ParserError';
    throw error;
  }
  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    link: url,
  };
  const feedItems = doc.querySelectorAll('item');
  const posts = [...feedItems].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  return { feed, posts };
};
