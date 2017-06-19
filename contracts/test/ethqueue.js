const EthQueue = artifacts.require("./EthQueue.sol");

contract('EthQueue', accounts => {
  let instance
  
  describe("create contract", () => {
    it("create contract", () => {
      return EthQueue.new()
      .then( _instance => {
        instance = _instance
      })
    })
  })
  
  describe("create event listener", () => {
    it("#1 with account 0", () => {
      return instance.createEventListener(
        0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5, //Angur REP token,
        "Transfer(address,address,uint256)",
        "[{ \"name\": \"from\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"to\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"value\", \"type\": \"uint256\", \"indexed\": false }]",
        "http://webhook.site/84b7c8a2-1ed2-4533-8f66-bbc0c8142ba3",
        "super secret",
        "nicolas@mahe.me",
        {from: accounts[0]}
      )
    })
    it("#2 with account 0", () => {
      return instance.createEventListener(
        0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5, //Angur REP token,
        "OtherEvent2(address,address,uint256)",
        "[{ \"name\": \"from\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"to\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"value\", \"type\": \"uint256\", \"indexed\": false }]",
        "http://webhook.site/84b7c8a2-1ed2-4533-8f66-bbc0c8142ba3",
        "super secret 3",
        "nicolas@mahe.me",
        {from: accounts[0]}
      )
    })
    it("#3 with account 1", () => {
      return instance.createEventListener(
        0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5, //Angur REP token,
        "OtherEvent(address,address,uint256)",
        "[{ \"name\": \"from\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"to\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"value\", \"type\": \"uint256\", \"indexed\": false }]",
        "http://webhook.site/84b7c8a2-1ed2-4533-8f66-bbc0c8142ba3",
        "super secret 2",
        "jeanpierre@mahe.me",
        {from: accounts[1]}
      )
    })
  })
  
  describe("get event listener", () => {
    it("get event listener #0 wallet 0", () => {
      return instance.getEventListener(
        accounts[0],
        0,
        {from: accounts[0]}
      )
      .then( (eventListener) => {
        assert.equal(eventListener[0], accounts[0], "wallet address is not the same")
        assert.equal(eventListener[1], 0, "index is not the same")
        assert.equal(eventListener[2], 0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5, "contract address is not the same")
        assert.equal(eventListener[7], "super secret", "secret is not the same")
      })
    })
  })
  
  describe("update event listener", () => {
    it("update event listener #0 with account 0", () => {
      return instance.updateEventListener(
        0,
        0x48c80F1f4D53D5951EEEEEEEEEECba84f29F32a5, //Angur REP token,
        "Transfer(address,address,uint256)",
        "[{ \"name\": \"from\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"to\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"value\", \"type\": \"uint256\", \"indexed\": false }]",
        "http://webhook.site/84b7c8a2-1ed2-4533-8f66-bbc0c8142ba3",
        false,
        "super secret updated",
        "nicolas@mahe.me",
        {from: accounts[0]}
      )
      .then( () => {
        return instance.getEventListener(
          accounts[0],
          0,
          {from: accounts[0]}
        )
      })
      .then( (eventListener) => {
        assert.equal(eventListener[2], 0x48c80F1f4D53D5951EEEEEEEEEECba84f29F32a5, "contract address is not the same")
        assert.equal(eventListener[7], "super secret updated", "secret is not the same")
        assert.equal(eventListener[6], false, "enable is not the same")
      })
    })
    it("update event listener #3 with account 0. should fail", () => {
      return instance.updateEventListener(
        2,
        0x48c80F1f4D53D5951EEEEEEEEEECba84f29F32a5, //Angur REP token,
        "Transfer(address,address,uint256)",
        "[{ \"name\": \"from\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"to\", \"type\": \"address\", \"indexed\": true }, { \"name\": \"value\", \"type\": \"uint256\", \"indexed\": false }]",
        "http://webhook.site/84b7c8a2-1ed2-4533-8f66-bbc0c8142ba3",
        false,
        "super secret updated updated",
        "nicolas@mahe.me",
        {from: accounts[0]}
      )
      .then(assert.fail)
      .catch(e => {
        assert(e.message != "assert.fail()", "Should fail")
      })
    })
    it("update enable event listener #0 with account 0", () => {
      return instance.updateEnableEventListener(
        0,
        true,
        {from: accounts[0]}
      )
      .then( () => {
        return instance.getEventListener(
          accounts[0],
          0,
          {from: accounts[0]}
        )
      })
      .then( (eventListener) => {
        assert.equal(eventListener[6], true, "event should be enable")
      })
      .then( () => {
        return instance.updateEnableEventListener(
          0,
          false,
          {from: accounts[0]}
        )
      })
      .then( () => {
        return instance.getEventListener(
          accounts[0],
          0,
          {from: accounts[0]}
        )
      })
      .then( (eventListener) => {
        assert.equal(eventListener[6], false, "event should be disable")
      })
      .then( () => {
        return instance.updateEnableEventListener(
          0,
          true,
          {from: accounts[0]}
        )
      })
      .then( () => {
        return instance.getEventListener(
          accounts[0],
          0,
          {from: accounts[0]}
        )
      })
      .then( (eventListener) => {
        assert.equal(eventListener[6], true, "event should be disable")
      })
    })
  })

  describe("get users address", () => {
    it("get users address", () => {
      return instance.getUsersAddress(
        {from: accounts[0]}
      )
      .then( (addresses) => {
        assert.equal(addresses.length, 2, "addresses.length is not correct")
        assert.equal(addresses[0], accounts[0], "address is not correct")
        assert.equal(addresses[1], accounts[1], "address is not correct")
      })
    })
  })

  describe("get event listener count", () => {
    it("get event listener count for account 0", () => {
      return instance.getEventListenersCount(
        accounts[0],
        {from: accounts[0]}
      )
      .then( (count) => {
        assert.equal(count, 2, "count is not correct")
      })
    })
    it("get event listener count for account 1", () => {
      return instance.getEventListenersCount(
        accounts[1],
        {from: accounts[0]}
      )
      .then( (count) => {
        assert.equal(count, 1, "count is not correct")
      })
    })
  })

  describe("disable event listener that reaches error limit", () => {
    it("from owner", () => {
      return instance.disableEventListenerThatReachesErrorLimit(
        accounts[0],
        0,
        {from: accounts[0]}
      )
      .then( () => {
        return instance.getEventListener(
          accounts[0],
          0,
          {from: accounts[0]}
        )
      })
      .then( (eventListener) => {
        assert.equal(eventListener[6], false, "event should be disable")
      })
    })
    it("from second account. should fail", () => {
      return instance.disableEventListenerThatReachesErrorLimit(
        accounts[0],
        0,
        {from: accounts[1]}
      )
      .then(assert.fail)
      .catch(e => {
        assert(e.message != "assert.fail()", "Should fail")
      })
    })
  })
})
