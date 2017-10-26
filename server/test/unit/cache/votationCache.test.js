const vc = require('../../../app/cache').votationCache
    , flush = require('../../../app/cache').flush
    , chai = require('chai')
    
    , expect = chai.expect;

describe('votation cache', () => {

  const votation1 = { id: '1', title: 'test' }
      , vote1 = { id: '1', value: '1/2', creatorId: '1', votaion_id: '1' }
      , vote2 = { id: '2', value: '1', creatorId: '2', votaion_id: '1' }
      , fakeUser = { id: '1' };

  before((done) => {
    flush().then(done);
  });

  describe('votations', () => {
    it('should store votation data and resolve undefined', (done) => {
      vc.storeVotation(votation1)
      .then((res) => {
        expect(res).to.be.equal(undefined);
        done();
      });
    });

    it('should get votation by id', (done) => {
      vc.getVotation(votation1.id)
      .then((res) => {
        expect(res).to.deep.eql(votation1);
        done();
      });
    });

    it('should delete votation by id and all it fields '
    + 'and resolve num fields deleted', (done) => {
      vc.removeVotation(votation1.id, Object.keys(votation1))
      .then((res) => {
        expect(res).to.be.equal(Object.keys(votation1).length);
        done();
      });
    })
  });

  describe('votes', () => {
    before((done) => {
      vc.storeVotation(votation1).then(done);
    });

    it('should store vote data and resolve undefined', (done) => {
      vc.storeVote(vote1).then(() => vc.storeVote(vote2))
      .then((res) => {
        expect(res).to.be.equal(undefined);
        done();
      });
    });

    it('should get vote by id', (done) => {
      vc.getVote(vote1.creatorId)
      .then((res) => {
        expect(res).to.deep.eql(vote1);
        done();
      });
    });

    it('should store vote by corresponding votation and resolve num stored', (done) => {      
      vc.storeVoteByVotation(votation1.id, vote1.creatorId)
      .then((res) => {
        expect(res).to.be.equal(1);
        done();
      });
    });

    it('should get array of stored votes by votation id', (done) => {
      vc.getVotesByVotation(votation1.id)
      .then((res) => {
        expect(res).to.deep.eql([vote1]);
        done();
      });
    });

    it('should remove stored vote by votation id and it creator id '
     + 'and resolve num deleted', (done) => {
      vc.removeVoteByVotation(votation1.id, vote1.creatorId)
      .then((res) => {
        expect(res).to.be.equal(1);
        done();
      });
    });

    it('should remove vote by creator id and resolve num of '
     + 'deleted fields', (done) => {
      vc.removeVote(vote1.creatorId, Object.keys(vote1))
      .then((res) => {
        expect(res).to.be.equal(Object.keys(vote1).length);
        done();
      });
    });

    it('should remove all stored votes by votation id and resolve '
     + 'num deleted', (done) => {
      vc.storeVoteByVotation(votation1.id, vote1.creatorId)
      .then(() => vc.storeVoteByVotation(votation1.id, vote2.creatorId))
      .then(() => vc.removeAllVotesByVotation(votation1.id))
      .then((res) => {
        expect(res).to.be.equal(2);
        done();
      })
    });
  });

  describe('users', () => {
    before((done) => {
      vc.storeVotation(votation1).then(done);
    });

    it('should store user id by votation id', (done) => {
      vc.storeUserByVotation(fakeUser.id, votation1.id)
      .then((res) => {
        expect(res).to.be.equal(1);
        done();
      });
    });

    it('should get array of users id by votation id', (done) => {
      vc.getUsersByVotation(votation1.id)
      .then((res) => {
        expect(res).to.deep.eql([fakeUser.id]);
        done();
      });
    });

    it('should remove user id from corresponding votation and resolve and '
     + 'resolve num deleted', (done) => {
      vc.removeUserFromVotation(fakeUser.id, votation1.id)
      .then((res) => {
        expect(res).to.be.equal(1);
        done();
      })
     });
  });
});