const subscriptionmodel=require('./models/subscriptionmodel')
const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51OW1mTLwIAXUknlJ0RS3NXXX0hH6bpxw1kGygKWv6qYkkh77kMqd3GehvutWzYlQFjKXg9G0eAfZcMSz3E9HTVLg00OiTFr3Fp');

const notificationModel=require('./models/notificationmodel')
const cron = require('node-cron');
const ObjectId = require('mongodb').ObjectId; 
const moment = require('moment');
const notificationrouter=require('./routes/notificationsroute')
const uuid4=require('uuid4')
let rooms=[];
const accountroutes=require('./routes/accountroutes')
let onetime=false;
const creatornotificationrouter=require('./creator routes/creator-notifications')
const audioModel=require('./models/audiocallmodel')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
let connectedUsers=[]
// Your other requires...
const creatorroutes = require('./creator routes/creator-auth-routes');
const creator_message_routes=require('./creator routes/creator-messagae-routes')
const connection = require('./connection');
const searchroute=require('./routes/searchroute')
const reviewmodel=require('./routes/reviewroute')
const cors = require('cors');
const postroute = require("./routes/postroutes");
const authentication_routes = require('./routes/Authenticationroutes');
const messengerroute = require('./routes/messengeroute');
const subscriberoute=require('./routes/subscriptionroutes')
const reportroutes=require('./routes/reportroute')
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json())

// Routes
app.use(searchroute)
app.use(notificationrouter)
app.use(reportroutes)
app.use(authentication_routes);
app.use(postroute);
app.use(reviewmodel)
app.use(messengerroute);
app.use(creatorroutes);
app.use(creatornotificationrouter)
app.use(creator_message_routes)
app.use(subscriberoute)
app.use(accountroutes)
// Database connection
connection;

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to your frontend's URL for security
    methods: ['POST', 'GET'],
  }
});

// Example of handling socket connection
io.on('connection', (socket) => {
 //audiocall

socket.on('createRoom',(data)=>{
  console.log('createRoom')
  rooms=[];
let roomid=uuid4();
let creatorfound=connectedUsers.find(u=>u?.id?.toString()==data)
let roomdata={
  roomid,
  creator:data,
  socketid:creatorfound?.socketid
}
rooms=rooms?.filter(u=>u?.creator!=data)

if(rooms?.length==0){
rooms=[roomdata]
}else{
rooms=[...rooms,roomdata]
}
socket.join(roomid)
console.log(rooms)
})
socket.on('creatorconn-signal',(data)=>{
  const usersocketid=connectedUsers.find(u=>u?.socketid!=socket.id)
  let signaldata={
    signal:data?.signal,
    connUserSocketId:socket.id
  }
  console.log(data.connUserSocketId)
  io.to(data?.connUserSocketId).emit('conn-signal',signaldata)
  })


socket.on('conn-signal',(data)=>{
  let signaldata={
    signal:data?.signal,
    connUserSocketId:socket.id
  }
  console.log(data.connUserSocketId)
  io.to(data?.connUserSocketId).emit('conn-signal',signaldata)
  })
  socket.on('creator-signal',(data)=>{
    let usersocketid=connectedUsers.find(u=>u?.socketid!=data?.connUserSocketId)
    let signaldata={
      signal:data?.signal,
      connUserSocketId:socket.id
    }
    console.log('conn-signal LAST creator')
    console.log(data.connUserSocketId)
    io.to(data?.connUserSocketId).emit('conn-signal',signaldata)
  })


socket.on('joinRoom',(data)=>{
  console.log('joinRoom')
 console.log(data)
 let creatorroom=rooms?.find(u=>u?.creator==data?.creator)
 let usersocketid=connectedUsers.find(u=>u?.id==data?.user)
 let userAudioData={
  user:data?.user,
  roomid:creatorroom?.roomid,
  socketid:usersocketid?.socketid
 }
 rooms=rooms.filter(u=>u.user!=data)
 rooms=[...rooms,userAudioData]
socket.join(userAudioData?.roomid)
console.log('creator')
console.log(creatorroom)
console.log('user')
console.log(usersocketid)
  const conndata = {
    connUserSocketId:socket.id,
  };
  console.log(creatorroom)
  io.to(creatorroom?.socketid).emit('conn-prepare',conndata);

})


socket.on('conn-init',(data)=>{
  console.log(data.connUserSocketId)
  console.log('conn-init new')
  let newd={
    connUserSocketId:socket.id
  }
  console.log(rooms)
io.to(data?.connUserSocketId).emit('conn-init',newd)
})

 
cron.schedule('*/1 * * * *', async () => {
  try {
    
    const subnow = moment.utc();
    const subscriptions = await subscriptionmodel.find({}).populate('creator').populate('subscriber');
    
    for (const subscription of subscriptions) {
        // Fetch the most recent state of the subscription
        const freshSubscription = await subscriptionmodel.findById(subscription._id).populate('subscriber').populate('creator');
    
        let expirationDate = moment.utc(freshSubscription.expiray);
    
        // Check if the subscription has expired and not yet notified
        if (subnow.isAfter(expirationDate) && freshSubscription.notified === false) {
            let subnotificationreason = `${freshSubscription.creator.name} subscription expired`;
            await stripe.subscriptions.cancel(
              freshSubscription.subid
            );
            // Create notification
            await notificationModel.create({
                creator: freshSubscription.creator._id,
                user: freshSubscription.subscriber._id,
                reason: subnotificationreason
            });
    
            // Update subscription as notified
            await subscriptionmodel.findByIdAndUpdate(freshSubscription._id, {
                notified: true
            }, { new: true });
    
            // Emit socket notification
            let socketnotification = {
                creator: {
                    _id: freshSubscription.creator._id,
                    name: freshSubscription.creator.name
                },
                reason: subnotificationreason,
                user: freshSubscription.subscriber._id,
                createdAt: new Date().toISOString()
            };
            let socketidforsubnotification = connectedUsers.find(u => u?.id?.toString() === freshSubscription?.subscriber?._id.toString());
            if (socketidforsubnotification) {
                io.to(socketidforsubnotification?.socketid).emit('socketnotification', socketnotification);
            }
        }
    }
    
    
    
    
    let audioresponse = await audioModel.find({}).populate('creator').populate('user', null, null, { strictPopulate: false });
    let now = moment.utc().add(5, 'hours');


    for (const record of audioresponse) {
      try {
        let recordDate = moment.utc(record.date).add(5, 'hours');
        let [startTimeString, endTimeString] = record?.time?.split(' - ');
        let startTime = moment.utc(recordDate.format('YYYY-MM-DD') + 'T' + startTimeString);
        let endTime = moment.utc(recordDate.format('YYYY-MM-DD') + 'T' + endTimeString);
    
        // Calculate the difference in minutes between now and the start time
        const timeDiffMinutes = startTime.diff(now, 'minutes');
        let audioData=await audioModel.findById(record._id).populate('creator').populate('user')
        let audiosocketdata = {
          ...record.toObject(),
          link: false
        };
        console.log(timeDiffMinutes)
   
        if (timeDiffMinutes === 10 && audioData.notified!=10) {
          // Notification for 15 minutes before the call
          console.log(timeDiffMinutes)
          audiosocketdata = {
            ...audiosocketdata,
            calltime:10
          };
        console.log(`${record._id} call is 10 mins away`)  
await audioModel.findByIdAndUpdate(record._id,{
  notified:10
},{new:true})

        await notificationModel.create({
          user:audioData?.user?._id,
          creator:audioData?.creator?._id,
          reason:`you have a call with ${audioData?.creator?.name} in 10 minutes`
           })
           emitcallreminderNotification(audioData,"10 minutes")
           console.log(`u have call in 10 mins ${audioData._id}`)
         
                     emitAudioCallNotification(audiosocketdata, record);
      } else if (timeDiffMinutes === 5 && audioData.notified!=5) {
        audiosocketdata = {
          ...audiosocketdata,
          calltime:5
        };
          // Notification for 5 minutes before the call
          console.log(timeDiffMinutes)
          console.log(`${record._id} call is 5 mins away`)  
          await audioModel.findByIdAndUpdate(record._id,{
            notified:5
          })
          await notificationModel.create({
            user:audioData?.user?._id,
            creator:audioData?.creator?._id,
            reason:`you have a call with ${audioData?.creator?.name} in 5 minutes`
             })
             emitcallreminderNotification(audioData,"5 minutes")
             console.log(`u have call in 5 mins ${audioData._id}`)
           
                       emitAudioCallNotification(audiosocketdata, record);
        } else if (timeDiffMinutes === 0 && audioData.notified!=1) {
          // Notification for the call starting now
          console.log(timeDiffMinutes)
          audiosocketdata = {
            ...audiosocketdata,
            calltime:0
          };
          console.log(`${record._id} call is right now`)  
          await audioModel.findByIdAndUpdate(record._id,{
            notified:1
          },{new:true})
          await notificationModel.create({
            user:audioData?.user?._id,
            creator:audioData?.creator?._id,
            reason:`you have a call with ${audioData?.creator?.name} right now`
             })
             emitcallreminderNotification(audioData,"right now")
             console.log(`u have call right now ${audioData._id}`)
           
                       emitAudioCallNotification(audiosocketdata, record);
      
        
        }
  //       if (recordDate.isSame(now, 'day')) {
  //         const timeDiffMinutes = now.diff(endTime, 'minutes');
       
        
  //         if (timeDiffMinutes <= 10 && timeDiffMinutes > 0 ) {
  //           // Emit socket event for less than 10 minutes condition
      


  //         } else if (timeDiffMinutes <= 5 && timeDiffMinutes > 0) {
  //           // Emit socket event for less than 5 minutes condition
  // console.log(`you have call in 5 mins ${audioData._id}`)      
  
  //   await notificationModel.create({
  //  user:audioData?.user?._id,
  //  creator:audioData?.creator?._id,
  //  reason:`you have a call with ${audioData?.creator?.name} in 5 minutes`
  //   })
  //   emitcallreminderNotification(audioData,"5 minutes")
    
  

  //           emitAudioCallNotification(audiosocketdata, record);
  //         } else if (timeDiffMinutes === 0) {
  //          console.log(`you have call right now ${audioData._id}`)

  //   await notificationModel.create({
  //  user:audioData?.user?._id,
  //  creator:audioData?.creator?._id,
  //  reason:`you have a call with ${audioData?.creator?.name} right now`
  //   })
  //   emitcallreminderNotification(audioData,"right now")
  
  //           // Emit socket event for exact time match
  //           emitAudioCallNotification(audiosocketdata, record);
  //         } else if (now.isAfter(endTime)) {
  //           // Emit socket event for past records
  //           // emitAudioCallNotification(audiosocketdata, record);
  //         } else {
            
  //         }
  //       } else if (recordDate.isBefore(now, 'day')) {
  //         // Emit socket event for date already passed
  //         let audiosocketdata = {
  //           ...record.toObject(),
  //           link: false
  //         };
  //         emitAudioCallNotification(audiosocketdata, record);
  //       }
      } catch (error) {
        console.error(`Error processing record ${record?._id}: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching records from audioModel: ${error}`);
  }
});

function emitAudioCallNotification(audiosocketdata, record) {
  let creatorfound = connectedUsers?.find(u => u?.id.toString() === record?.creator?._id?.toString());
  let userfound = connectedUsers?.find(u => u?.id === record?.user?._id?.toString());
console.log('user creator found')
  console.log(creatorfound)
console.log(userfound)
console.log(connectedUsers)
  if (creatorfound && userfound) {
    console.log("audiocall sending")
    console.log(audiosocketdata)
    io.to(userfound?.socketid).emit('audicall-notification', audiosocketdata);
    io.to(creatorfound?.socketid).emit('audicall-notification', audiosocketdata);
  }
}

function emitcallreminderNotification(audioData,time){
  let userfound = connectedUsers?.find(u => u?.id === audioData?.user?._id?.toString());
  let socketnotificationreminder={
    creator:{
      _id:audioData?.creator?._id,
      name:audioData?.creator?.name
    },
    reason:`you have a call with ${audioData?.creator?.name} in ${time}`,
    user:audioData?.user?._id,
    createdAt:new Date().toISOString()
  }
    io.to(userfound?.socketid).emit('socketnotification',socketnotificationreminder)

  }

socket.on('connectedUser',(data)=>{
  console.log('connectedUser');

  
  const userIndex = connectedUsers.findIndex(user => user?.id === data);

  if (userIndex !== -1) {

    connectedUsers[userIndex].socketid = socket?.id;
  } else {

    let newdata = {
      socketid: socket?.id,
      id: data
    };
    connectedUsers = [...connectedUsers, newdata];
  }

  console.log(connectedUsers);
})

socket.on('declineCall',(data)=>{
  let roomfound=rooms.find(u=>u.creator==data)
  if(roomfound){
    io.to(roomfound.socketid).emit('declineCall')
  }
})
socket.on('leaveCalluser',(data)=>{

 let userorcreator=connectedUsers.find(u=>u.id==data)
 console.log(connectedUsers)
console.log(data)
 console.log('leavecalluser')
 console.log(userorcreator)
 if(userorcreator){
  io.to(userorcreator.socketid).emit('leaveCalluser',userorcreator)
 }
})


socket.on('sendMessage',(data)=>{
 let {creator,user,sender,reciever,message}=data;
 console.log(data)
 console.log('socket client')
 if(connectedUsers.find(u=>u?.id==user?.toString()) && connectedUsers.find(u=>u?.id==creator?.toString())){
let recieverdata=connectedUsers.find(u=>u.id==reciever.toString())
let sendMessageData={
    creator,
    user,
    sender,
    reciever,
    message
}
io.to(recieverdata.socketid).emit('sendMessage',sendMessageData)
 }   
})

socket.on('currentchatuser',(data)=>{
  console.log('currentchat')
  let index=connectedUsers.findIndex(u=>u?.id==data.user)
  let newdata={
    user:data?.user,
    currentchatuser:socket.id
  }
 
  let currentchatuser=connectedUsers.find(u=>u?.id==data.currentchatuser)
  io.to(currentchatuser?.socketid).emit('seenMessages',newdata)
  console.log(data)
})
//notifications
socket.on('socketnotification',(data)=>{
  console.log('socketnotification')

  let usersocketid=connectedUsers?.find(u=>u?.id==data?.user)
  io.to(usersocketid?.socketid).emit('socketnotification',data)
  console.log(data)
})



  socket.on('disconnect', () => {
let userid_of_disconnected_user=connectedUsers.find(u=>u?.socketid==socket?.id)
let room_of_disconnected_user=rooms?.find(r=>r?.socketid==userid_of_disconnected_user?.socketid)
rooms.filter(r=>r?.socketid!=socket.id)
console.log('room')
console.log(room_of_disconnected_user)
    connectedUsers=connectedUsers.filter(u=>u?.socketid!=socket?.id)
    // rooms.filter(u=>u?.socketid!=socket.id)
// console.log(roomid)
socket.leave(room_of_disconnected_user?.roomid)
// if(roomid){
//   io.to(roomid).emit('user-disconnected',{socketId:socket.id})
//   console.log('disconnect')
//   console.log(roomid)
// }
  // if(room_of_disconnected_user){
  //   io.to(room_of_disconnected_user?.roomid).emit('user-disconnected',{socketId:socket.id})
  // io.to(userid_of_disconnected_user?.socketid).emit('disconnecteduser')
  // }
console.log('user disconnected');
    console.log(connectedUsers)

  });

  // Other socket event handlers...
});




//schedule




// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
