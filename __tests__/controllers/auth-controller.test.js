const AuthController = require('../../app/controllers/auth-controller');
let authController = null;

const user = {
  name: 'test',
  password: '1234',
};

function construct(secret, db) {
  return new AuthController(secret, db);
}

beforeAll(() => {
  authController = construct('s3cr3t', knex);
})

describe('tests constructor', () => {
  it('tests valid constructor', () => {
    expect(authController).toBeInstanceOf(AuthController);
    expect(authController.secret).not.toBe(null);
    expect(authController.secret).not.toBe(undefined);
    expect(typeof authController.secret).toBe('string');
    expect(authController.db).toBe(knex);
  });
  
  // it('tests missing secret in constructor', () => {
  //   expect(construct(undefined, knex)).toThrowError(/Invalid configuration for AuthController/);
  //   expect(construct(null, knex)).toThrowError(/Invalid configuration for AuthController/);
  // });

  // it('tests missing db in constructor', () => {
  //   expect(construct('s3cr3t', undefined)).toThrowError(/Invalid configuration for AuthController/);
  //   expect(construct('s3cr3t', null)).toThrowError(/Invalid configuration for AuthController/);
  // });
});


it('tests all methods exist', () => {
  expect(authController).toHaveProperty('authenticateUser');
  expect(authController).toHaveProperty('authenticateToken');
});

describe('#authenticateUser', () => {
  beforeAll((done) => {
    knex.table('users').insert(user).then((v) => {
      done();
    });
  });

  afterAll(() => {
    knex.table('users').del().then((v) => {
    });
  })

  it('tests missing username returns error message', (done) => {
    const response = {
      send: (response) => {
        expect(response).toEqual('Name or password missing');
        done();
      }
    };

    authController.authenticateUser({
      body: {
        username: null,
        password: 'password',
      }
    },
      response
    );
  });

  it('tests missing password returns error message', (done) => {
    const response = {
      send: (response) => {
        expect(response).toEqual('Name or password missing');
        done();
      }
    };

    authController.authenticateUser({
      body: {
        username: 'name',
        password: null,
      }
    },
      response
    );
  });

  it('tests that created user is found', (done) => {
    const response = {
      json: (response) => {
        expect(response).toHaveProperty('token');
        expect(response.token).not.toBe(null);
        expect(response.token).not.toBe(undefined);
        done();
      }
    };

    authController.authenticateUser({ body: user }, response);
  });

  it('tests that invalid user returns error message', (done) => {
    const response = {
      send: (response) => {
        expect(response).toEqual('Unable to find user.');
        done();
      }
    };

    authController.authenticateUser({body: {name: 'fake', password: 'news'}}, response);
  });


});