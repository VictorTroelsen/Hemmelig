const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.static(__dirname))

app.use(cookieParser());

const affirmations = [
    "Glæder mig til at se dig tomorrow C.",
    "Har lidt savnet dit smil.",
    "Håber det bliver en overskuelig vagt i scroll.",
    "Please ik grin af min grimme julesweater",
    "Tæver dig i beerpong hvis der er borde."
];

app.get('/', (req, res) => {
    res.redirect('/api/affirmation');
});

    // If cookie exists, use it
    if (req.cookies.seenAffirmations) {
        seen = JSON.parse(req.cookies.seenAffirmations);
    }

    // Compute the remaining ones
    const remaining = affirmations.filter(a => !seen.includes(a));

    // If none remaining, reset
    if (remaining.length === 0) {
        seen = [];
    }

    const remainingAfterReset = affirmations.filter(a => !seen.includes(a));

    // Pick a random one from the remaining pool
    const random = remainingAfterReset[Math.floor(Math.random() * remainingAfterReset.length)];

    // Add to seen and update cookie
    const newSeen = [...seen, random];
    res.cookie("seenAffirmations", JSON.stringify(newSeen), {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: false                  // allow browser access if needed
    });

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Affirmation</title>
<style>
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/christmas.jpg');
    background-size: cover;
    background-color: black;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    font-family: "Poppins", sans-serif;
    position: relative;
  }
  
  .card {
    padding: 30px 50px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    text-align: center;
    color: #fff;
    font-size: 2rem;
    text-shadow: 0 0 10px #ffdddd, 0 0 20px #ff8888;
    box-shadow: 0 0 10px #ff4444, 0 0 25px #ff0000;
    animation: glow 2s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 10px #ff4444, 0 0 30px #ff7777, 0 0 50px #ff0000;
    }
    to {
      box-shadow: 0 0 20px #ff6666, 0 0 40px #ff3333, 0 0 60px #ff1111;
    }
  }
</style>
</head>

<body>
  <div class="card">${random}</div>
</body>
</html>
`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Affirmation engine online"));