const commentsFields = {
  id: { type: 'id', label: 'ID' },

  text: { type: 'string', label: 'Text' },

  author: { type: 'relation_one', label: 'Author' },

  article: { type: 'relation_one', label: 'Article' },

  moderated: { type: 'boolean', label: 'Moderated' },
};

export default commentsFields;
