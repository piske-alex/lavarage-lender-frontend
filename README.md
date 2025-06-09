# Lavarage Lender Frontend

A modern SvelteKit frontend for the Lavarage lending platform with Wagmi integration for Web3 connectivity.

## 🚀 Features

- 🏦 **Lending Dashboard** - Create and manage loan offers with real-time analytics
- 📊 **Portfolio Analytics** - Track lending performance, utilization rates, and yields
- 💰 **Position Management** - Monitor borrower positions using your liquidity
- 🔗 **Web3 Integration** - Connect with MetaMask, WalletConnect, and other wallets
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates** - Live position and offer status updates
- 🎨 **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🛠 Tech Stack

- **SvelteKit** - Modern web framework with SSR support
- **Wagmi** - TypeScript React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and analytics
- **Lucide Icons** - Beautiful, consistent icon library

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- A Web3 wallet (MetaMask, etc.)
- Lavarage API access

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/piske-alex/lavarage-lender-frontend.git
   cd lavarage-lender-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_LAVARAGE_API_URL=https://api.lavarage.com
   VITE_LAVARAGE_API_KEY=your_api_key_here
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗 Building for Production

```bash
npm run build
```

The built files will be in the `build/` directory.

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── WalletConnect.svelte
│   │   └── LoadingSpinner.svelte
│   ├── stores/             # Svelte stores for state management
│   │   ├── wallet.js       # Wallet connection state
│   │   └── lender.js       # Lender data and API calls
│   ├── utils/              # Utility functions
│   │   └── format.js       # Data formatting helpers
│   └── wagmi.js           # Wagmi configuration
├── routes/                 # SvelteKit routes
│   ├── +layout.svelte     # Main layout with navigation
│   ├── +page.svelte       # Dashboard home page
│   ├── offers/            # Offer management pages
│   │   ├── +page.svelte   # Offers listing
│   │   └── create/        # Create new offer
│   └── positions/         # Position monitoring
│       └── +page.svelte   # Positions listing
├── app.html               # HTML template
├── app.css                # Global styles
└── app.d.ts               # TypeScript declarations
```

## 🔌 API Integration

The frontend integrates with the following Lavarage API endpoints:

### Lender Endpoints
- `GET /api/sdk/v1.0/lender/offers` - Fetch your loan offers
- `POST /api/sdk/v1.0/lender/offers/create` - Create new loan offer
- `PUT /api/sdk/v1.0/lender/offers/update` - Update existing offer
- `PUT /api/sdk/v1.0/lender/offers/changeLTV` - Change offer LTV
- `GET /api/sdk/v1.0/lender/positions` - Monitor borrower positions
- `GET /api/sdk/v1.0/lender/pools/balance` - Check pool balances
- `POST /api/sdk/v1.0/lender/pools/deposit` - Create deposit transaction
- `POST /api/sdk/v1.0/lender/pools/withdraw` - Create withdrawal transaction

## 🔑 Key Features Explained

### 📊 Dashboard
- Overview of all lending metrics
- Real-time portfolio performance
- Quick access to create offers and view positions

### 🏦 Loan Offers
- Create offers for different collateral tokens
- Set custom interest rates and exposure limits
- Monitor offer utilization and performance
- Update offer parameters dynamically

### 👥 Position Monitoring
- Track all positions using your liquidity
- Monitor borrower performance and risk
- View interest earnings in real-time
- Filter by status (active, closed, liquidated)

### 🔐 Wallet Integration
- Support for multiple wallet types
- Automatic connection persistence
- Secure transaction signing
- Multi-chain support (Solana, BSC)

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. Key customization points:

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Components**: Update `src/app.css` for component styles
- **Layout**: Customize `src/routes/+layout.svelte`

### API Configuration
Update API endpoints and configuration in:
- `src/lib/stores/lender.js` - API calls and data management
- `src/lib/wagmi.js` - Blockchain configuration

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Run Svelte check
npm run check:watch  # Run Svelte check in watch mode
npm run lint         # Check code formatting
npm run format       # Format code
```

### Code Style
The project uses Prettier for code formatting. Configuration is in `.prettierrc`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add appropriate tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Issues**: [GitHub Issues](https://github.com/piske-alex/lavarage-lender-frontend/issues)
- **Documentation**: [Lavarage API Docs](https://api.lavarage.com/docs)
- **Community**: Join our Discord community

## 🙏 Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- Web3 integration powered by [Wagmi](https://wagmi.sh/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is a frontend interface for the Lavarage lending platform. Make sure you have proper API access and understand the risks involved in DeFi lending before using this application in production.