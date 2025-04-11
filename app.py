from flask import Flask, request, render_template, redirect, url_for, jsonify, session
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey123'  # Replace with a strong key in production

USER_FILE = 'users.csv'
REPORT_FILE = 'reports.csv'

# Helper functions
def load_users():
    if os.path.exists(USER_FILE):
        return pd.read_csv(USER_FILE)
    return pd.DataFrame(columns=["id", "name", "email", "password", "role"])

def save_users(df):
    df.to_csv(USER_FILE, index=False)

def load_reports():
    if os.path.exists(REPORT_FILE):
        return pd.read_csv(REPORT_FILE)
    return pd.DataFrame(columns=["report_id", "title", "description", "location", "status", "problem_type", "user_id"])

def save_reports(df):
    df.to_csv(REPORT_FILE, index=False)

# Home page redirects to login
@app.route('/')
def index():
    return redirect(url_for('login'))

# Login (handles both GET and POST)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        df = load_users()  # Load users from the CSV file
        user = df[(df['email'] == email) & (df['password'] == password)]

        if not user.empty:
            print("Login successful")  # Debug print
            session['user_id'] = int(user.iloc[0]['id'])
            session['user_name'] = user.iloc[0]['name']
            session['email'] = user.iloc[0]['email']
            session['role'] = user.iloc[0].get('role', 'user')  # Save the role to session

            # Redirect to the appropriate dashboard based on the role
            if session['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('dashboard'))
        else:
            print("Invalid credentials")  # Debug print
            return render_template('login.html', error="Invalid email or password.")

    return render_template('login.html')

# Dashboard after login
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:  # Ensure the user is logged in
        return redirect(url_for('login'))

    reports_df = load_reports()
    reports = reports_df.to_dict(orient='records')
    return render_template('index.html', reports=reports, user=session.get('user_name'))

# Admin Panel (Dashboard)
@app.route('/admin_dashboard')
def admin_dashboard():
    if 'user_id' not in session or session.get('role') != 'admin':  # Check for admin role in session
        print("Redirecting to login from admin panel.")  # Debugging line
        return redirect(url_for('login'))  # Redirect if not logged in or not admin

    df = load_reports()
    reports = df.to_dict(orient='records')
    return render_template('admin.html', reports=reports)

# Registration
@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']

    df = load_users()

    if email in df['email'].values:
        return render_template('login.html', error="Email already registered.")

    new_id = df['id'].max() + 1 if not df.empty else 1
    new_user = pd.DataFrame([{
        'id': new_id,
        'name': name,
        'email': email,
        'password': password,
        'role': 'user'  # Default to user role
    }])

    df = pd.concat([df, new_user], ignore_index=True)
    save_users(df)

    return render_template('login.html', message="Registration successful. Please log in.")

# Report form page
@app.route('/report')
def report():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('report.html')

# Submit report
@app.route('/submit_report', methods=['POST'])
def submit_report():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    title = request.form['title']
    description = request.form['description']
    location = request.form['location']
    problem_type = request.form['problemType']
    user_id = session['user_id']

    df = load_reports()
    report_id = df['report_id'].max() + 1 if not df.empty else 1

    new_report = {
        'report_id': report_id,
        'title': title,
        'description': description,
        'location': location,
        'problem_type': problem_type,
        'user_id': user_id,
        'status': 'In progress'
    }

    df = pd.concat([df, pd.DataFrame([new_report])], ignore_index=True)
    save_reports(df)

    return redirect(url_for('dashboard'))

# Route to delete a report
@app.route('/delete_report/<int:report_id>', methods=['POST'])
def delete_report(report_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))  # Ensure user is logged in and is an admin

    df = load_reports()
    df = df[df['report_id'] != report_id]  # Remove the report with the given ID
    save_reports(df)  # Save the updated reports back to CSV

    return redirect(url_for('admin_dashboard'))

# Route to mark a report as resolved
@app.route('/mark_resolved/<int:report_id>', methods=['POST'])
def mark_resolved(report_id):
    if 'user_id' not in session or session.get('role') != 'admin':
        return redirect(url_for('login'))  # Ensure user is logged in and is an admin

    df = load_reports()
    report = df[df['report_id'] == report_id]
    if not report.empty:
        df.loc[df['report_id'] == report_id, 'status'] = 'Resolved'  # Update the status to 'Resolved'
        save_reports(df)  # Save the updated reports back to CSV

    return redirect(url_for('admin_dashboard'))

@app.route('/reset')
def reset():
    return render_template('reset.html')

@app.route('/reset', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form['email']
        users = load_users()
        user = users[users['email'] == email]

        if user.empty:
            return render_template('reset.html', error="Email not found.")
        else:
            # For now, just acknowledge it; you could add email functionality here
            return render_template('reset.html', message="A reset link would be sent to your email.")
    
    return render_template('reset.html')

# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
