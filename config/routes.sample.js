module.exports = {

  // controller#action
  '/users/:id?': { to: 'users#find' },
  'post /users': { to: 'users#create' },
  'put|post /users/:id': { to: 'users#update' },
  'get /users/:id/words/:slug*': { to: 'events#words' },
  'get /event/:slug+': { to: 'events#index', constraint: 'api#ip' },

  // redirections
  'get /to/google': { to: 'http://www.google.com' },
  'get /to/home': { to: '/' },

  // using a function
  'get /events/:id': { to: function *(id) { this.body = 'datatat' } },

};
