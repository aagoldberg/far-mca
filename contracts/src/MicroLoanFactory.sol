// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./MicroLoan.sol";

/**
 * @title MicroLoanFactory
 * @notice Deploys zero-interest MicroLoan contracts with single-maturity repayment model
 * @dev Simplified factory - no installments, just loan duration and maturity date
 */
contract MicroLoanFactory is Ownable, Pausable {

    // --------------------
    // Events
    // --------------------
    event LoanCreated(
        address indexed loan,
        address indexed borrower,
        uint256 principal,
        uint256 dueAt,
        uint256 duration
    );

    // --------------------
    // Config & Policy Bounds
    // --------------------
    address public immutable usdc;
    uint256 public minPrincipal = 100e6;           // $100 minimum (6 decimals)
    uint256 public maxPrincipal = 100_000e6;       // $100k maximum (6 decimals)
    uint256 public minLoanDuration = 7 days;       // Minimum time to maturity
    uint256 public maxLoanDuration = 365 days;     // Maximum time to maturity
    uint256 public disbursementWindow = 30 days;   // Time to disburse after funding

    address[] public loans;
    mapping(address => address[]) public borrowerLoans;
    mapping(address => bool) public hasActiveLoan;
    mapping(address => address) public loanToBorrower;

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "usdc=0");
        usdc = _usdc;
    }

    /**
     * @notice Update loan duration bounds for new loans
     * @param _minDuration Minimum loan duration in seconds
     * @param _maxDuration Maximum loan duration in seconds
     */
    function setDurationBounds(
        uint256 _minDuration,
        uint256 _maxDuration
    ) external onlyOwner {
        require(_minDuration > 0 && _minDuration <= _maxDuration, "duration bounds");
        minLoanDuration = _minDuration;
        maxLoanDuration = _maxDuration;
    }

    function setMinPrincipal(uint256 _minPrincipal) external onlyOwner {
        require(_minPrincipal > 0, "min principal must be > 0");
        require(_minPrincipal < maxPrincipal, "min must be < max");
        minPrincipal = _minPrincipal;
    }

    function setMaxPrincipal(uint256 _maxPrincipal) external onlyOwner {
        require(_maxPrincipal > minPrincipal, "max must be > min");
        maxPrincipal = _maxPrincipal;
    }

    function setDisbursementWindow(uint256 _window) external onlyOwner {
        require(_window > 0, "window must be > 0");
        disbursementWindow = _window;
    }

    /**
     * @notice Create a new zero-interest microloan with flexible repayment
     * @dev Validates parameters against factory bounds. Prevents multiple active loans per borrower.
     * @param borrower Address that will receive funds and is responsible for repayment
     * @param metadataURI IPFS or HTTP URI pointing to loan metadata
     * @param principal Total amount to raise and repay (in USDC base units)
     * @param loanDuration Duration in seconds until loan maturity (e.g., 56 days = 56 * 86400)
     * @param fundraisingDeadline Unix timestamp when fundraising expires
     * @return loanAddr Address of the newly created MicroLoan contract
     */
    function createLoan(
        address borrower,
        string calldata metadataURI,
        uint256 principal,
        uint256 loanDuration,
        uint256 fundraisingDeadline
    ) external whenNotPaused returns (address loanAddr) {
        require(principal >= minPrincipal, "principal below minimum");
        require(principal <= maxPrincipal, "principal above maximum");
        require(
            loanDuration >= minLoanDuration && loanDuration <= maxLoanDuration,
            "duration out of bounds"
        );
        require(!hasActiveLoan[borrower], "borrower has active loan");

        // Calculate maturity date
        uint256 dueAt = block.timestamp + loanDuration;

        // Deploy new MicroLoan instance
        MicroLoan loan = new MicroLoan(
            address(this),
            usdc,
            borrower,
            metadataURI,
            principal,
            dueAt,
            fundraisingDeadline,
            disbursementWindow
        );

        loanAddr = address(loan);
        loans.push(loanAddr);
        borrowerLoans[borrower].push(loanAddr);
        hasActiveLoan[borrower] = true;
        loanToBorrower[loanAddr] = borrower;

        emit LoanCreated(loanAddr, borrower, principal, dueAt, loanDuration);
    }

    function getLoans() external view returns (address[] memory) {
        return loans;
    }

    function getBorrowerLoans(address _borrower) external view returns (address[] memory) {
        return borrowerLoans[_borrower];
    }

    /**
     * @notice Called by MicroLoan contracts when they complete or are cancelled
     * @dev Unlocks the borrower to create a new loan
     */
    function notifyLoanClosed() external {
        address borrower = loanToBorrower[msg.sender];
        require(borrower != address(0), "unknown loan");
        hasActiveLoan[borrower] = false;
    }

    // --------------------
    // Emergency Controls
    // --------------------
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
