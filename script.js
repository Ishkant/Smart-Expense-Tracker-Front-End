let editingId = null; // Track current editing record

// When the form is submitted
document.getElementById("expenseForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page from reloading

  // Get form values
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  const expense = { title, amount, category, date, description };

  const method = editingId ? "PUT" : "POST";
  const url = editingId
    ? `http://localhost:8080/expenses/${editingId}`
    : "http://localhost:8080/expenses";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  })
    .then(response => response.json())
    .then(data => {
      console.log(editingId ? "Updated:" : "Saved:", data);
      loadExpenses(); // Refresh table
      document.getElementById("expenseForm").reset(); // Clear form
      editingId = null; // Reset to add mode
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to save/update expense.");
    });
});

// Load all expenses from backend
function loadExpenses() {
  fetch("http://localhost:8080/expenses")
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector("#expenseTable tbody");
      table.innerHTML = ""; // Clear table
      let total = 0;

      data.forEach(exp => {
        total += parseFloat(exp.amount);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${exp.title}</td>
          <td>₹${exp.amount}</td>
          <td>${exp.category}</td>
          <td>${exp.date}</td>
          <td>${exp.description}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editExpense(${exp.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">Delete</button>
          </td>
        `;
        table.appendChild(row);
      });

      // Show total amount
      document.getElementById("total").innerText = `Total: ₹${total.toFixed(2)}`;
    });
}

// Delete an expense by ID
function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    fetch(`http://localhost:8080/expenses/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        alert("Deleted successfully");
        loadExpenses(); // Refresh table
      })
      .catch(error => {
        console.error("Delete failed:", error);
        alert("Failed to delete expense.");
      });
  }
}

// Edit an expense by ID
function editExpense(id) {
  fetch(`http://localhost:8080/expenses/${id}`)
    .then(res => res.json())
    .then(exp => {
      document.getElementById("title").value = exp.title;
      document.getElementById("amount").value = exp.amount;
      document.getElementById("category").value = exp.category;
      document.getElementById("date").value = exp.date;
      document.getElementById("description").value = exp.description;
      editingId = exp.id; // Switch to update mode
    });
}

// Load expenses on page load
window.onload = loadExpenses;
