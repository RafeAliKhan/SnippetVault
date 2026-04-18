 Snippet Vault
A personal code snippet manager built for developers who are tired of losing useful code across projects. Save, organize, search, and share code snippets — with syntax highlighting for 20+ languages.

Live Demo: snippet-vault.vercel.app  |  Built by: Rafe Ali Khan


✨ Features

Save & Organize — Store snippets with a title, language tag, and custom labels
Syntax Highlighting — Powered by Prism.js for 20+ programming languages
Fuzzy Search — Find any snippet instantly using Fuse.js-powered search
One-Click Copy — Copy code to clipboard with a single click and visual confirmation
Public Share Links — Toggle any snippet public and share it via a unique URL
Dark Mode — Full dark/light theme support
User Auth — Secure login with personal snippet vaults via Supabase Auth


🛠️ Tech Stack
LayerTechFrontendNext.js 14, React, Tailwind CSSBackend / DBSupabase (PostgreSQL + Auth)Syntax HighlightingPrism.jsSearchFuse.jsDeploymentVercel

🚀 Getting Started
Prerequisites

Node.js 18+
A free Supabase account

Installation
bash# Clone the repository
git clone https://github.com/yourusername/snippet-vault.git
cd snippet-vault

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
Environment Variables
Create a .env.local file in the root with the following:
envNEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Database Setup
Run the following SQL in your Supabase SQL editor to create the snippets table:
sqlcreate table snippets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  language text not null,
  code text not null,
  tags text[],
  is_public boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table snippets enable row level security;

-- Users can only see their own snippets (plus public ones)
create policy "Users can view own snippets"
  on snippets for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can insert own snippets"
  on snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on snippets for delete
  using (auth.uid() = user_id);
Run Locally
bashnpm run dev
Open http://localhost:3000 in your browser.

📁 Project Structure
snippet-vault/
├── app/
│   ├── page.tsx              # Home / snippet list
│   ├── snippet/
│   │   └── [id]/page.tsx     # Public snippet view
│   └── layout.tsx
├── components/
│   ├── SnippetCard.tsx       # Individual snippet display
│   ├── SnippetEditor.tsx     # Create / edit form
│   ├── SearchBar.tsx         # Fuzzy search input
│   └── TagFilter.tsx         # Filter by language/tag
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── search.ts             # Fuse.js search config
└── public/

DashboardSnippet ViewShare LinkShow ImageShow ImageShow Image

🗺️ Roadmap

 Core CRUD for snippets
 Syntax highlighting
 Fuzzy search
 Public share links
 Dark mode
 Import from GitHub Gist
 Collections / folders
 Browser extension for quick save
 Export snippets as JSON


🤝 Contributing
Contributions, issues and feature requests are welcome. Feel free to open an issue or submit a pull request.

Fork the project
Create your branch (git checkout -b feature/awesome-feature)
Commit your changes (git commit -m 'Add awesome feature')
Push to the branch (git push origin feature/awesome-feature)
Open a Pull Request


📄 License
Distributed under the MIT License. 

👤 Author
Rafe Ali Khan

GitHub: @RafeAliKhan
LinkedIn: www.linkedin.com/in/rafe-ali-khan-828b9b331
Portfolio: https://rafealikhan.github.io/Portfolio/
