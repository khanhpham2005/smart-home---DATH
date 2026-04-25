# WebSocket Guide - Smart Home System

## 1. Overview

This project uses **Spring WebSocket (STOMP)** combined with **JWT authentication** to provide real-time updates for IoT devices in the Smart Home System.

It supports:
- Real-time sensor data updates
- Actuator state changes (ON/OFF devices)
- JWT-secured WebSocket handshake
- User-based message routing

---

## 2. WebSocket Connection Endpoint

### URL

```text
ws://<HOST>:<PORT>/ws?token=<JWT_TOKEN>
```

### Example

```text
ws://localhost:8080/ws?token=eyJhbGciOiJIUzI1NiJ9...
```

---

## 3. Authentication Flow (JWT Handshake)

Before establishing WebSocket connection:

1. Client sends JWT via query param:

```text
?token=<JWT>
```

2. Server processes handshake using:
- `JwtHandshakeInterceptor`

3. Steps:
- Decode JWT using `JwtDecoder`
- Extract `userId` from `jwt.getSubject()`
- Store `userId` in WebSocket session attributes

4. If token is invalid → connection is rejected

---

## 4. WebSocket Topics

Each user receives messages on:

```text
/topic/users/{userId}
```

### Example:

```text
/topic/users/1
```

---

## 5. Message Structure

All messages follow this structure:

```json
{
  "type": "EVENT_TYPE",
  "timestamp": "ISO-8601",
  "payload": { }
}
```

## 6. Event types

### SENSOR_DATA

Triggered when a sensor sends new data.

#### Payload

```json
{
  "deviceId": 1,
  "sensorId": 10,
  "name": "Temperature Sensor",
  "sensorType": "TEMPERATURE",
  "value": 28.5,
  "unit": "C"
}
```

#### Full message

```json
{
  "type": "SENSOR_DATA",
  "timestamp": "2026-04-23T10:15:30Z",
  "payload": {
    "deviceId": 1,
    "sensorId": 10,
    "name": "Temperature Sensor",
    "sensorType": "TEMPERATURE",
    "value": 28.5,
    "unit": "C"
  }
}
```

### ACTUATOR_STATE

Triggered when a device state changes (ON/OFF, OPEN/CLOSE,...)

#### Payload

```json
{
  "deviceId": 1,
  "actuatorId": 5,
  "name": "Living Room Light",
  "actuatorType": "LIGHT",
  "actuatorState": "ON"
}
```

#### Full message

```json
{
  "type": "ACTUATOR_STATE",
  "timestamp": "2026-04-23T10:15:30Z",
  "payload": {
    "deviceId": 1,
    "actuatorId": 5,
    "name": "Living Room Light",
    "actuatorType": "LIGHT",
    "actuatorState": "ON"
  }
}
```