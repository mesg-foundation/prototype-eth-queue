### To test

In one terminal run 

```
docker-compose up rabbitmq
```

In another one when rabbitmq is finished to load

```
docker-compose up handler
```

In again another one you can send events with 

```
docker-compose run --rm handler ./sendEvent.js
```