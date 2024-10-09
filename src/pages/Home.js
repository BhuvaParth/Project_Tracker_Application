import React from "react";
import Dashboard from "../componets/Dashboard";
import styled from "styled-components";

const HomeContainer = styled.div`
  background-color: #1a202c; 
  min-height: 100vh;
  color: #cbd5e0; 
  padding: 1rem;
`;

export default function Home() {
  return (
    <HomeContainer>
      <Dashboard />
    </HomeContainer>
  );
}
