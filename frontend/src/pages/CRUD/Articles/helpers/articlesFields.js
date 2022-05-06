const articlesFields = {
  id: { type: 'id', label: 'ID' },

  title: { type: 'string', label: 'Title' },

  body: { type: 'string', label: 'Body' },

  author: { type: 'relation_one', label: 'Author' },

  category: { type: 'relation_one', label: 'Category' },

  tags: { type: 'relation_many', label: 'Tags' },

  featured: { type: 'boolean', label: 'Featured' },

  images: { type: 'images', label: 'Images' },
};

export default articlesFields;
