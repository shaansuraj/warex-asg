/**
 * notification.service.js
 * Manages WebSocket (Socket.io) notifications to Admins.
 */

let io;

/**
 * Initializing the Socket.io server instance.
 * @param {Server} server - Socket.io server
 */
function initialize(server) {
  io = server;

  // Listening for connections> Here we could have checked if the connected user is admin. 
  //if (userData.role === 'admin') 
    // connectedAdmins.set(socket.id, userData.userId);
  //Ia am skipping this to keep it simple to test


  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

/**
 * Notify all connected admins about a new order.
 * @param {Object} payload
 */
function notifyAdmins(payload) {
  // Broadcast to all connected sockets (we can filter for admins if needed but since this is only to check the implementation and logics, I am keeping it simple as a broadcast to all connection)
  if (io) {
    io.emit('adminNotification', payload);
  }
}

module.exports = {
  initialize,
  notifyAdmins
};
