# Curapath

Curapath is a healthcare application designed to help patients track and manage their treatment plans. It provides a multilingual interface, progress tracking, and follow-up management features.

## Features

- **Treatment Plan Management**: View and track prescribed treatment steps
- **Multilingual Support**: Translate treatment plans into multiple languages
- **Progress Tracking**: Visual representation of recovery progress
- **Follow-up Management**: Track completion of treatment steps with reminders
- **Email Notifications**: Receive reminders for upcoming and overdue steps

## Project Structure

```
curapath/
├── curapath-frontend/       # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── services/        # API and database services
├── functions/               # Netlify serverless functions
├── netlify.toml             # Netlify configuration
```

## Tech Stack

- **Frontend**: React, React Router, Chart.js
- **Backend**: Netlify Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **API Integration**: Google Translate API
- **Deployment**: Netlify

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/curapath.git
   cd curapath
   ```

2. Install dependencies:
   ```
   npm install
   cd curapath-frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `curapath-frontend` directory with the following variables:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Database Setup

1. Create a new project in [Supabase](https://supabase.io/)
2. Create the following tables:
   - `patients`: Store patient information
   - `treatment_steps`: Store treatment plan steps with completion status

### Schema

#### patients
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### treatment_steps
```sql
CREATE TABLE treatment_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `curapath-frontend/build`
4. Set environment variables in the Netlify UI

## License

This project is licensed under the MIT License. 