'use strict';

module.exports = (con) => {
  return {
    /*                     Votations
    ***************************************************************/
    storeVotation: function(votationData) {
      const key = 'votation:' + votationData.id;
      return new Promise((resolve, reject) => {
        con.hmset(key, votationData, (err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    },

    getVotation: function(votationId) {
      const key = 'votation:' + votationId;
      return new Promise((resolve, reject) => {
        con.hgetall(key, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });  
    },

    removeVotation: function(votationId, fields) {
      const key = 'votation:' + votationId;
      return new Promise((resolve, reject) => {
        con.hdel(key, fields, (err, numDeleted) => {
          if (err) return reject(err);
          return resolve(numDeleted);
        });
      });
    },

    /*                     Votes - Votations
    ***************************************************************/
    storeVote: function(voteData) {
      const key = 'vote:' + voteData.id;
      return new Promise((resolve, reject) => {
        con.hmset(key, voteData, (err) => {
          if (err) return reject(err);
          return resolve();
        });
      });      
    },

    getVote: function(voteId) {
      const key = 'vote:' + voteId;
      return new Promise((resolve, reject) => {
        con.hgetall(key, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });  
    },

    removeVote: function(voteId, fields) {
      const key = 'vote:' + voteId;
      return new Promise((resolve, reject) => {
        con.hdel(key, fields, (err, numDeleted) => {
          if (err) return reject(err);
          return resolve(numDeleted);
        });
      });
    },

    storeVoteByVotation: function(votationId, voteId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {        
        con.sadd(key, voteId, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },    

    getVotesByVotation: function(votationId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {
        con.smembers(key, (err, res) => {
          if (err) return reject(err);
          
          let votes = [];

          res.reduce((init, voteId) => {
            return init.then(() => {
              return this.getVote(voteId).then((res) => {
                votes.push(res);
                return Promise.resolve();              
              });
            })            
          }, Promise.resolve())
          .then(() => {
            return resolve(votes);
          })          
        });
      });
    },   
    
    removeVoteByVotation: function(votationId, voteId) {
      const key = 'votation:' + votationId + ':votes';
      return new Promise((resolve, reject) => {
        con.srem(key, voteId, (err, numRemoved) => {
          if (err) return reject(err);
          return resolve(numRemoved);
        });
      });
    },

    /*                     Users - Votations
    ***************************************************************/
    storeUserByVotation: function(votationId, userId) {      
      const key = 'votation:' + votationId + ':users';
      return new Promise((resolve, reject) => {        
        con.sadd(key, userId, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },

    getUsersByVotation: function(votationId) {
      const key = 'votation:' + votationId + ':users';
      return new Promise((resolve, reject) => {
        con.smembers(key, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    },

    removeUserFromVotation: function(userId, votationId) {
      const key = 'votation:' + votationId + ':users';
      return new Promise((resolve, reject) => {
        con.srem(key, userId, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    }
  };
}