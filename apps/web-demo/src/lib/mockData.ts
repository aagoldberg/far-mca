export interface Loan {
  id: string;
  borrowerName: string;
  businessName: string;
  businessType: string;
  amount: number;
  funded: number;
  fundersCount: number;
  monthlyRevenue: number;
  duration: number; // months
  purpose: string;
  story: string;
  createdAt: Date;
  status: 'active' | 'funded' | 'repaying' | 'completed';
  repaidAmount?: number;
  avatar: string; // Person headshot
  coverImage: string; // Business/storefront image
}

// Using Unsplash for realistic placeholder images
export const mockLoans: Loan[] = [
  {
    id: '1',
    borrowerName: 'Maria Santos',
    businessName: 'Sweet Maria\'s Bakery',
    businessType: 'Food & Beverage',
    amount: 5000,
    funded: 3750,
    fundersCount: 12,
    monthlyRevenue: 8500,
    duration: 6,
    purpose: 'New commercial oven',
    story: 'I\'ve been running my bakery for 3 years and my old oven finally gave out. A new commercial oven will help me double my production capacity and take on more wholesale orders.',
    createdAt: new Date('2024-12-01'),
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1517433670267-30f41c098a5d?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    borrowerName: 'James Chen',
    businessName: 'Bloom & Grow Plant Shop',
    businessType: 'Retail',
    amount: 3000,
    funded: 3000,
    fundersCount: 8,
    monthlyRevenue: 6200,
    duration: 4,
    purpose: 'Holiday inventory',
    story: 'Getting ready for the spring season! Need to stock up on rare houseplants and supplies that my customers love.',
    createdAt: new Date('2024-11-15'),
    status: 'repaying',
    repaidAmount: 1500,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    borrowerName: 'Aisha Johnson',
    businessName: 'Aisha\'s African Cuisine',
    businessType: 'Food & Beverage',
    amount: 7500,
    funded: 7500,
    fundersCount: 23,
    monthlyRevenue: 12000,
    duration: 8,
    purpose: 'Food truck expansion',
    story: 'My restaurant has been thriving and I want to bring my authentic West African dishes to more neighborhoods with a food truck.',
    createdAt: new Date('2024-10-20'),
    status: 'completed',
    repaidAmount: 7500,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    borrowerName: 'Mike Rodriguez',
    businessName: 'Rodriguez Auto Detail',
    businessType: 'Services',
    amount: 2500,
    funded: 1200,
    fundersCount: 5,
    monthlyRevenue: 4800,
    duration: 3,
    purpose: 'Professional detailing equipment',
    story: 'Upgrading from home garage to mobile detailing service. New equipment will let me serve more customers per day.',
    createdAt: new Date('2024-12-05'),
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=400&fit=crop',
  },
];

export const mockUserStats = {
  totalFunded: 2500,
  loansSupported: 4,
  totalRepaid: 1200,
  activeFunding: 1300,
};

export const mockConnectedStore = {
  name: 'Sweet Maria\'s Bakery',
  platform: 'Shopify',
  monthlyRevenue: 8500,
  monthsActive: 36,
  revenueGrowth: 12, // percent
  ordersPerMonth: 180,
};
