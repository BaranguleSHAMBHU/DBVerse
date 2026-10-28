# DBVerse — Git for Databases

**A Git-inspired version control and collaboration platform for relational databases.**

DBVerse brings version control concepts to relational databases, enabling developers to track database changes, review differences, maintain commit history, and manage changes more systematically.

## Overview

Database changes are often difficult to track, review, and reverse safely. Traditional workflows may rely on manual scripts and backups, making it challenging to understand what changed, when it changed, and how to recover an earlier state.

DBVerse aims to address these challenges by introducing Git-inspired workflows for relational databases. It represents database modifications as reviewable commits and provides a structured interface for examining changes and managing database history.

## Key Features

- **Database Management:** Manage database connections and organize database projects.
- **Change Tracking:** Track INSERT, UPDATE, DELETE, and schema changes.
- **Commit History:** Maintain a chronological record of database changes.
- **Change Comparison:** Inspect row-level and schema-level differences.
- **Branch Management:** Organize independent lines of database development.
- **Rollback and Recovery:** Support workflows for reviewing and reversing database changes.
- **Audit Logs:** Maintain a record of relevant project activities.
- **Analytics Dashboard:** Present database activity and version-control statistics.
- **Authentication and Settings:** Provide a user interface for account and project configuration.

*Note: The implementation status of these capabilities depends on the backend integration. Features currently powered by mock data are demonstrational and should not be considered production-ready.*

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Application Framework | TanStack Start |
| Development Server and Bundler | Vite |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| Package Manager | npm |

## Getting Started

### Prerequisites

Install Node.js and npm on your system.

- [Node.js](https://nodejs.org/)

### Installation

Clone the repository:

```bash
git clone https://github.com/BaranguleSHAMBHU/DBVerse.git
cd DBVerse
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal to access the application.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Format files using Prettier |

## Project Structure

```text
DBVerse/
├── public/              # Public assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/              # Utilities and supporting logic
│   ├── routes/           # Application pages and routes
│   ├── router.tsx        # Router configuration
│   └── styles.css        # Global styles
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

The exact contents may evolve as the project develops.

## Project Objectives

1. Provide a structured way to track relational database changes.
2. Represent database modifications as reviewable commits.
3. Make database changes easier to compare and understand.
4. Explore Git-inspired branching and collaboration for databases.
5. Support safer database change management and recovery workflows.
6. Maintain an auditable history of database operations.

## Future Scope

- Advanced branch merging and conflict resolution.
- Automatic database migration generation.
- Transaction-aware change tracking.
- Database rollback and recovery mechanisms.
- Role-based access control and team collaboration.
- Secure database credential management.
- Support for additional relational database engines.
- Automated testing and performance improvements.

## Project Status

DBVerse is under active development. The current application includes a web interface for exploring database version-control workflows. Backend integration, database connectivity, persistent commit storage, and reliable rollback mechanisms must be implemented and validated according to the project's development milestones.

## Contributing

Contributions, bug reports, and suggestions are welcome. Please open an issue or submit a pull request to propose improvements.

## License

No license has been specified yet. All rights remain with the respective copyright holder unless a license is added to this repository.

---

**DBVerse — Bringing version control to relational databases.**