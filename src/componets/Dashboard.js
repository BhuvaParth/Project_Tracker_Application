import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement 
);

const Container = styled.div`
  max-width: 800px;
  margin: 1.5rem auto;
  padding: 1rem;
`;

const TitleText = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5568;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const TotalSpending = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
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

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  background-color: #edf2f7;
  text-align: left;
  font-weight: bold;
  color: #4a5568;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f7fafc;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
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

  &.edit {
    background-color: #4299e1;
    &:hover {
      background-color: #3182ce;
    }
  }

  &.delete {
    background-color: #e53e3e;
    &:hover {
      background-color: #c53030;
    }
  }

  &.toggle {
    background-color: ${(props) => (props.$isPending ? "#3182ce" : "#48bb78")};
    &:hover {
      background-color: ${(props) =>
        props.$isPending ? "#2b6cb0" : "#38a169"};
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/budgetEntry");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (transaction) => {
    navigate("/editfinacialform", { state: { transaction } });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/budgetEntry/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleTogglePending = async (id) => {
    try {
      const transaction = transactions.find((t) => t.id === id);
      const updatedTransaction = {
        ...transaction,
        status: transaction.status === "Pending" ? "Completed" : "Pending",
      };

      await axios.put(
        `http://localhost:3000/budgetEntry/${id}`,
        updatedTransaction
      );
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
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

  const totalSpending = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const categories = [...new Set(filteredTransactions.map((t) => t.category))];
  const categoryData = categories.map((category) =>
    filteredTransactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // const pieData = {
  //   labels: categories,
  //   datasets: [
  //     {
  //       label: "Spending by Category",
  //       data: categoryData,
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.6)",
  //         "rgba(54, 162, 235, 0.6)",
  //         "rgba(255, 206, 86, 0.6)",
  //         "rgba(75, 192, 192, 0.6)",
  //         "rgba(153, 102, 255, 0.6)",
  //         "rgba(255, 159, 64, 0.6)",
  //       ],
  //     },
  //   ],
  // };

  // const pieOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     title: {
  //       display: true,
  //       text: "Spending by Category",
  //     },
  //   },
  // };

  const BarChart = () => {
    const data = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: [
        {
          label: "Apples",
          data: [12, 19, 3, 17, 28, 24, 7],
          backgroundColor: "rgba(153, 255, 51, 1)",
        },
        {
          label: "Oranges",
          data: [30, 29, 5, 5, 20, 3, 10],
          backgroundColor: "rgba(255, 153, 0, 1)",
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
          text: "Fruit Sales per Day",
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <>
      <Container>
        <TitleText>Transactions List</TitleText>

        <TotalSpending>
          Total Spending: ${totalSpending.toFixed(2)}
        </TotalSpending>

        <ChartContainer>
        <BarChart />
      </ChartContainer>

      {/* <ChartContainer>
        <Pie data={pieData} options={pieOptions} />
      </ChartContainer> */}

        <div>
          <label
            htmlFor="search"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Search transactions by title, amount, date, category, or status:
          </label>
          <SearchInput
            id="search"
            type="text"
            placeholder="Enter search term..."
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
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan="6"
                  style={{ textAlign: "center", color: "#4A5568" }}
                >
                  No transactions available.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <ActionButton
                      className="toggle"
                      $isPending={transaction.status === "Pending"}
                      onClick={() => handleTogglePending(transaction.id)}
                    >
                      {transaction.status === "Pending"
                        ? "Complete"
                        : "Pending"}
                    </ActionButton>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <ActionButton
                      className="edit"
                      onClick={() => handleEditClick(transaction)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={() => handleDeleteClick(transaction.id)}
                    >
                      Delete
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Dashboard;
