This system routes messages from a client to multiple delivery channels (Email, SMS, WhatsApp) and logs all activity.

Services:
Task Router: Receives and routes messages
Delivery Services: Sends messages to target channel
Logging Service: Stores logs for monitoring

 Use Postman to send messages to Task Router:


POST http://localhost:3000/message/send
Body: {
  "id": "msg001",
  "body": "Hello world",
  "channel": "email"
}

{
  "id": "msg001",
  "body": "Hello world",
  "channel": "email"
}

MongoDB connected for Task Router
Message queued for delivery: ID=msg001


MongoDB connected for Email Service
EMAIL SENT → ID: msg001


