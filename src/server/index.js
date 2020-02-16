import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import db from "./database";
import servicesLoader from "./services";

const utils = {
  db
};

const services = servicesLoader(utils);
const root = path.join(__dirname, "../../");

const app = express();

app.use(cors());
app.use(compression());
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "*.amazonaws.com"]
//     }
//   })
// );
// app.use(helmet.referrerPolicy({ policy: "same-origin" }));

const serviceName = Object.keys(services);
for (let index = 0; index < serviceName.length; index++) {
  const name = serviceName[index];
  if (name === "graphql") {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.use("/", express.static(path.join(root, "dist/client")));
app.use("/uploads", express.static(path.join(root, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "dist/client/index.html"));
});

// app.get("*", (req, res) => res.send("Hello World !"));

app.listen(8000, () => console.log("Listening on port 8000!"));
