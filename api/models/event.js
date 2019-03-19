import mongo from "mongodb";

export default class EventModel {
  async add(req, res) {
    try {
      let db =req.app.locals.db;
      let response = await db.collection('events').insertOne(req.body);
      if (response) {
        res.status(201).send({
          message: "Event created successfully"
        });
      } else {
        res.status(500).send({
          message: "Unable to create event"
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getEventsByUser(req, res) {
    const userId = req.params.userId === 'me' ? req.userId : req.params.userId;
    let db =req.app.locals.db;
    let events = [];
    let invitedUsers = [];
    if (req.query.invite) {
      events = await db.collection('events').find({
        invitedUsers: userId
      }).toArray();
      for(let event of events) {
        let organizer = await db.collection('users').findOne({_id:mongo.ObjectId(event['organizer'])});
        event['organizer'] = organizer['firstName'] +" "+ organizer["lastName"];
      }
    } else {
      events = await db.collection('events').find({
        organizer: userId
      }).toArray();
      
      for(let event of events) {
        invitedUsers = await db.collection('users').find({
          _id: {$in : event['invitedUsers'].map((user)=> mongo.ObjectId(user))} 
        }).project({_id:0, firstName:1, lastName: 1}).toArray();
        event['invitedUsers'] = invitedUsers.map((user)=>{return user.firstName +" "+ user.lastName});
      }
    }
    if (!events) {
      res.status(404).send({
        message: "No event found"
      });
    } else {
      res.status(200).send(events);
    }
  }
}