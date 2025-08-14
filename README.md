# RootMosaic HVAC Control Center

A complete business intelligence dashboard for small B2B HVAC contracting companies. Built with Next.js 14, TypeScript, and modern web technologies.

## 🎯 Project Overview

This application provides comprehensive business analytics for HVAC contractors, helping track:
- Job profitability and cost analysis
- Technician performance metrics  
- Client value scoring and upsell opportunities
- Callback root cause analysis
- Contract management and renewals
- Financial KPIs and reporting

**Target User**: Small B2B HVAC contractors in Las Vegas who currently use fragmented systems (QuickBooks, BuilderTrend, Excel) and need unified visibility into their operations.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix primitives
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth transitions
- **Data**: Static JSON files (no external database required)
- **Deployment**: Vercel-optimized (zero configuration)

## 📊 Data Model

The application uses 6 months of realistic synthetic data (January-June 2025):

### Core Entities

| File | Records | Description |
|------|---------|-------------|
| `clients.json` | 60 | B2B clients with industry, contact info, service levels |
| `technicians.json` | 14 | Technician profiles with skills, certifications, costs |
| `jobs.json` | 1,320 | Service calls, installations, PM with full lifecycle |
| `invoices.json` | 1,030 | Financial records linked to completed jobs |
| `contracts.json` | 26 | Maintenance agreements with renewal tracking |
| `equipment.json` | 148 | Client equipment with failure risk scoring |
| `callbacks.json` | 90 | Repeat visits with root cause analysis |
| `attachments.json` | 1,756 | Document references (PDFs, photos, reports) |
| `pricebook.json` | 16 | Parts catalog with cost and markup data |

### Key Relationships

```
Clients → Jobs → Invoices
Clients → Contracts
Clients → Equipment
Jobs → Callbacks (root cause tracking)
Jobs → Attachments (documentation)
Technicians → Jobs (many-to-many)
```

### Computed Metrics

All KPIs are calculated on-demand from base data:

- **Comeback Rate**: Callbacks ÷ completed jobs (rolling 30/60/90 days)
- **First-Time-Fix Rate**: Inverse of comeback rate
- **Gross Margin**: Revenue - (labor + parts + subcontractor costs)
- **Bid Accuracy**: Actual vs estimated labor hour variance
- **Technician Efficiency**: Composite of FTF, margin contribution, time variance
- **Client Value Score**: Revenue, margin, payment behavior, callback load
- **Equipment Risk**: Age + service history + failure patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+ (recommended) or npm

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd rootmosaic-hvac-control-center

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized build
pnpm build

# Start production server
pnpm start
```

### Run Tests

```bash
# Run unit tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## 🚀 Deployment to Vercel

### Method 1: GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your GitHub repo
4. **Framework Preset**: Next.js (auto-detected)
5. **Build Command**: `pnpm build` 
6. **Output Directory**: `.next` (auto-detected)
7. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts - no environment variables needed
```

### Zero Configuration

This application requires **no environment variables** and **no external services**. All data is statically included and the app runs entirely on the edge.

## 📱 Features by Page

### 🏠 Dashboard (/)
- **Owner KPIs**: Revenue MTD/YTD, Margin %, Callback Rate, FTF Rate
- **AR Aging**: 30/60/90+ day buckets  
- **Charts**: Revenue vs Margin trends, Callback analysis
- **Alerts**: Equipment upgrades, contract renewals, upsell opportunities

### 💼 Jobs (/jobs)  
- **Profit Tracking**: On-track vs over-budget status
- **Cost Breakdown**: Labor, parts, subcontractor costs
- **Filtering**: By job type, system type, status, technician
- **Export**: CSV download with all job details

### 🔄 Callbacks (/callbacks)
- **Root Cause Analysis**: Workmanship, parts, diagnosis, documentation
- **Pattern Recognition**: By technician, client, system type
- **Prevention Strategies**: Targeted recommendations
- **Resolution Tracking**: Outcome monitoring

### 👥 Technicians (/technicians)
- **Performance Leaderboard**: Efficiency scoring
- **Individual Metrics**: FTF rate, callback rate, margin contribution
- **Coaching Alerts**: Identify training needs
- **Labor Variance**: Bid accuracy by technician

### 🏢 Clients (/clients)
- **Value Scoring**: Revenue, margin, payment behavior
- **Upsell Triggers**: Old equipment, no contracts, high service calls  
- **Relationship Management**: Contact info, service levels
- **Payment Analysis**: Days to pay, credit terms

### 📄 Contracts (/contracts)
- **Renewal Pipeline**: Contracts due in next 90 days
- **Revenue Projection**: Annual contract value tracking
- **Status Monitoring**: Active, expired, pending renewal
- **Client Coverage**: Contract vs non-contract revenue

### 📊 Reports (/reports)
- **CSV Exports**: All major data sets
- **Business Analysis**: Job profitability, technician KPIs
- **Compliance**: AR aging, contract summaries
- **Custom Filtering**: Date ranges, client segments

## 🛠️ Development

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (dash)/            # Dashboard routes
│   │   ├── jobs/
│   │   ├── callbacks/  
│   │   ├── technicians/
│   │   ├── clients/
│   │   ├── contracts/
│   │   └── reports/
│   ├── globals.css        # Tailwind CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard home
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── DataTable.tsx     # Reusable data table
│   ├── KPICard.tsx       # Metric display cards
│   ├── *Chart.tsx        # Chart components
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utility functions
│   ├── data.ts          # Data loading utilities
│   ├── metrics.ts       # KPI calculations
│   ├── format.ts        # Display formatting
│   └── mock-nlp.ts      # Text analysis utilities
├── data/                # Static JSON data
│   ├── clients.json
│   ├── technicians.json
│   ├── jobs.json
│   └── ...
├── scripts/             # Development scripts
│   └── generate-data.ts # Data generation
└── types/              # TypeScript definitions
    └── index.ts
```

### Key Technologies

- **Next.js 14**: App Router, Server Components, Edge optimization
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS**: Utility-first styling with custom design system  
- **shadcn/ui**: High-quality component library built on Radix
- **Recharts**: Declarative charting library
- **Framer Motion**: Smooth animations and transitions
- **Vitest**: Fast unit testing

### Code Quality

- **ESLint**: Code linting with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Vitest**: Unit tests for critical business logic

## 📈 Data Regeneration

To regenerate the synthetic data with different parameters:

```bash
# Regenerate all data files
pnpm seed:data
```

### Customizing Data Volume

Edit `scripts/generate-data.ts` to adjust:

- Number of clients (default: 60)
- Number of technicians (default: 14) 
- Jobs per month (default: 200)
- Seasonal multipliers (summer heat spike)
- Callback rates and patterns

The script uses a seeded random number generator for consistent results.

## 🔒 Security & Privacy

- **No External APIs**: All data is local, no third-party services
- **No User Authentication**: Demo application with static data
- **Client-Side Only**: No server-side data processing
- **GDPR Compliant**: Synthetic data only, no real customer information

## ⚡ Performance

- **Static Generation**: All pages pre-rendered at build time
- **Edge Optimized**: Runs on Vercel Edge Runtime
- **Bundle Size**: < 500KB gzipped JavaScript
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Lazy Loading**: Charts and heavy components load on demand

## 🧪 Testing

Unit tests cover critical business logic:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test metrics

# Run tests in watch mode
pnpm test --watch
```

Tests focus on:
- KPI calculation accuracy
- Data transformation logic
- Edge cases (empty data sets)
- Type safety validation

## 📝 Known Limitations

This is a demonstration application with some intentional limitations:

- **Static Data**: No real-time updates or persistence
- **No Authentication**: Open access to all features
- **Simulated NLP**: Text analysis uses keyword matching, not ML
- **CSV Export**: Downloads are client-side generated
- **Mobile UX**: Optimized for desktop/tablet use

### Production Roadmap

To convert this to a production system:

1. **Database Integration**: Replace JSON files with PostgreSQL/Supabase
2. **Authentication**: Add user accounts and role-based access
3. **Real-time Updates**: WebSocket connections for live data
4. **File Uploads**: Handle actual PDFs and photos
5. **API Integration**: Connect to QuickBooks, GPS tracking, etc.
6. **Mobile App**: React Native or Progressive Web App

## 🤝 Contributing

This is a demonstration project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions about this demonstration:

1. Check the GitHub issues
2. Review the code comments
3. Test with the provided synthetic data

---

**Built with ❤️ for HVAC contractors who deserve better business intelligence tools.**