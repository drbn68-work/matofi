import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/orders", async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res
        .status(400)
        .json({ success: false, message: "Missing department" });
    }

    // Extract the numeric code from the department (the part before '-')
    const splittedDept = department.split("-")[0].trim();

    // Perform a LEFT JOIN to get both the order header and its items.
    const result = await pool.query(
      `
      SELECT
        o.id,
        o.cost_center,
        o.full_name,
        o.department,
        o.email,
        o.delivery_location,
        o.comments,
        o.created_at,

        oi.id AS item_id,
        oi.codsap,
        oi.descripcion,
        oi.codas400,
        oi.ubicacion,
        oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE split_part(o.department, '-', 1) = $1
      ORDER BY o.created_at DESC
      `,
      [splittedDept]
    );

    const rows = result.rows;

    // Group the rows by order ID so that each order has its array of items.
    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          cost_center: row.cost_center,
          full_name: row.full_name,
          department: row.department,
          email: row.email,
          delivery_location: row.delivery_location,
          comments: row.comments,
          created_at: row.created_at,
          items: [],
        };
      }
      // If there's an item (could be NULL if the order has no items)
      if (row.item_id) {
        ordersMap[row.id].items.push({
          id: row.item_id,
          codsap: row.codsap,
          descripcion: row.descripcion,
          codas400: row.codas400,
          ubicacion: row.ubicacion,
          quantity: row.quantity,
        });
      }
    });

    // Convert the map into an array of orders
    const ordersArray = Object.values(ordersMap);

    return res.json({ success: true, orders: ordersArray });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error listing orders" });
  }
});

export default router;
