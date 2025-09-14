require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- Routes ---

// 1. Update & get streak
app.post("/api/user/:id/streak", async (req, res) => {
  const userId = req.params.id;

  try {
    const userRes = await pool.query("SELECT streak_count, last_activity, reward_points FROM users WHERE id=$1", [userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = userRes.rows[0];
    const today = new Date();
    const lastDate = user.last_activity ? new Date(user.last_activity) : null;

    let streak_count = user.streak_count;
    let reward_points = user.reward_points;

    if (!lastDate || (today - lastDate) / (1000 * 60 * 60 * 24) === 1) {
      // consecutive day
      streak_count++;
      reward_points += 10; // 10 points per day
    } else if ((today - lastDate) / (1000 * 60 * 60 * 24) > 1) {
      streak_count = 1;
      reward_points += 5;
    }

    await pool.query("UPDATE users SET streak_count=$1, last_activity=$2, reward_points=$3 WHERE id=$4",
      [streak_count, today, reward_points, userId]);

    res.json({ streak_count, reward_points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Add inventory item
app.post("/api/inventory", async (req, res) => {
  const { user_id, item_name, quantity, qty_type, expiry } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO inventory(user_id, item_name, quantity, qty_type, expiry) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [user_id, item_name, quantity, qty_type, expiry]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Remove inventory item
app.delete("/api/inventory/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM inventory WHERE id=$1", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 4. Add wastage
app.post("/api/wastage", async (req, res) => {
  const { user_id, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO wastage(user_id, quantity) VALUES($1,$2) RETURNING *",
      [user_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 5. Upload avatar
app.post("/api/avatar", async (req, res) => {
  const { user_id, avatar_base64 } = req.body;
  try {
    await pool.query("UPDATE users SET avatar=$1 WHERE id=$2", [avatar_base64, user_id]);
    res.json({ message: "Avatar updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
