// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./MicroLoan.sol";

/**
 * @title MicroLoanFactory
 * @notice Deploys zero-interest MicroLoan contracts and tracks them. Enforces simple policy bounds.
 * @dev Factory pattern for creating MicroLoan instances. Prevents multiple active loans per borrower.
 */
contract MicroLoanFactory is Ownable, Pausable {

    // --------------------
    // Events
    // --------------------
    event LoanCreated(address indexed loan, address indexed borrower, uint256 principal, uint256 termPeriods);

    // --------------------
    // Config & Policy bounds
    // --------------------
    address public immutable usdc;              // single funding token for all loans
    uint256 public minPrincipal = 100e6;         // $100 minimum (6 decimals)
    uint256 public minTermPeriods = 3;
    uint256 public maxTermPeriods = 60;
    uint256 public minPeriodLength = 7 days;     // weekly minimum
    uint256 public maxPeriodLength = 60 days;    // bi-monthly maximum
    uint256 public disbursementWindow = 14 days; // default window to disburse after funding
    uint256 public gracePeriod = 7 days;         // default grace period before default

    address[] public loans;
    mapping(address => address[]) public borrowerLoans;
    mapping(address => bool) public hasActiveLoan;       // borrower => has active loan
    mapping(address => address) public loanToBorrower;   // loan => borrower

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "usdc=0");
        usdc = _usdc;
    }

    /**
     * @notice Update term and period length bounds for new loans
     * @param _minTerm Minimum number of repayment periods
     * @param _maxTerm Maximum number of repayment periods
     * @param _minPeriodLen Minimum period length in seconds
     * @param _maxPeriodLen Maximum period length in seconds
     */
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

    function setMinPrincipal(uint256 _minPrincipal) external onlyOwner {
        require(_minPrincipal > 0, "min principal must be > 0");
        minPrincipal = _minPrincipal;
    }

    function setDisbursementWindow(uint256 _window) external onlyOwner {
        require(_window > 0, "window must be > 0");
        disbursementWindow = _window;
    }

    function setGracePeriod(uint256 _gracePeriod) external onlyOwner {
        require(_gracePeriod > 0, "grace period must be > 0");
        gracePeriod = _gracePeriod;
    }

    /**
     * @notice Create a new zero-interest microloan
     * @dev Validates all parameters against factory bounds. Prevents multiple active loans per borrower.
     * @param borrower Address that will receive the disbursed funds and is responsible for repayment
     * @param metadataURI IPFS or HTTP URI pointing to loan metadata (title, description, image, etc.)
     * @param principal Total amount to raise and repay (in funding token base units, e.g., USDC has 6 decimals)
     * @param termPeriods Number of repayment installments
     * @param periodLength Duration of each period in seconds (e.g., 30 days)
     * @param firstDueDate Unix timestamp when first payment is due
     * @param fundraisingDeadline Unix timestamp when fundraising expires if not fully funded
     * @return loanAddr Address of the newly created MicroLoan contract
     */
    function createLoan(
        address borrower,
        string calldata metadataURI,
        uint256 principal,
        uint256 termPeriods,
        uint256 periodLength,
        uint256 firstDueDate,
        uint256 fundraisingDeadline
    ) external whenNotPaused returns (address loanAddr) {
        require(principal >= minPrincipal, "principal below minimum");
        require(termPeriods >= minTermPeriods && termPeriods <= maxTermPeriods, "term out of bounds");
        require(periodLength >= minPeriodLength && periodLength <= maxPeriodLength, "period out of bounds");
        require(!hasActiveLoan[borrower], "borrower has active loan");

        // Deploy a new MicroLoan instance (direct new; clones could be added later if desired)
        MicroLoan loan = new MicroLoan(
            address(this),
            usdc,
            borrower,
            metadataURI,
            principal,
            termPeriods,
            periodLength,
            firstDueDate,
            fundraisingDeadline,
            disbursementWindow,
            gracePeriod
        );

        loanAddr = address(loan);
        loans.push(loanAddr);
        borrowerLoans[borrower].push(loanAddr);
        hasActiveLoan[borrower] = true;
        loanToBorrower[loanAddr] = borrower;

        emit LoanCreated(loanAddr, borrower, principal, termPeriods);
    }

    function getLoans() external view returns (address[] memory) {
        return loans;
    }

    function getBorrowerLoans(address _borrower) external view returns (address[] memory) {
        return borrowerLoans[_borrower];
    }

    /**
     * @notice Called by MicroLoan contracts when they complete or are cancelled
     * @dev Unlocks the borrower to create a new loan. Only callable by loan contracts created by this factory.
     */
    function notifyLoanClosed() external {
        address borrower = loanToBorrower[msg.sender];
        require(borrower != address(0), "unknown loan");
        hasActiveLoan[borrower] = false;
    }

    // --------------------
    // Emergency Controls
    // --------------------
    /**
     * @notice Pause new loan creation in case of emergency
     * @dev Only affects createLoan(); existing loans continue to operate normally
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause loan creation after emergency is resolved
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}


