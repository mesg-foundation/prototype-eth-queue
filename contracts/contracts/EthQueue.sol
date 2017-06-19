pragma solidity ^0.4.4;

import "../node_modules/zeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract EthQueue is Destructible {

  //*****************
  // Structures
  //*****************

  struct EventListener {
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

  mapping(address => EventListener[]) private eventListeners;
  address[] private creatorsAddress;

  //*****************
  // Events
  //*****************

  event EventListenerUpdated(
    address creator,
    uint index
  );

  event EventListenerThatReachesErrorLimit(
    address creator,
    uint index
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

  function getEventListener(address _creator, uint _index) public constant
  returns (
    address creator,
    uint index,
    address contractAddress,
    string eventName,
    string eventInputsAbi,
    string httpEndpoint,
    bool enable,
    string secret,
    string email
  ) {
    EventListener eventListener = eventListeners[_creator][_index];
    return (
      _creator,
      _index,
      eventListener.contractAddress,
      eventListener.eventName,
      eventListener.eventInputsAbi,
      eventListener.httpEndpoint,
      eventListener.enable,
      eventListener.secret,
      eventListener.email
    );
  }

  function getEventListenersCount(address creator) public constant returns (uint count) {
    return eventListeners[creator].length;
  }

  function getUsersAddress() public constant returns (address[] users) {
    return creatorsAddress;
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

    //get EventListeners of creator
    EventListener[] eventListenersOfCreator = eventListeners[creator];

    //add creator address to creators if don't exist
    if (eventListenersOfCreator.length == 0) {
      creatorsAddress.push(creator);
    }

    //add new EventListener to EventListeners
    eventListenersOfCreator.push(EventListener({
      contractAddress: contractAddress,
      eventName: eventName,
      eventInputsAbi: eventInputsAbi,
      httpEndpoint: httpEndpoint,
      enable: true,
      secret: secret,
      email: email
    }));

    //send event
    EventListenerUpdated(creator, eventListenersOfCreator.length - 1);
  }

  function updateEventListener(
    uint index,
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
    EventListener eventListener = eventListeners[creator][index];

    //update
    eventListener.contractAddress = contractAddress;
    eventListener.eventName = eventName;
    eventListener.eventInputsAbi = eventInputsAbi;
    eventListener.httpEndpoint = httpEndpoint;
    eventListener.enable = enable;
    eventListener.secret = secret;
    eventListener.email = email;

    //send event
    EventListenerUpdated(creator, index);
  }

  function updateEnableEventListener(
    uint index,
    bool enable
  ) public {
    address creator = msg.sender;

    //get EventListener
    EventListener eventListener = eventListeners[creator][index];

    //disable the event
    eventListener.enable = enable;

    //send event
    EventListenerUpdated(creator, index);
  }

  function disableEventListenerThatReachesErrorLimit(
    address creator,
    uint index
  ) onlyOwner public {
    //get EventListener
    EventListener eventListener = eventListeners[creator][index];

    //disable the event
    eventListener.enable = false;

    //send event
    EventListenerUpdated(creator, index);
    EventListenerThatReachesErrorLimit(creator, index);
  }

}
