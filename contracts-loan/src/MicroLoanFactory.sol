// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../contracts/lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "./MicroLoan.sol";

/**
 * @title MicroLoanFactory
 * @notice Deploys zero-interest MicroLoan contracts and tracks them. Enforces simple policy bounds.
 */
contract MicroLoanFactory is Ownable {

    // --------------------
    // Events
    // --------------------
    event LoanCreated(address indexed loan, address indexed borrower, uint256 principal, uint256 termPeriods);

    // --------------------
    // Config & Policy bounds
    // --------------------
    address public immutable usdc;              // single funding token for all loans
    uint256 public minTermPeriods = 3;
    uint256 public maxTermPeriods = 60;
    uint256 public minPeriodLength = 7 days;     // weekly minimum
    uint256 public maxPeriodLength = 60 days;    // bi-monthly maximum

    address[] public loans;
    mapping(address => address[]) public borrowerLoans;

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "usdc=0");
        usdc = _usdc;
    }

    function setBounds(
        uint256 _minTerm,
        uint256 _maxTerm,
        uint256 _minPeriodLen,
        uint256 _maxPeriodLen
    ) external onlyOwner {
        require(_minTerm > 0 && _minTerm <= _maxTerm, "term bounds");
        require(_minPeriodLen > 0 && _minPeriodLen <= _maxPeriodLen, "period bounds");
        minTermPeriods = _minTerm;
        maxTermPeriods = _maxTerm;
        minPeriodLength = _minPeriodLen;
        maxPeriodLength = _maxPeriodLen;
    }

    function createLoan(
        address borrower,
        string calldata metadataURI,
        uint256 principal,
        uint256 termPeriods,
        uint256 periodLength,
        uint256 firstDueDate,
        uint256 fundraisingDeadline
    ) external returns (address loanAddr) {
        require(termPeriods >= minTermPeriods && termPeriods <= maxTermPeriods, "term out of bounds");
        require(periodLength >= minPeriodLength && periodLength <= maxPeriodLength, "period out of bounds");
        require(principal > 0, "principal=0");

        // Deploy a new MicroLoan instance (direct new; clones could be added later if desired)
        MicroLoan loan = new MicroLoan(
            usdc,
            borrower,
            metadataURI,
            principal,
            termPeriods,
            periodLength,
            firstDueDate,
            fundraisingDeadline
        );

        loanAddr = address(loan);
        loans.push(loanAddr);
        borrowerLoans[borrower].push(loanAddr);

        emit LoanCreated(loanAddr, borrower, principal, termPeriods);
    }

    function getLoans() external view returns (address[] memory) {
        return loans;
    }

    function getBorrowerLoans(address _borrower) external view returns (address[] memory) {
        return borrowerLoans[_borrower];
    }
}


