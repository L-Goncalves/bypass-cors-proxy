import axios from "axios";
import express from "express";
import multer from "multer";
import { imageProxyValidation, proxyValidation } from "./validation";

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 }});
// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json({ limit: "50mb"}));

// Define your proxy route(s) here
app.post(
  "/image",
  async (req, res) => {
    try {
      const { error } = imageProxyValidation.validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const headers = JSON.parse(req.body.headers);
      const buffer = Buffer.from(req.body.image, "base64");
      const blobImage = new Blob([buffer], { type: "image/png" });

      const formData = new FormData();
      formData.append("image", blobImage, "image.png");

      const response = await axios.post(req.body.url, formData, {
        headers: {
          ...headers,
        },
      });

      res.json({ ...response.data });
    } catch (error: any) {
      res.status(error.response.status).json(error.message);
    }
  }
);


app.post("/", async (req, res) => {
  const { error } = proxyValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const reqBody = req.body;
  const { body, url, headers } = reqBody;

  try {
    const response = await axios.post(url, body, {
      headers,
    });

    res.json({ ...response.data });
  } catch (error: any) {
    if(error?.response?.data){
      res.json(error?.response?.data);
    } else{
      res.json(error.message);
    }
  }
});

app.put("/", async (req, res) => {
  const { error } = proxyValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const reqBody = req.body;
  const { body, url, headers } = reqBody;

  try {
    const response = await axios.put(url, body, {
      headers,
    });

    res.json({ ...response.data });
  } catch (error: any) {
    res.json(error.message);
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
