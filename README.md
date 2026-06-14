# Contact Management Dashboard

Production-style Angular coding exercise for a contact management dashboard. The UI is structured to match the linked Figma direction with a responsive sidebar layout, polished detail cards, and mock API integration.

## Overview

This project implements a single-page `/contacts` dashboard that:

- fetches contacts from MockAPI
- shows a searchable contact list in a left sidebar
- loads selected contact email addresses on demand
- handles loading, empty, and error states
- keeps the component structure clean and scalable

## Features

- Angular 20 standalone application with TypeScript, HTML, and SCSS
- Responsive contacts dashboard for desktop, tablet, and mobile
- Search by name, email summary, phone, or company
- Selected-state sidebar list with keyboard-friendly buttons
- Contact details view with primary email, all email addresses, address, location, and timeline
- Environment-based API base URL
- HTTP interceptor for relative API paths
- Unit tests for service, rendering, details view, and search behavior

## Tech Stack

- Angular
- TypeScript
- RxJS
- SCSS
- Karma + Jasmine
- MockAPI

## Folder Structure

```text
src/
  app/
    core/
      interceptors/
      models/
      services/
    features/
      contacts/
        components/
        models/
        pages/
        services/
    shared/
      components/
      pipes/
      utils/
  environments/
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the MockAPI base URL in [src/environments/environment.ts](/d:/contact-management/src/environments/environment.ts:1).
   The project is configured to use the evaluation MockAPI directly.

3. Start the app:

   ```bash
   npm start
   ```

4. Open `http://localhost:4200/contacts`.

## MockAPI Setup

MockAPI base URL:

```text
https://6a2da4d72edd4cb330d1569e.mockapi.io
```

### `contacts`

Endpoint:

```text
GET /Contacts
```

Recommended fields:

```json
{
  "id": "1",
  "firstName": "Ava",
  "lastName": "Patel",
  "company": "Northwind Support",
  "jobTitle": "Customer Success Manager",
  "phone": "+1 (415) 555-0100",
  "address": "128 Market Street",
  "city": "San Francisco",
  "country": "USA",
  "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "createdAt": "2026-05-11T09:10:00.000Z",
  "updatedAt": "2026-06-10T13:22:00.000Z"
}
```

Optional summary fields supported by this UI for better list/search behavior:

```json
{
  "email": "ava.patel@northwind.com",
  "primaryEmail": "ava.patel@northwind.com"
}
```

### `email_addresses`

Selected contact email endpoint:

```text
GET /Contacts/{contactId}/email_addresses
```

## Environment Configuration

Update:

- [src/environments/environment.ts](/d:/contact-management/src/environments/environment.ts:1)

Example:

```ts
export const environment = {
  useLocalMockData: false,
  apiBaseUrl: 'https://6a2da4d72edd4cb330d1569e.mockapi.io'
};
```

## Run Locally

```bash
npm start
```

## Run Tests

```bash
npm test
```

## Assumptions

- Detailed email addresses are fetched only for the selected contact from `GET /Contacts/{contactId}/email_addresses`.
- The selected contact defaults to the first returned contact after a successful contacts fetch.

## Limitations / Simplifications

- Create/edit/delete flows are intentionally out of scope for the evaluation brief.
- The current implementation assumes the evaluator's MockAPI project remains available at the configured base URL.
- There is one environment file for local evaluation instead of a full environment matrix.

## Loom Demo

Add Loom demo link here:

```text
https://www.loom.com/share/<replace-with-demo-link>
```

## GitHub Submission

1. Push the project to a public GitHub repository.
2. Ensure `environment.ts` contains only the evaluation-safe mock URL.
3. Include the Loom demo link in this README before submission.
4. Share the repository URL and Loom link with the reviewer.
