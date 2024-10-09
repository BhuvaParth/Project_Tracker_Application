import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 1.5rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #4a5568;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;
  background-color: #f7fafc;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const EditBudget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction } = location.state || {};

  const [amount, setAmount] = useState(transaction.amount);
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [status, setStatus] = useState(transaction.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTransaction = {
      amount,
      date,
      description,
      category,
      status,
    };


    const existingEntries =
      JSON.parse(localStorage.getItem("budgetEntries")) || [];
    const updatedEntries = existingEntries.map((entry) =>
      entry.id === transaction.id ? { ...entry, ...updatedTransaction } : entry
    );
    localStorage.setItem("budgetEntries", JSON.stringify(updatedEntries));

    toast.success("Transaction updated successfully!");
    navigate(`/`, {
      state: { transaction: { ...transaction, ...updatedTransaction } },
    });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    const existingEntries =
      JSON.parse(localStorage.getItem("budgetEntries")) || [];
    const updatedEntries = existingEntries.filter(
      (entry) => entry.id !== transaction.id
    );
    localStorage.setItem("budgetEntries", JSON.stringify(updatedEntries));

    toast.success("Transaction deleted successfully!");
    navigate(`/`);
  };

  return (
    <Container>
      <Title>Edit Budget</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="amount">Amount:</Label>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">Category:</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transport">Transport</option>
            <option value="Savings">Savings</option>
            <option value="Other">Other</option>
          </Select>

        </div>
        <div>
          <Label htmlFor="status">Status:</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select a status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>
        <Button type="submit">Update Transaction</Button>
        <Button
          type="button"
          onClick={handleDelete}
          style={{ backgroundColor: "#e53e3e" }}
        >
          Delete Transaction
        </Button>
      </Form>
    </Container>
  );
};

export default EditBudget;
