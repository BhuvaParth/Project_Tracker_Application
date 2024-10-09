import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: #1a202c; /* Dark background matching the dashboard */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.2); /* Add bottom shadow */
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: white; /* Change brand text color to white for better contrast */
`;

const NavLink = styled(Link)`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: medium;
  color: white; /* Change link text color to white for better contrast */
  border-radius: 0.375rem;
  text-decoration: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2); /* Lighter hover effect */
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavContent>
        <NavFlex>
          <Brand to="/">Tracker</Brand>
          <div className="flex flex-1 items-center justify-end">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <NavLink to="/addbudget">Add Budget</NavLink>
              </div>
            </div>
          </div>
        </NavFlex>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
