// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RBFAdvance.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RBFFactory
 * @dev Factory contract for deploying Revenue-Based Financing advances
 */
contract RBFFactory is Ownable {
    
    // State variables
    address public immutable fundingToken; // USDC address
    address[] public advances;
    mapping(address => address[]) public businessAdvances;
    mapping(address => bool) public isValidAdvance;
    
    // Events
    event AdvanceCreated(
        address indexed advance,
        address indexed business,
        uint256 fundingGoal,
        uint256 revenueSharePercentage,
        uint256 repaymentCap
    );
    
    constructor(address _fundingToken) Ownable(msg.sender) {
        fundingToken = _fundingToken;
    }
    
    /**
     * @dev Create a new RBF advance
     */
    function createAdvance(
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 revenueSharePercentage,
        uint256 repaymentCap
    ) external returns (address) {
        require(fundingGoal > 0, "Funding goal must be greater than 0");
        require(revenueSharePercentage > 0 && revenueSharePercentage <= 2000, "Invalid revenue share"); // Max 20%
        require(repaymentCap >= 10000 && repaymentCap <= 30000, "Invalid repayment cap"); // 1x to 3x
        
        RBFAdvance advance = new RBFAdvance(
            fundingToken,
            msg.sender,
            metadataURI,
            fundingGoal,
            revenueSharePercentage,
            repaymentCap
        );
        
        address advanceAddress = address(advance);
        advances.push(advanceAddress);
        businessAdvances[msg.sender].push(advanceAddress);
        isValidAdvance[advanceAddress] = true;
        
        emit AdvanceCreated(
            advanceAddress,
            msg.sender,
            fundingGoal,
            revenueSharePercentage,
            repaymentCap
        );
        
        return advanceAddress;
    }
    
    /**
     * @dev Get all advances
     */
    function getAdvances() external view returns (address[] memory) {
        return advances;
    }
    
    /**
     * @dev Get advances for a specific business
     */
    function getBusinessAdvances(address business) external view returns (address[] memory) {
        return businessAdvances[business];
    }
    
    /**
     * @dev Get total number of advances
     */
    function getAdvanceCount() external view returns (uint256) {
        return advances.length;
    }
}