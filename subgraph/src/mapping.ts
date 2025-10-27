import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  MicroLoan as MicroLoanContract,
  Contributed,
  FundraisingClosed,
  Disbursed,
  Repayment as RepaymentEvent,
  Claimed,
  Completed,
  Defaulted,
  Refunded,
  FundraisingCancelled,
  MetadataUpdated as MetadataUpdatedEvent
} from "../generated/templates/MicroLoan/MicroLoan"
import {
  LoanCreated
} from "../generated/MicroLoanFactory/MicroLoanFactory"
import {
  MicroLoan,
  Contribution,
  Repayment,
  Claim,
  Refund,
  MetadataUpdate,
  LenderPosition,
  GlobalStats
} from "../generated/schema"
import { MicroLoan as MicroLoanTemplate } from "../generated/templates"

// Helper to get or create global stats
function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global")
  if (!stats) {
    stats = new GlobalStats("global")
    stats.totalLoans = 0
    stats.activeLoans = 0
    stats.completedLoans = 0
    stats.defaultedLoans = 0
    stats.totalPrincipalFunded = BigInt.zero()
    stats.totalPrincipalRepaid = BigInt.zero()
    stats.totalContributions = 0
    stats.totalRepayments = 0
    stats.save()
  }
  return stats
}

// Helper to update lender position
function updateLenderPosition(
  loanAddress: Address,
  lender: Address,
  contributionDelta: BigInt,
  claimedDelta: BigInt,
  timestamp: BigInt
): void {
  let id = loanAddress.toHex() + "-" + lender.toHex()
  let position = LenderPosition.load(id)

  if (!position) {
    position = new LenderPosition(id)
    position.loan = loanAddress.toHex()
    position.lender = lender
    position.contributed = BigInt.zero()
    position.claimed = BigInt.zero()
    position.claimable = BigInt.zero()
  }

  position.contributed = position.contributed.plus(contributionDelta)
  position.claimed = position.claimed.plus(claimedDelta)

  // Calculate claimable from contract
  let contract = MicroLoanContract.bind(loanAddress)
  let claimableResult = contract.try_claimableAmount(lender)
  if (!claimableResult.reverted) {
    position.claimable = claimableResult.value
  }

  position.lastUpdated = timestamp
  position.save()
}

export function handleLoanCreated(event: LoanCreated): void {
  // Create loan entity
  let loan = new MicroLoan(event.params.loan.toHex())
  loan.borrower = event.params.borrower
  loan.principal = event.params.principal
  loan.dueAt = event.params.dueAt
  loan.duration = event.params.duration

  // Get metadata and deadline from contract
  let contract = MicroLoanContract.bind(event.params.loan)
  loan.metadataURI = contract.metadataURI()
  loan.fundraisingDeadline = contract.fundraisingDeadline()

  // Initial state
  loan.fundraisingActive = true
  loan.active = false
  loan.completed = false
  loan.cancelled = false
  loan.defaulted = false

  // Initial amounts
  loan.totalFunded = BigInt.zero()
  loan.totalRepaid = BigInt.zero()
  loan.outstandingPrincipal = event.params.principal

  // Timestamps
  loan.createdAt = event.block.timestamp
  loan.fundedAt = null
  loan.disbursedAt = null
  loan.completedAt = null

  // Computed
  loan.contributorsCount = 0
  loan.percentFunded = BigInt.zero()
  loan.percentRepaid = BigInt.zero()

  loan.save()

  // Start indexing this loan contract
  MicroLoanTemplate.create(event.params.loan)

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.totalLoans = stats.totalLoans + 1
  stats.save()
}

export function handleContributed(event: Contributed): void {
  let loanId = event.address.toHex()
  let loan = MicroLoan.load(loanId)
  if (!loan) return

  // Create contribution entity
  let contributionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let contribution = new Contribution(contributionId)
  contribution.loan = loanId
  contribution.contributor = event.params.contributor
  contribution.amount = event.params.amount
  contribution.timestamp = event.block.timestamp
  contribution.transactionHash = event.transaction.hash
  contribution.save()

  // Update loan
  let contract = MicroLoanContract.bind(event.address)
  loan.totalFunded = contract.totalFunded()
  loan.contributorsCount = contract.contributorsCount().toI32()

  if (loan.principal.gt(BigInt.zero())) {
    loan.percentFunded = loan.totalFunded.times(BigInt.fromI32(10000)).div(loan.principal)
  }

  loan.save()

  // Update lender position
  updateLenderPosition(
    event.address,
    event.params.contributor,
    event.params.amount,
    BigInt.zero(),
    event.block.timestamp
  )

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.totalContributions = stats.totalContributions + 1
  stats.save()
}

export function handleFundraisingClosed(event: FundraisingClosed): void {
  let loan = MicroLoan.load(event.address.toHex())
  if (!loan) return

  loan.fundraisingActive = false
  loan.fundedAt = event.block.timestamp
  loan.save()

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.totalPrincipalFunded = stats.totalPrincipalFunded.plus(event.params.totalAmount)
  stats.save()
}

export function handleDisbursed(event: Disbursed): void {
  let loan = MicroLoan.load(event.address.toHex())
  if (!loan) return

  loan.active = true
  loan.disbursedAt = event.block.timestamp
  loan.save()

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.activeLoans = stats.activeLoans + 1
  stats.save()
}

export function handleRepayment(event: RepaymentEvent): void {
  let loanId = event.address.toHex()
  let loan = MicroLoan.load(loanId)
  if (!loan) return

  // Create repayment entity
  let repaymentId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let repayment = new Repayment(repaymentId)
  repayment.loan = loanId
  repayment.payer = event.params.payer
  repayment.amount = event.params.amount
  repayment.totalRepaid = event.params.totalRepaid
  repayment.outstanding = event.params.outstanding
  repayment.timestamp = event.params.timestamp
  repayment.secondsUntilDue = event.params.secondsUntilDue
  repayment.wasLate = event.params.secondsUntilDue.equals(BigInt.zero())
  repayment.transactionHash = event.transaction.hash
  repayment.save()

  // Update loan
  let contract = MicroLoanContract.bind(event.address)
  loan.totalRepaid = contract.totalRepaid()
  loan.outstandingPrincipal = contract.outstandingPrincipal()

  if (loan.principal.gt(BigInt.zero())) {
    loan.percentRepaid = loan.totalRepaid.times(BigInt.fromI32(10000)).div(loan.principal)
  }

  loan.save()

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.totalRepayments = stats.totalRepayments + 1
  stats.totalPrincipalRepaid = stats.totalPrincipalRepaid.plus(event.params.amount)
  stats.save()
}

export function handleClaimed(event: Claimed): void {
  let loanId = event.address.toHex()

  // Create claim entity
  let claimId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let claim = new Claim(claimId)
  claim.loan = loanId
  claim.contributor = event.params.contributor
  claim.amount = event.params.amount
  claim.timestamp = event.block.timestamp
  claim.transactionHash = event.transaction.hash
  claim.save()

  // Update lender position
  updateLenderPosition(
    event.address,
    event.params.contributor,
    BigInt.zero(),
    event.params.amount,
    event.block.timestamp
  )
}

export function handleCompleted(event: Completed): void {
  let loan = MicroLoan.load(event.address.toHex())
  if (!loan) return

  loan.completed = true
  loan.completedAt = event.params.timestamp
  loan.save()

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.activeLoans = stats.activeLoans - 1
  stats.completedLoans = stats.completedLoans + 1
  stats.save()
}

export function handleDefaulted(event: Defaulted): void {
  let loan = MicroLoan.load(event.address.toHex())
  if (!loan) return

  loan.defaulted = true
  loan.save()

  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.defaultedLoans = stats.defaultedLoans + 1
  stats.save()
}

export function handleRefunded(event: Refunded): void {
  let loanId = event.address.toHex()

  // Create refund entity
  let refundId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let refund = new Refund(refundId)
  refund.loan = loanId
  refund.contributor = event.params.contributor
  refund.amount = event.params.amount
  refund.timestamp = event.block.timestamp
  refund.transactionHash = event.transaction.hash
  refund.save()

  // Update loan
  let loan = MicroLoan.load(loanId)
  if (!loan) return

  let contract = MicroLoanContract.bind(event.address)
  loan.totalFunded = contract.totalFunded()
  loan.save()
}

export function handleFundraisingCancelled(event: FundraisingCancelled): void {
  let loan = MicroLoan.load(event.address.toHex())
  if (!loan) return

  loan.fundraisingActive = false
  loan.cancelled = true
  loan.save()

  // Update global stats (if it was active)
  if (loan.active) {
    let stats = getOrCreateGlobalStats()
    stats.activeLoans = stats.activeLoans - 1
    stats.save()
  }
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  let loanId = event.address.toHex()

  // Create metadata update entity
  let updateId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let update = new MetadataUpdate(updateId)
  update.loan = loanId
  update.newMetadataURI = event.params.newMetadataURI
  update.timestamp = event.params.timestamp
  update.transactionHash = event.transaction.hash
  update.save()

  // Update loan
  let loan = MicroLoan.load(loanId)
  if (!loan) return

  loan.metadataURI = event.params.newMetadataURI
  loan.save()
}
