# Company AI Tool Directory

## Product Requirements Document (PRD)

**Version:** 3.0
**Status:** Ready for Development
**Last Updated:** June 2026

---

# Overview

The Company AI Tool Directory is an internal knowledge platform that enables team members to discover, evaluate, submit, manage, and track AI tools used across the organization.

The platform acts as a centralized repository where employees can:

* Browse AI tools
* Search and filter tools
* Submit new tools
* Upvote useful tools
* Import tools via JSON
* Export directory data
* Track member contributions
* Manage tools through an admin dashboard

The goal is to create a single source of truth for AI tool discovery while maintaining zero or minimal infrastructure cost.

---

# Problem Statement

AI tools are currently discovered through:

* Slack conversations
* Team chats
* Personal bookmarks
* Shared documents
* Word-of-mouth recommendations

This creates:

* Duplicate research effort
* Knowledge silos
* Poor discoverability
* Lack of standard evaluation
* No contributor visibility
* No historical tracking

The AI Tool Directory solves these issues by providing a searchable, structured, and collaborative repository.

---

# Goals

## Business Goals

* Centralize AI tool knowledge
* Increase AI adoption
* Reduce duplicate research
* Encourage collaboration
* Measure participation

## User Goals

* Find tools quickly
* Share discoveries easily
* Compare alternatives
* Learn from peers
* Save research time

---

# User Types

## Team Member

Responsible for:

* Discovering tools
* Submitting tools
* Using tools

### Goals

* Find relevant tools quickly
* Share discoveries
* Learn new workflows

---

## Team Lead

Responsible for:

* Monitoring participation
* Encouraging adoption

### Goals

* Track engagement
* Measure contributions

---

## Administrator

Responsible for:

* Managing directory quality
* Reviewing submissions

### Goals

* Remove duplicates
* Maintain clean data
* Export backups

---

# Navigation Structure

```text
Dashboard
│
├── Browse Tools
│   └── Tool Detail
│
├── Add Tool
│
├── Import Tools
│
├── Member Analytics
│
├── Daily Activity Log
│
└── Admin Panel
```

---

# Screen 1: Dashboard

## Purpose

Landing page showing directory health and activity.

## Components

### Stats Cards

* Total Tools
* API Tools
* Free Tools
* New This Week
* Total Contributors

### Sections

* Recently Added Tools
* Top Voted Tools
* Popular Categories
* Recent Activity

### User Actions

* Search tools
* Browse categories
* Open tool details

---

# Screen 2: Browse Tools

## Purpose

Primary discovery experience.

## Components

### Search

Search across:

* Tool Name
* Description
* Features
* Use Cases
* Tags

### Filters

* Category
* Pricing
* API Available
* Free Plan
* Open Source
* Automation Support

### Sorting

* Top Voted
* Newest
* A-Z
* Last Updated

### Tool Cards

Display:

* Tool Name
* Category
* Description
* Tags
* Vote Count
* Website Link

---

# Screen 3: Tool Detail

## Purpose

Full tool information.

## Sections

### Overview

* Tool Name
* Website
* Category
* Description

### Features

* Main Features
* AI Capabilities

### Technical

* API Available
* Supported Models
* Automation Support
* Real-Time Generation

### Business

* Pricing
* Free Plan
* Community Support

### Additional

* Use Cases
* Notes
* Last Updated

---

# Screen 4: Add Tool

## Purpose

Submit a new tool.

## Form Fields

### Basic Information

* Tool Name
* Website
* Category
* Short Description

### Features

* Main Features
* AI Capabilities
* Use Cases

### Technical

* API Available
* Open Source
* Supported Models
* Automation Support

### Business

* Pricing
* Community Support

### Additional

* Tags
* Notes

### Tracking

* Fill Time Tracking
* Duplicate Detection

---

# Screen 5: Import Tools

## Purpose

Bulk tool upload.

## Features

### Upload JSON

* Drag & Drop
* File Upload

### Paste JSON

Large text editor.

### Validation

Display:

* Total Records
* Valid Records
* Invalid Records
* Duplicate Records

### Actions

* Import
* Cancel
* Download Template

---

# Screen 6: Member Analytics

## Purpose

Track contributor activity.

## Metrics

### Member Statistics

* Total Tools Added
* Average Fill Time
* First Submission
* Last Submission

### Visual Analytics

* Activity Bar
* Leaderboard
* Contribution Ranking

### Filters

* From Date
* To Date

---

# Screen 7: Daily Activity Log

## Purpose

View contribution history.

## Features

### Daily Timeline

Display:

* Submission Date
* Tool Name
* Contributor Name

### Filters

* Date Range
* Category
* Contributor

### Sorting

* Newest First

---

# Screen 8: Admin Panel

## Purpose

Manage directory data.

## Features

### Tool Table

Display:

* Tool Name
* Category
* Pricing
* API Status
* Votes
* Last Updated

### Actions

* Edit Tool
* Delete Tool
* Export JSON
* Clear All

### Search

Real-time admin search.

---

# Data Schema

## Tool Record

| #  | Field                |
| -- | -------------------- |
| 1  | ID                   |
| 2  | Tool Name            |
| 3  | Website              |
| 4  | Category             |
| 5  | Short Description    |
| 6  | Main Features        |
| 7  | AI Capabilities      |
| 8  | API Available        |
| 9  | Open Source          |
| 10 | Free Plan            |
| 11 | Best For             |
| 12 | Use Cases            |
| 13 | Supported Models     |
| 14 | Real-Time Generation |
| 15 | Automation Support   |
| 16 | Ease Of Use          |
| 17 | Pricing              |
| 18 | Community Support    |
| 19 | Tags                 |
| 20 | Notes                |
| 21 | Last Updated         |

### System Fields

* createdAt
* updatedAt
* voteCount
* fillTimeSec
* importedAt
* addedBy

---

# Functional Requirements

## Core Features

### FR-01

Browse tools.

### FR-02

Real-time search.

### FR-03

Multi-filter support.

### FR-04

Sorting support.

### FR-05

Tag browsing.

### FR-06

Tool detail page.

### FR-07

Upvote functionality.

### FR-08

Add Tool form.

### FR-09

Duplicate detection.

### FR-10

JSON Import.

### FR-11

JSON Export.

### FR-12

Admin Dashboard.

### FR-13

Member Dashboard.

### FR-14

Daily Activity Logs.

### FR-15

Google Sheets Integration.

---

# JSON Import Requirements

## Supported Input

```json
[
  {
    "name": "ChatGPT",
    "website": "https://chatgpt.com",
    "category": "Writing",
    "pricing": "Freemium",
    "apiAvailable": "Yes"
  }
]
```

## Rules

* name required
* invalid rows skipped
* defaults applied automatically
* duplicates flagged
* import summary displayed

---

# Analytics Requirements

Track:

* Total Views
* Search Volume
* Popular Categories
* Popular Tags
* Top Contributors
* Average Fill Time
* Submission Trends

---

# Technical Stack

## Frontend

* Next.js
* TypeScript
* TailwindCSS

## State Management

* React Context

## Storage

* Google Sheets

## Import Engine

* JSON Validation
* CSV Parsing

## Hosting

* Vercel
* GitHub Pages

---

# Non-Functional Requirements

## Performance

* Page Load < 2 Seconds
* Search < 100ms
* Filter < 100ms

## Scalability

* 10,000+ Tools
* 100+ Contributors

## Accessibility

* WCAG 2.1 AA

## Browser Support

* Chrome
* Firefox
* Safari
* Edge

## Mobile Support

Fully Responsive

---

# MVP Deliverables

### Phase 1

* Dashboard
* Browse Tools
* Tool Detail
* Add Tool
* Admin Panel

### Phase 2

* JSON Import
* JSON Export
* Member Analytics

### Phase 3

* Activity Logs
* Duplicate Detection
* Audit Logs

---

# Future Roadmap

## V3.1

* Bookmarks
* Favorites

## V3.2

* Slack Integration
* Weekly Reports

## V4.0

* Authentication
* Role Management

## V5.0

* AI Recommendations
* AI Categorization
* Tool Comparison Engine

---

# Success Criteria

* Users can discover tools quickly
* Contributors can submit tools easily
* Admins can manage directory efficiently
* Analytics accurately track participation
* Platform remains performant with 10,000+ records

---

**Company AI Tool Directory**
**PRD Version 3.0**
**Internal Use Only**
