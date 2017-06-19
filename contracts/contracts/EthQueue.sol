pragma solidity ^0.4.4;

import "../node_modules/zeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract EthQueue is Destructible {

  //*****************
  // Structures
  //*****************

  struct EventListener {
    address creator;
    uint id;
    address contractAddress;
    string eventName;
    string eventInputsAbi;
    string httpEndpoint;
    bool enable;
    string secret;
    string email;
  }

  //*****************
  // State variables
  //*****************

  mapping(address => uint[]) public eventListenerIdsPerCreator;
  EventListener[] public eventListeners;

  //*****************
  // Events
  //*****************

  event EventListenerUpdated(
    uint id
  );

  event EventListenerThatReachesErrorLimit(
    uint id
  );

  //*****************
  // Constructor
  //*****************

  function EthQueue() public {
  }

  //*****************
  // Modifiers
  //*****************

  //*****************
  // Getters
  //*****************

  function eventListenerIdsForCreator(address creator) public constant returns (uint[] ids) {
    return eventListenerIdsPerCreator[creator];
  }

  function eventListenersCount() public constant returns (uint count) {
    return eventListeners.length;
  }

  //*****************
  // Setters
  //*****************

  function createEventListener(
    address contractAddress,
    string eventName,
    string eventInputsAbi,
    string httpEndpoint,
    string secret,
    string email
  ) public {
    address creator = msg.sender;
    uint id = eventListeners.length;

    //add new EventListener to eventListeners
    eventListeners.push(EventListener({
      creator: creator,
      id: id,
      contractAddress: contractAddress,
      eventName: eventName,
      eventInputsAbi: eventInputsAbi,
      httpEndpoint: httpEndpoint,
      enable: true,
      secret: secret,
      email: email
    }));

    //add id to eventListenerIdsPerCreator
    eventListenerIdsPerCreator[creator].push(id);

    //send event
    EventListenerUpdated(id);
  }

  function updateEventListener(
    uint id,
    address contractAddress,
    string eventName,
    string eventInputsAbi,
    string httpEndpoint,
    bool enable,
    string secret,
    string email
  ) public {
    address creator = msg.sender;
    //get EventListener
    EventListener eventListener = eventListeners[id];

    //check that creator is the same
    if (eventListener.creator != creator) {
      throw;
    }

    //update
    eventListener.contractAddress = contractAddress;
    eventListener.eventName = eventName;
    eventListener.eventInputsAbi = eventInputsAbi;
    eventListener.httpEndpoint = httpEndpoint;
    eventListener.enable = enable;
    eventListener.secret = secret;
    eventListener.email = email;

    //send event
    EventListenerUpdated(id);
  }

  function updateEnableEventListener(
    uint id,
    bool enable
  ) public {
    address creator = msg.sender;

    //get EventListener
    EventListener eventListener = eventListeners[id];

    //check that creator is the same
    if (eventListener.creator != creator) {
      throw;
    }

    //disable the event
    eventListener.enable = enable;

    //send event
    EventListenerUpdated(id);
  }

  function disableEventListenerThatReachesErrorLimit(
    uint id
  ) onlyOwner public {
    //get EventListener
    EventListener eventListener = eventListeners[id];

    //disable the event
    eventListener.enable = false;

    //send event
    EventListenerUpdated(id);
    EventListenerThatReachesErrorLimit(id);
  }

}
