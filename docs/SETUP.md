# GitBook Setup Guide

This folder contains the LendFriend documentation in GitBook format.

## Quick Start

### Option 1: GitBook Cloud (Recommended)

1. **Sign up** at [gitbook.com](https://gitbook.com)
   - It's free for open source projects

2. **Create a new space**
   - Choose "Import from GitHub"
   - Select your repository
   - Set content source to `/docs` folder

3. **Custom domain** (optional)
   - Go to Space Settings → Domain
   - Add `docs.lendfriend.org` as custom domain
   - Update DNS records as instructed

4. **Auto-sync enabled**
   - GitBook will automatically update when you push to GitHub
   - Changes in `/docs` folder trigger rebuilds

### Option 2: Self-Hosted

If you prefer self-hosting:

```bash
# Install GitBook CLI
npm install -g gitbook-cli

# Navigate to docs folder
cd docs

# Install dependencies
gitbook install

# Serve locally
gitbook serve

# Build static site
gitbook build
```

Deploy the `_book` folder to any static hosting (Vercel, Netlify, etc.)

## Structure

```
docs/
├── README.md                          # Introduction page
├── SUMMARY.md                         # Table of contents (sidebar)
├── .gitbook.yaml                      # GitBook configuration
├── how-it-works/                      # How It Works section
│   ├── overview.md
│   ├── trust-score-algorithm.md
│   ├── smart-contract-flow.md
│   ├── vouching-mechanics.md
│   ├── reputation-system.md
│   ├── risk-and-defaults.md
│   └── technical-stack.md
├── vision.md                          # Vision & Roadmap
├── research.md                        # Research
└── whitepaper.md                      # White Paper
```

## Editing Documentation

### Adding a New Page

1. Create a markdown file in the appropriate folder
2. Add entry to `SUMMARY.md`:
```markdown
* [Page Title](path/to/page.md)
```

### Organizing Sections

Use nested lists in `SUMMARY.md`:
```markdown
## Section Name
* [Page 1](section/page1.md)
* [Page 2](section/page2.md)
  * [Subpage](section/page2/subpage.md)
```

### Links Between Pages

Use relative paths:
```markdown
See [Trust Score Algorithm](trust-score-algorithm.md) for details.
See [Overview](how-it-works/overview.md) from root.
```

## Markdown Features

GitBook supports:
- ✅ Standard markdown
- ✅ Code blocks with syntax highlighting
- ✅ Tables
- ✅ Callout blocks (hints, warnings, success)
- ✅ Embedded content (YouTube, CodePen, etc.)
- ✅ Math equations (LaTeX)

### Callout Blocks

```markdown
{% hint style="info" %}
This is an info callout
{% endhint %}

{% hint style="warning" %}
This is a warning
{% endhint %}

{% hint style="success" %}
This is a success message
{% endhint %}
```

### Code Blocks

````markdown
```solidity
function contribute(uint256 amount) external {
    // Solidity code here
}
```
````

## Custom Domain Setup

### DNS Configuration

Add these records to your DNS provider:

```
Type: CNAME
Name: docs
Value: hosting.gitbook.io
```

Wait for DNS propagation (up to 24 hours).

### Verify in GitBook

1. Go to Space Settings → Domain
2. Enter `docs.lendfriend.org`
3. Click "Verify"

## Troubleshooting

### Build Errors

If GitBook fails to build:
1. Check `SUMMARY.md` for broken links
2. Ensure all referenced files exist
3. Verify markdown syntax (use a validator)

### Sync Issues

If changes don't appear:
1. Check GitBook integration settings
2. Manually trigger sync in GitBook dashboard
3. Verify GitHub webhook is active

## Migration Checklist

- [x] Create docs structure
- [x] Migrate How It Works content
- [ ] Migrate Vision & Roadmap
- [ ] Migrate Research content
- [ ] Migrate White Paper
- [ ] Set up GitBook account
- [ ] Configure custom domain
- [ ] Update main site links
- [ ] Test all internal links
- [ ] Add search functionality
- [ ] Set up analytics (optional)

## Resources

- [GitBook Documentation](https://docs.gitbook.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitBook GitHub Integration](https://docs.gitbook.com/integrations/git-sync)
