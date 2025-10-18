var express = require('express');
var router = express.Router();
var exe = require('../connection');
var path = require('path');

// Render Home Page
router.use(express.static(path.join(__dirname, 'public')));



router.get('/', function (req, res) {
  res.render('home.ejs');
});


router.get('/wonner', function (req, res) {
  res.render('wonner.ejs');
});

// Render Billing Page
router.get('/billing_page', function (req, res) {
  res.render("billing_page.ejs");
});

// router.post("/billing_system", async function (req, res)  {
//   const {
//     action,
//     customer_name,
//     mobile,
//     product,
//     size,
//     quantity,
//     price_per_unit,
//     amount,
//     discount_percent,
//     discount_amount,
//     Total_after_Discount
//   } = req.body;

//   try {
//     // Data should be arrays — even for single product
//     const products = Array.isArray(product) ? product : [product];
//     const sizes = Array.isArray(size) ? size : [size];
//     const quantities = Array.isArray(quantity) ? quantity : [quantity];
//     const prices = Array.isArray(price_per_unit) ? price_per_unit : [price_per_unit];
//     const amounts = Array.isArray(amount) ? amount : [amount];
//     const discounts = Array.isArray(discount_percent) ? discount_percent : [discount_percent];
//     const discountAmounts = Array.isArray(discount_amount) ? discount_amount : [discount_amount];
//     const totals = Array.isArray(Total_after_Discount) ? Total_after_Discount : [Total_after_Discount];

//     let lastInsertId = null;

//     for (let i = 0; i < products.length; i++) {
//       // Skip if product or quantity is missing
//       if (!products[i] || !quantities[i]) continue;

//       const sql = `
//         INSERT INTO bill 
//         (customer_name, mobile, product, size, quantity, price_per_unit, amount, discount_percent, discount_amount, Total_after_Discount)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       const result = await exe(sql, [
//         customer_name,
//         mobile,
//         products[i],
//         sizes[i],
//         quantities[i],
//         prices[i],
//         amounts[i],
//         discounts[i],
//         discountAmounts[i],
//         totals[i]
//       ]);

//       lastInsertId = result.insertId; // Save for redirect
//     }

//     if (lastInsertId) {
//       res.redirect(`/bill_print/${lastInsertId}`);
//     } else {
//       res.send("No valid product rows submitted.");
//     }

//   } catch (err) {
//     console.error("Insert Error:", err);
//     res.status(500).send("Database Insert Failed");
//   }
// });


// POST billing form


// router.post("/billing_system", async function (req, res) {
//   const {
//     action,
//     customer_name,
//     mobile,
//     product,
//     size,
//     quantity,
//     price_per_unit,
//     amount,
//     discount_percent,
//     discount_amount,
//     Total_after_Discount
//   } = req.body;

//   try {
//     const products = Array.isArray(product) ? product : [product];
//     const quantities = Array.isArray(quantity) ? quantity : [quantity];
//     const sizes = Array.isArray(size) ? size : [size];
//     const prices = Array.isArray(price_per_unit) ? price_per_unit : [price_per_unit];
//     const amounts = Array.isArray(amount) ? amount : [amount];
//     const discounts = Array.isArray(discount_percent) ? discount_percent : [discount_percent];
//     const discountAmounts = Array.isArray(discount_amount) ? discount_amount : [discount_amount];
//     const totals = Array.isArray(Total_after_Discount) ? Total_after_Discount : [Total_after_Discount];

//     let lastInsertId = null;

//     for (let i = 0; i < products.length; i++) {
//       if (!products[i] || !quantities[i]) continue;

//       // Insert into bill
//       const sql = `
//         INSERT INTO bill
//         (customer_name, mobile, product, size, quantity, price_per_unit, amount, discount_percent, discount_amount, Total_after_Discount)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       const result = await exe(sql, [
//         customer_name,
//         mobile,
//         products[i],
//         sizes[i],
//         quantities[i],
//         prices[i],
//         amounts[i],
//         discounts[i],
//         discountAmounts[i],
//         totals[i]
//       ]);

//       lastInsertId = result.insertId;

//       // Update stock
//       const stockCheck = await exe("SELECT quantity FROM stock WHERE productName = ?", [products[i]]);
//       if (stockCheck.length > 0) {
//         let currentQty = parseInt(stockCheck[0].quantity);
//         let soldQty = parseInt(quantities[i]);
//         let newQty = Math.max(currentQty - soldQty, 0);

//         await exe("UPDATE stock SET quantity = ? WHERE productName = ?", [newQty, products[i]]);
//       }
//     }

//     if (lastInsertId) {
//       res.redirect(`/bill_print/${lastInsertId}`);
//     } else {
//       res.send("No valid product rows submitted.");
//     }
//   } catch (err) {
//     console.error("Billing Error:", err);
//     res.status(500).send("Database Insert Failed");
//   }
// });


// Add stock

// ==================== Billing System POST ====================
router.post("/billing_system", async function (req, res) {
  const {
    action,
    customer_name,
    mobile,
    product,
    size,
    quantity,
    price_per_unit,
    amount,
    discount_percent,
    discount_amount,
    Total_after_Discount
  } = req.body;

  try {
    const products = Array.isArray(product) ? product : [product];
    const quantities = Array.isArray(quantity) ? quantity : [quantity];
    const sizes = Array.isArray(size) ? size : [size];
    const prices = Array.isArray(price_per_unit) ? price_per_unit : [price_per_unit];
    const amounts = Array.isArray(amount) ? amount : [amount];
    const discounts = Array.isArray(discount_percent) ? discount_percent : [discount_percent];
    const discountAmounts = Array.isArray(discount_amount) ? discount_amount : [discount_amount];
    const totals = Array.isArray(Total_after_Discount) ? Total_after_Discount : [Total_after_Discount];

    let lastInsertId = null;

    for (let i = 0; i < products.length; i++) {
      if (!products[i] || !quantities[i]) continue;

      // Insert into bill with billing_date + billing_time auto set
      const sql = `
        INSERT INTO bill
        (customer_name, mobile, product, size, quantity, price_per_unit, amount, discount_percent, discount_amount, Total_after_Discount, billing_date, billing_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW())
      `;
      const result = await exe(sql, [
        customer_name,
        mobile,
        products[i],
        sizes[i],
        quantities[i],
        prices[i],
        amounts[i],
        discounts[i],
        discountAmounts[i],
        totals[i]
      ]);

      lastInsertId = result.insertId;

      // Update stock
      const stockCheck = await exe("SELECT quantity FROM stock WHERE productName = ?", [products[i]]);
      if (stockCheck.length > 0) {
        let currentQty = parseInt(stockCheck[0].quantity);
        let soldQty = parseInt(quantities[i]);
        let newQty = Math.max(currentQty - soldQty, 0);

        await exe("UPDATE stock SET quantity = ? WHERE productName = ?", [newQty, products[i]]);
      }
    }

    if (lastInsertId) {
      res.redirect(`/bill_print/${lastInsertId}`);
    } else {
      res.send("No valid product rows submitted.");
    }
  } catch (err) {
    console.error("Billing Error:", err);
    res.status(500).send("Database Insert Failed");
  }
});

// ==================== Fetch Today's Bills by Mobile ====================
// Fetch today's bill by mobile
router.get("/fetch_bill/:mobile", async (req, res) => {
  try {
    const mobile = req.params.mobile;

    const sql = `
      SELECT * FROM bill 
      WHERE mobile = ? 
      AND billing_date = CURDATE()
    `;
    const bills = await exe(sql, [mobile]);

    if (bills.length > 0) {
      res.json(bills); // 👉 JSON response देतोय
    } else {
      res.status(404).send("No bills found for today.");
    }
  } catch (err) {
    console.error("Error fetching bill:", err);
    res.status(500).send("Error fetching bill");
  }
});
router.get("/bill_print/:id", async function (req, res) {
  const billId = req.params.id;

  try {
    // STEP 1: Get the bill using id
    const one = await exe("SELECT * FROM bill WHERE id = ?", [billId]);

    if (!one || one.length === 0) return res.send("Bill not found");

    const mobile = one[0].mobile;

    // STEP 2: Fetch only today's entries for that mobile
    const all = await exe(
      "SELECT * FROM bill WHERE mobile = ? AND billing_date = CURDATE() ORDER BY id ASC",
      [mobile]
    );

    res.render("bill_print.ejs", { data: all, customer: one[0] });
  } catch (err) {
    console.error("Error fetching bill:", err);
    res.status(500).send("Error loading bill");
  }
});





router.get("/stock", async (req, res) => {
  try {
    let stockItems = await exe("SELECT * FROM stock");
    res.render("stock", { stockItems, error: null });
  } catch (err) {
    res.render("stock", { stockItems: [], error: "Error fetching stock" });
  }
});

// Add stock
router.post("/stock/add", async (req, res) => {
  let { productName, quantity } = req.body;

  try {
    // आधी product आहे का तपासा
    let existing = await exe("SELECT * FROM stock WHERE productName = ?", [
      productName,
    ]);

    if (existing.length > 0) {
      // जर असेल तर quantity update करा
      let newQty = parseInt(existing[0].quantity) + parseInt(quantity);
      await exe("UPDATE stock SET quantity=? WHERE productName=?", [
        newQty,
        productName,
      ]);
    } else {
      // नाहीतर नवीन row insert करा
      await exe(
        "INSERT INTO stock (productName, quantity) VALUES (?, ?)",
        [productName, quantity]
      );
    }

    // नवीन stock list fetch करा
    let stockItems = await exe("SELECT * FROM stock");
    res.render("stock", { stockItems, error: null });
  } catch (err) {
    console.log("Error adding stock:", err);
    let stockItems = await exe("SELECT * FROM stock");
    res.render("stock", { stockItems, error: "Error adding stock" });
  }
});

router.post("/stock/delete", async (req, res) => {
  const { id } = req.body;
  try {
      await exe("DELETE FROM stock WHERE id = ?", [id]);
      res.redirect("/stock");
  } catch (err) {
      console.error("Stock Delete Error:", err);
      res.redirect("/stock");
  }
});

router.post("/stock/update", async (req, res) => {
  const { id, productName, quantity } = req.body;
  try {
    await exe("UPDATE stock SET productName = ?, quantity = ? WHERE id = ?", [productName, quantity, id]);
      res.redirect("/stock");
  } catch (err) {
      console.error("Stock Update Error:", err);
      res.redirect("/stock");
  }
});



router.get("/customer_list", async function (req, res) {
  try {
    let data = await exe("SELECT * FROM bill ORDER BY billing_date DESC, billing_time DESC");
    res.render("customer_list.ejs", { bills: data }); // ✅ pass 'bills' to EJS
  } catch (err) {
    console.log(err);
    res.send("Error loading customer list");
  }
});


router.get('/today', async (req, res) => {
  try {
    // --- Today's Revenue from bill ---
    let totalTodayData = await exe(`
          SELECT SUM(Total_after_Discount) AS totalToday
          FROM bill
          WHERE DATE(billing_date) = CURDATE()
      `);
    let totalToday = totalTodayData[0].totalToday || 0;

    // --- Today's Customers from bill ---
    let customersTodayData = await exe(`
          SELECT COUNT(DISTINCT customer_name) AS customersToday
          FROM bill
          WHERE DATE(billing_date) = CURDATE()
      `);
    let customersToday = customersTodayData[0].customersToday || 0;

    // --- Today's Lend from lent ---
    let lentTodayData = await exe(`
          SELECT SUM(Total) AS lentToday
          FROM lent
          WHERE DATE(created_at) = CURDATE()
      `);
    let lentToday = lentTodayData[0].lentToday || 0;

    // --- Total Pending Payments from lent ---
    let lentTotalData = await exe(`
          SELECT SUM(Total) AS lentTotal
          FROM lent
      `);
    let lentTotal = lentTotalData[0].lentTotal || 0;

    // ✅ Render page with all stats
    res.render('today.ejs', {
      totalToday,
      customersToday,
      lentToday,
      lentTotal
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


router.get("/delete_bill/:id", async function (req, res) {
  var b_id = req.params.id;
  var sql = `DELETE FROM bill WHERE id='${b_id}'`;
  var result = await exe(sql);
  // res.send(result);
  res.redirect("/customer_list");
});

// Route to edit a bill (GET: show form)
router.get("/edit_bill/:id", async function (req, res) {
  var b_id = req.params.id;
  var sql = `SELECT * FROM bill WHERE id = ?`;
  var bills = await exe(sql, [b_id]);
  if (bills.length === 0) {
    return res.status(404).send("Bill not found");
  }
  res.render("edit_bill.ejs", { bill: bills[0] });
});

// Route to update a bill (POST: handle form submission)
router.post("/edit_bill/:id", async function (req, res) {
  var b_id = req.params.id;
  var {
    customer_name,
    product,
    size,
    quantity,
    price_per_unit,
    amount,
    discount_percent,
    discount_amount,
    Total_after_Discount
  } = req.body;

  var sql = `UPDATE bill SET 
    customer_name = ?, 
    product = ?, 
    size = ?, 
    quantity = ?, 
    price_per_unit = ?, 
    amount = ?, 
    discount_percent = ?, 
    discount_amount = ?, 
    Total_after_Discount = ?
    WHERE id = ?`;

  await exe(sql, [
    customer_name,
    product,
    size,
    quantity,
    price_per_unit,
    amount,
    discount_percent,
    discount_amount,
    Total_after_Discount,
    b_id
  ]);
  res.redirect("/customer_list");
});


router.post('/lent_customer', async (req, res) => {
  const {
    customer_name,
    mobile,
    Total,
  } = req.body;

  const sql = `INSERT INTO lent 
    (customer_name, mobile, Total) 
    VALUES (?, ?, ?)`;

  await exe(sql, [customer_name, mobile, Total]);

  res.redirect('/lent_customer');
});



// lent list
router.get('/lent_customer', async function (req, res) {
  try {
    const lentBills = await exe("SELECT * FROM lent");
    // Helper functions to format values
    const formatRupee = (val) => "₹" + parseFloat(val || 0).toFixed(2);
    const formatDate = (val) => {
      const d = new Date(val);
      return {
        date: d.toLocaleDateString('en-IN'),
        time: d.toLocaleTimeString('en-IN')
      };
    };

    res.render('lent_customer.ejs', {
      lentBills,
      formatRupee,
      formatDate
    });
  } catch (err) {
    console.error("Error fetching lent bills:", err);
    res.render('lent_customer.ejs', {
      lentBills: [],
      formatRupee: () => "₹0.00",
      formatDate: () => ({ date: "-", time: "-" })
    });
  }
});



// 📌 Show Lent Customers Page
router.get("/lent_customer", async function (req, res) {
  try {
    const bills = await exe("SELECT * FROM lent ORDER BY id DESC");
    res.render("lent_customer.ejs", { bills });
  } catch (err) {
    console.error("Error fetching lent customers:", err);
    res.render("lent_customer.ejs", { bills: [] });
  }
});

// 📌 Add new lent customer
router.post("/lent_customer/add", async function (req, res) {
  const { customer_name, mobile, Total } = req.body;
  try {
    await exe(
      "INSERT INTO lent (customer_name, mobile, Total) VALUES (?, ?, ?)",
      [customer_name, mobile, Total]
    );
    res.redirect("/lent_customer");
  } catch (err) {
    console.error("Error adding lent customer:", err);
    res.redirect("/lent_customer");
  }
});

// Edit customer (POST)
router.post('/lent_customer/edit', async function (req, res) {
  const { id, customer_name, mobile, Total } = req.body;
  try {
    await exe(
      "UPDATE lent SET customer_name = ?, mobile = ?, Total = ? WHERE id = ?",
      [customer_name, mobile, Total, id]
    );
    res.redirect('/lent_customer');
  } catch (err) {
    console.error("Error updating lent customer:", err);
    res.redirect('/lent_customer');
  }
});


// Delete customer (POST)
router.post('/lent_customer/delete', async function (req, res) {
  const { id } = req.body;
  try {
    await exe("DELETE FROM lent WHERE id = ?", [id]);
    res.redirect('/lent_customer');
  } catch (err) {
    console.error("Error deleting lent customer:", err);
    res.redirect('/lent_customer');
  }
});


module.exports = router;
