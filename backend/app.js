require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { SerialPort } = require("serialport");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http")
const session = require("express-session");
const server = http.createServer(app);
app.use(bodyParser.json()); // for JSON data

// const serialPort2 = new SerialPort({ path: 'COM1', baudRate: 9600});

const corsOptions = {
  //https://testing-deployment2-46a3b.web.app/
  origin: "*",
  credentials: true,
  "access-control-allow-credentials": true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
}

const io = new Server(server, {
  cors: {
    origin: "https://alkuds-cd6a685335ea.herokuapp.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.join("123");
    const roomSize = io.of("/").adapter.rooms.get("123")?.size || 0;
    console.log(`Room ${"123"} has ${roomSize} clients`);
    
    // socket.on("join_room", (data) => {
    //   console.log(data.length)
    //   console.log("here room info:",data)
    //   socket.join(data);

    // });
  
    socket.on("send_message", (data) => {
      console.log(data.room)
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("send_order_update", (data) => {
      console.log(data, "here new update")
      socket.to(data.room).emit("receive_order_finish_state", data);
    });

    socket.on("send_order_new_state", (data) => {
      console.log(data.room, "here new state")
      socket.to(data.room).emit("receive_order_new_state", data);
    });

 
    socket.on("send_order_creation", (data) => {
      console.log(data.room, "here creation")
      socket.to(data.room).emit("receive_order_creation", data);
    });

    socket.on("send_transaction", (data) => {
      console.log(data.room, "here transactions")
      socket.to(data.room).emit("receive_transaction", data);
    });

  });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo db connected "))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );

  next();
});
app.use("/order", require("./routes/order"));
app.use("/car", require("./routes/car"));
app.use("/client", require("./routes/clients"));
app.use("/factory", require("./routes/factory"));
app.use("/driver", require("./routes/driver"));
app.use("/irons", require("./routes/irons"));
app.use("/ticketId", require("./routes/ticketId"));
app.use("/wallet", require("./routes/wallets"));
app.use("/user", require("./routes/user"));
app.use("/admin", require("./routes/admin"));

let readData;
// serialPort2.on("open", function () {
//     console.log("-- Connection opened --", serialPort2);
//     serialPort2.on("data", function (data) {
//         let x = data.toString().split('+');
//         if (x.length>1){
//             readData = x[1].trim()
//         }
//     });
// });

// app.get("/getWeight",(req,res)=>{
//     console.log("in api")
//     res.json(readData);
// });


if (process.env.NODE_ENV === 'production') {
  console.log("here")
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}


server.listen(process.env.PORT, () => console.log("running on port: "+process.env.PORT));
