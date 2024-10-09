import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from "chart.js";
import styled from "styled-components";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 1rem;
  background-color: #1a202c; 
  color: #cbd5e0; 
  border-radius: 0.375rem;
`;

const TitleText = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #edf2f7;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const TotalSpending = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #edf2f7;
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  color: #4a5568;
  background-color: #edf2f7;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #2d3748; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
  overflow-x: auto; 
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  background-color: #4a5568; 
  text-align: left;
  font-weight: bold;
  color: #edf2f7;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #4a5568; 
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #edf2f7; 
  font-size: 0.9rem;

  &:last-child {
    display: flex;
    gap: 0.5rem; 
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  background-color: ${(props) =>
    props.bgColor || "#48bb78"}; 

  &:hover {
    opacity: 0.9; 
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = () => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("budgetEntries")) || [];
    setTransactions(storedTransactions);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (transaction) => {
    navigate("/editbudget", { state: { transaction } });
  };

  const handleDeleteClick = (transactionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    const updatedTransactions = transactions.filter(
      (t) => t.id !== transactionId
    );
    localStorage.setItem("budgetEntries", JSON.stringify(updatedTransactions));
    fetchTransactions();
  };

  const handleTogglePending = (transactionId) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          status: transaction.status === "Pending" ? "Completed" : "Pending",
        };
      }
      return transaction;
    });

    localStorage.setItem("budgetEntries", JSON.stringify(updatedTransactions));
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      (transaction.title &&
        transaction.title.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.amount &&
        transaction.amount.toString().includes(lowerCaseTerm)) ||
      (transaction.date &&
        transaction.date.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.category &&
        transaction.category.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.status &&
        transaction.status.toLowerCase().includes(lowerCaseTerm))
    );
  });

  const totalSpending = filteredTransactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const BarChart = ({ filteredTransactions }) => {
    const categoryAmounts = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(categoryAmounts);
    const dataValues = Object.values(categoryAmounts);

    const data = {
      labels,
      datasets: [
        {
          label: "Total Amount by Category",
          data: dataValues,
          backgroundColor: "rgba(75, 192, 192, 1)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Spending by Category",
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <Container>
      <TitleText>Budget List</TitleText>

      <TotalSpending>Total Spending: ${totalSpending.toFixed(2)}</TotalSpending>

      <ChartContainer>
        <BarChart filteredTransactions={filteredTransactions} />
      </ChartContainer>

      <div>
        <label
          htmlFor="search"
          style={{ display: "block", marginBottom: "0.5rem", color: "#edf2f7" }}
        >
          Search here
        </label>
        <SearchInput
          id="search"
          type="text"
          placeholder="Search by Amount and Category here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <thead>
          <tr>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={`${transaction.id}-${transaction.date}`}>
              <TableCell>
                ${" "}
                {isNaN(transaction.amount)
                  ? "0.00"
                  : parseFloat(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>
                <ActionButton
                  className="toggle"
                  bgColor={
                    transaction.status === "Pending" ? "#3182ce" : "#48bb78"
                  } 
                  onClick={() => handleTogglePending(transaction.id)}
                >
                  {transaction.status === "Pending" ? "Complete" : "Pending"}
                </ActionButton>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <ActionButton
                  className="edit"
                  bgColor="#3182ce" 
                  onClick={() => handleEditClick(transaction)}
                >
                  Edit
                </ActionButton>
                <ActionButton
                  className="delete"
                  bgColor="#e53e3e" 
                  onClick={() => handleDeleteClick(transaction.id)}
                >
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;
