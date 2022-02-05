exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('stakeholder_relations')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('stakeholder_relations').insert([
        {
          parent_id: '792a4eee-8e18-4750-a56f-91bdec383aa6',
          child_id: '1a05ec87-3c38-4395-b9f3-aa15becedc31',
          role: null,
          type: null,
        },
        {
          parent_id: '792a4eee-8e18-4750-a56f-91bdec383aa6',
          child_id: '1d2fb06e-e8f7-40de-8e13-ed3eba1abb3a',
          role: null,
          type: null,
        },
      ]);
    });
};
