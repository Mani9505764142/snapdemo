# SnapDemo 🎥

SnapDemo is a lightweight screen recording and sharing app built with Next.js and AWS.  
Users can record their screen, optionally trim the recording, upload it, and share a link with view analytics.

---

## 🚀 Features

- 🎥 Screen recording in the browser
- ✂️ Trim recordings before upload
- ☁️ Upload videos to AWS S3
- 🔗 Shareable video links
- 📊 View & completion analytics (DynamoDB)
- ⚡ Serverless backend using Next.js App Router

---

## 🧠 How It Works (Important)

### Normal User Flow
1. Record screen
2. Trim video (optional)
3. Upload video
4. Get a unique share link
5. Views increment when the share page is opened

Each upload creates:
- A **new S3 object**
- A **new DynamoDB analytics row**
- Views start from **0**

---

### Demo Video (Static)
The **demo video** shown on the Home page is **static**.

- It always plays the same sample video
- Its analytics do not represent new uploads
- It exists only to preview the experience

👉 **Do not use the demo video to test analytics.**

---

## 📊 Analytics Logic

- View count increments **once per page load**
- Completion count increments when the video finishes playing
- Analytics are stored in DynamoDB using atomic updates

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript

**Backend / Cloud**
- AWS S3 (video storage)
- AWS DynamoDB (analytics)
- AWS SDK v3
- Serverless API routes

---

## ⚠️ Notes & Limitations

- Video trimming uses `MediaRecorder` + `captureStream`
- Trimming duration is time-based for reliability
- Demo analytics are static by design

---

## 📌 Future Improvements

- Show live analytics on Share page
- Replace demo with latest upload
- User authentication
- Video deletion & management

---

## 📄 License

MIT
