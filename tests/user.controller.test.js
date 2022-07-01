process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { ObjectId } = require('mongoose').Types;

const { User } = require('../models/User');
const server = require('../index');

let should = chai.should();
chai.use(chaiHttp);
describe('User', () => {
  describe('postRegister', () => {
    before(async () => {
      await User.deleteMany();
    });
    after(async () => {
      await User.deleteMany();
    });

    context('invalid data', () => {
      it('Should not Sign Up User with invalid user data', (done) => {
        const user = {
          email: 'ramimohamed',
          password: '12345678',
        };
        chai
          .request(server)
          .post('/api/user/register')
          .send(user)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors').eql([
              {
                value: 'ramimohamed',
                msg: 'Please enter a valid email',
                param: 'email',
                location: 'body',
              },
            ]);
            done();
          });
      });
    });
    context('exist User', () => {
      const user = {
        email: 'ramimohamed@test.com',
        password: '12345678',
      };
      before(async () => {
        const dbUser = new User(user);
        await dbUser.save();
      });
      it('Should not Sign Up User if User email already exists', (done) => {
        chai
          .request(server)
          .post('/api/user/register')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    context('valid data', () => {
      before(async () => {
        await User.deleteMany();
      });
      it('Should Sign Up User Successfully with valid user data', (done) => {
        const user = {
          email: 'ramimohamed@test.com',
          password: '12345678',
        };

        chai
          .request(server)
          .post('/api/user/register')
          .send(user)
          .end(async (err, res) => {
            if (err) console.log(err);
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('user');
            res.body.user.should.have.property('email').eql(user.email);
            done();
          });
      });
    });
  });

  describe('postLogin', () => {
    before(async () => {
      const user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
    });
    after(async () => {
      await User.deleteMany();
    });

    it('Should Login User successfully if user data is correct', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({
          email: 'ramimohamed@test.com',
          password: '12345678',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('Should not Login User if user data is incomplete', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({
          email: 'rami.zahran@assesstm.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors').eql([
            {
              msg: 'Please enter a password with at least 8 characters',
              param: 'password',
              location: 'body',
            },
          ]);
          done();
        });
    });
    it('Should not Login User if user email is incorrect', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({
          email: 'rami@test.com',
          password: '12345678',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('error')
            .eql('User rami@test.com not found.');
          done();
        });
    });
    it('Should not Login User if user password is incorrect', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({
          email: 'ramimohamed@test.com',
          password: '123456789',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Wrong Email or Password');
          done();
        });
    });
  });

  describe('getProfile', () => {
    let token, user;
    before(async () => {
      user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
      token = await user.generateAuthToken();
    });
    after(async () => {
      await User.deleteMany();
    });
    it('Should get user successfully if auth token is correct', (done) => {
      chai
        .request(server)
        .get(`/api/user/profile`)
        .set('auth', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('isAuth').eql(true);
          res.body.should.have.property('user');
          res.body.user.should.have.property('email').eql(user.email);
          done();
        });
    });
  });

  describe('Logout', () => {
    let token, user;
    before(async () => {
      user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
      token = await user.generateAuthToken();
    });
    after(async () => {
      await User.deleteMany();
    });
    it('Should logout user successfully if auth token is correct', (done) => {
      chai
        .request(server)
        .get(`/api/user/logout`)
        .set('auth', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('Get All', () => {
    let token, user, adminUser, adminToken;
    before(async () => {
      user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
      token = await user.generateAuthToken();

      adminUser = new User({
        email: 'ramimohamed_admin@test.com',
        password: '12345678',
        isAdmin: true,
      });
      await adminUser.save();
      adminToken = await adminUser.generateAuthToken();
    });
    after(async () => {
      await User.deleteMany();
    });
    it('Should not get all users if user is not admin', (done) => {
      chai
        .request(server)
        .get(`/api/user/all`)
        .set('auth', token)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('error')
            .eql(
              "You don't have permission. Ask an admin to upgrade your role."
            );
          done();
        });
    });

    it('Should get all users successfully if auth token is correct and user is admin', (done) => {
      chai
        .request(server)
        .get(`/api/user/all`)
        .set('auth', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('users');
          done();
        });
    });
  });

  describe('Toggle Admin', () => {
    let token, user, adminUser, adminToken;
    before(async () => {
      user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
      token = await user.generateAuthToken();

      adminUser = new User({
        email: 'ramimohamed_admin@test.com',
        password: '12345678',
        isAdmin: true,
      });
      await adminUser.save();
      adminToken = await adminUser.generateAuthToken();
    });
    after(async () => {
      await User.deleteMany();
    });
    it('Should not toggle admin if user is not admin', (done) => {
      chai
        .request(server)
        .patch(`/api/user/${user._id}`)
        .set('auth', token)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('error')
            .eql(
              "You don't have permission. Ask an admin to upgrade your role."
            );
          done();
        });
    });
    it('Should return not found if userId is not found', (done) => {
      chai
        .request(server)
        .patch(`/api/user/${new ObjectId()}`)
        .set('auth', adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('User not found!');
          done();
        });
    });

    it('Should toggle admin successfully if auth token is correct and user is admin', (done) => {
      chai
        .request(server)
        .patch(`/api/user/${user._id}`)
        .set('auth', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
