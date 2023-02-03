/* eslint-disable camelcase */
export const createUser = ({
  id = 1,
  email = 'test@test.com',
  first_name = 'test',
  last_name = 'test',
  password = '123456',
} = {}) => ({ id, email, first_name, last_name, password });
