import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

const Container = styled.div`
  max-width: 640px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4a5568;
`;

const Input = styled.input`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const TextArea = styled.textarea`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #4299e1;
  color: white;
  font-weight: bold;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #3182ce;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const AddBudget = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [transactions, setTransactions] = useState([]);

  const validateForm = () => {
    const errors = {};
    if (!amount) errors.amount = "Amount is required.";
    if (!description) errors.description = "Description is required.";
    if (!date) errors.date = "Date is required.";
    if (!category) errors.category = "Category is required.";
    if (!paymentMethod) errors.paymentMethod = "Payment Method is required.";
    if (!status) errors.status = "Status is required.";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newFinancialEntry = {
      amount: Number(amount),
      description,
      date,
      category,
      paymentMethod,
      notes,
      status,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/budgetEntry",
        newFinancialEntry
      );
      if (response.status === 201) {
        toast.success("Budget entry created successfully!");
        setTransactions([...transactions, newFinancialEntry]);
        resetForm();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create financial entry.");
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setDate("");
    setCategory("");
    setPaymentMethod("");
    setNotes("");
    setStatus("");
    setValidationErrors({});
  };

  return (
    <>
      <Container>
        <Title>Create Budget Entry</Title>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount:
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
            {validationErrors.amount && (
              <ErrorMessage>{validationErrors.amount}</ErrorMessage>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {validationErrors.description && (
              <ErrorMessage>{validationErrors.description}</ErrorMessage>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date:
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {validationErrors.date && (
              <ErrorMessage>{validationErrors.date}</ErrorMessage>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Housing">Housing</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transport">Transport</option>
              <option value="Savings">Savings</option>
              <option value="Other">Other</option>
            </Select>

            {validationErrors.category && (
              <ErrorMessage>{validationErrors.category}</ErrorMessage>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status:
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select a status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </Select>

            {validationErrors.status && (
              <ErrorMessage>{validationErrors.status}</ErrorMessage>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method:
            </label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select a payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
            {validationErrors.paymentMethod && (
              <ErrorMessage>{validationErrors.paymentMethod}</ErrorMessage>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Container>
    </>
  );
};
