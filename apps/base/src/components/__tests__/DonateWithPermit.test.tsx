import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DonateWithPermit } from '../DonateWithPermit'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ address: '0x123' })),
  useChainId: vi.fn(() => 84532),
  useWriteContract: vi.fn(() => ({
    writeContract: vi.fn(),
    isPending: false,
    isSuccess: false,
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
  useReadContract: vi.fn(() => ({
    data: BigInt(1000000), // 1 USDC balance
    isLoading: false,
  })),
}))

// Mock Privy
vi.mock('@privy-io/react-auth', () => ({
  usePrivy: vi.fn(() => ({
    user: { wallet: { address: '0x123' } },
    ready: true,
    authenticated: true,
  })),
}))

describe('DonateWithPermit Component', () => {
  const mockCampaignAddress = '0xabc123'
  const mockTokenAddress = '0xdef456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render donation form when user is connected', () => {
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    expect(screen.getByPlaceholderText(/enter amount/i)).toBeInTheDocument()
    expect(screen.getByText(/donate/i)).toBeInTheDocument()
  })

  it('should show connect wallet message when not connected', () => {
    const { useAccount } = require('wagmi')
    useAccount.mockReturnValue({ address: undefined })
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    expect(screen.getByText(/connect.*wallet/i)).toBeInTheDocument()
  })

  it('should validate donation amount', async () => {
    const user = userEvent.setup()
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    const input = screen.getByPlaceholderText(/enter amount/i)
    const button = screen.getByRole('button', { name: /donate/i })
    
    // Try to donate 0
    await user.type(input, '0')
    await user.click(button)
    
    expect(screen.getByText(/enter.*valid.*amount/i)).toBeInTheDocument()
  })

  it('should check for insufficient balance', async () => {
    const { useReadContract } = require('wagmi')
    useReadContract.mockReturnValue({
      data: BigInt(500000), // 0.5 USDC balance
      isLoading: false,
    })
    
    const user = userEvent.setup()
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    const input = screen.getByPlaceholderText(/enter amount/i)
    await user.type(input, '1') // Try to donate 1 USDC
    
    expect(screen.getByText(/insufficient.*balance/i)).toBeInTheDocument()
  })

  it('should handle successful donation', async () => {
    const mockWriteContract = vi.fn()
    const { useWriteContract } = require('wagmi')
    useWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      isPending: false,
      isSuccess: false,
    })
    
    const user = userEvent.setup()
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    const input = screen.getByPlaceholderText(/enter amount/i)
    const button = screen.getByRole('button', { name: /donate/i })
    
    await user.type(input, '0.5')
    await user.click(button)
    
    expect(mockWriteContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: mockTokenAddress,
        functionName: expect.stringMatching(/permit|approve/),
      })
    )
  })

  it('should show loading state during transaction', () => {
    const { useWriteContract } = require('wagmi')
    useWriteContract.mockReturnValue({
      writeContract: vi.fn(),
      isPending: true,
      isSuccess: false,
    })
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })

  it('should show success message after donation', () => {
    const { useWaitForTransactionReceipt } = require('wagmi')
    useWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: true,
    })
    
    render(
      <DonateWithPermit 
        campaignAddress={mockCampaignAddress}
        tokenAddress={mockTokenAddress}
      />
    )
    
    expect(screen.getByText(/thank.*you/i)).toBeInTheDocument()
  })
})