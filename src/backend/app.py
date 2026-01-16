"""
User Management System - Flask Backend API
Provides RESTful endpoints for user management
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database')
USERS_CSV = os.path.join(DATABASE_DIR, 'users.csv')

# Ensure database directory exists
os.makedirs(DATABASE_DIR, exist_ok=True)

# Initialize CSV files if they don't exist
def init_database():
    """Initialize CSV database files with headers"""
    if not os.path.exists(USERS_CSV):
        with open(USERS_CSV, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'name', 'email', 'mobile', 'age', 'address', 'created_at'])
            # Add sample users
            sample_users = [
                [str(uuid.uuid4()), 'John Doe', 'john.doe@example.com', '+1-555-0101', '28', '123 Main St, New York, NY', datetime.now().isoformat()],
                [str(uuid.uuid4()), 'Jane Smith', 'jane.smith@example.com', '+1-555-0102', '32', '456 Oak Ave, Los Angeles, CA', datetime.now().isoformat()],
                [str(uuid.uuid4()), 'Robert Johnson', 'robert.j@example.com', '+1-555-0103', '45', '789 Pine Rd, Chicago, IL', datetime.now().isoformat()],
                [str(uuid.uuid4()), 'Sarah Williams', 'sarah.w@example.com', '+1-555-0104', '29', '321 Elm St, Houston, TX', datetime.now().isoformat()],
                [str(uuid.uuid4()), 'Michael Brown', 'michael.b@example.com', '+1-555-0105', '38', '654 Maple Dr, Phoenix, AZ', datetime.now().isoformat()],
            ]
            writer.writerows(sample_users)

init_database()

# Helper Functions
def read_csv(filepath):
    """Read CSV file and return list of dictionaries"""
    if not os.path.exists(filepath):
        return []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def write_csv(filepath, data, fieldnames):
    """Write data to CSV file"""
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'User Management System API',
        'timestamp': datetime.now().isoformat()
    })

# ==================== USER ENDPOINTS ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = read_csv(USERS_CSV)
        
        return jsonify({
            'success': True,
            'data': users,
            'count': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user by ID"""
    try:
        users = read_csv(USERS_CSV)
        user = next((u for u in users if u['id'] == user_id), None)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('name') or len(data['name'].strip()) < 2:
            return jsonify({'success': False, 'error': 'Name must be at least 2 characters'}), 400
        
        if not data.get('email') or not validate_email(data['email']):
            return jsonify({'success': False, 'error': 'Invalid email address'}), 400
        
        if not data.get('mobile') or not validate_mobile(data['mobile']):
            return jsonify({'success': False, 'error': 'Invalid mobile number (minimum 10 digits)'}), 400
        
        if not data.get('age'):
            return jsonify({'success': False, 'error': 'Age is required'}), 400
        
        try:
            age = int(data['age'])
            if age < 1 or age > 150:
                return jsonify({'success': False, 'error': 'Age must be between 1 and 150'}), 400
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid age format'}), 400
        
        if not data.get('address') or len(data['address'].strip()) < 5:
            return jsonify({'success': False, 'error': 'Address must be at least 5 characters'}), 400
        
        # Check if email already exists
        users = read_csv(USERS_CSV)
        if any(u['email'].lower() == data['email'].lower() for u in users):
            return jsonify({'success': False, 'error': 'Email already registered'}), 409
        
        # Create new user
        new_user = {
            'id': str(uuid.uuid4()),
            'name': data['name'].strip(),
            'email': data['email'].strip().lower(),
            'mobile': data['mobile'].strip(),
            'age': str(age),
            'address': data['address'].strip(),
            'created_at': datetime.now().isoformat()
        }
        
        users.append(new_user)
        write_csv(USERS_CSV, users, ['id', 'name', 'email', 'mobile', 'age', 'address', 'created_at'])
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'data': new_user
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update an existing user"""
    try:
        data = request.get_json()
        users = read_csv(USERS_CSV)
        
        user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
        
        if user_index is None:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        # Update fields with validation
        if 'name' in data:
            if len(data['name'].strip()) < 2:
                return jsonify({'success': False, 'error': 'Name must be at least 2 characters'}), 400
            users[user_index]['name'] = data['name'].strip()
        
        if 'email' in data:
            if not validate_email(data['email']):
                return jsonify({'success': False, 'error': 'Invalid email address'}), 400
            # Check if email already exists for another user
            if any(u['email'].lower() == data['email'].lower() and u['id'] != user_id for u in users):
                return jsonify({'success': False, 'error': 'Email already registered'}), 409
            users[user_index]['email'] = data['email'].strip().lower()
        
        if 'mobile' in data:
            if not validate_mobile(data['mobile']):
                return jsonify({'success': False, 'error': 'Invalid mobile number'}), 400
            users[user_index]['mobile'] = data['mobile'].strip()
        
        if 'age' in data:
            try:
                age = int(data['age'])
                if age < 1 or age > 150:
                    return jsonify({'success': False, 'error': 'Age must be between 1 and 150'}), 400
                users[user_index]['age'] = str(age)
            except ValueError:
                return jsonify({'success': False, 'error': 'Invalid age format'}), 400
        
        if 'address' in data:
            if len(data['address'].strip()) < 5:
                return jsonify({'success': False, 'error': 'Address must be at least 5 characters'}), 400
            users[user_index]['address'] = data['address'].strip()
        
        write_csv(USERS_CSV, users, ['id', 'name', 'email', 'mobile', 'age', 'address', 'created_at'])
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'data': users[user_index]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        users = read_csv(USERS_CSV)
        user = next((u for u in users if u['id'] == user_id), None)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        users = [u for u in users if u['id'] != user_id]
        write_csv(USERS_CSV, users, ['id', 'name', 'email', 'mobile', 'age', 'address', 'created_at'])
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== STATISTICS ENDPOINTS ====================

@app.route('/api/users/stats/summary', methods=['GET'])
def get_stats():
    """Get user statistics"""
    try:
        users = read_csv(USERS_CSV)
        
        if not users:
            return jsonify({
                'success': True,
                'data': {
                    'total_users': 0,
                    'average_age': 0,
                    'age_distribution': {}
                }
            }), 200
        
        # Calculate statistics
        ages = [int(u['age']) for u in users if u['age'].isdigit()]
        average_age = sum(ages) / len(ages) if ages else 0
        
        # Age distribution
        age_ranges = {
            '0-18': 0,
            '19-30': 0,
            '31-50': 0,
            '51+': 0
        }
        
        for age in ages:
            if age <= 18:
                age_ranges['0-18'] += 1
            elif age <= 30:
                age_ranges['19-30'] += 1
            elif age <= 50:
                age_ranges['31-50'] += 1
            else:
                age_ranges['51+'] += 1
        
        return jsonify({
            'success': True,
            'data': {
                'total_users': len(users),
                'average_age': round(average_age, 1),
                'age_distribution': age_ranges
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 User Management System API Starting...")
    print(f"📁 Database Directory: {DATABASE_DIR}")
    print(f"👥 Users CSV: {USERS_CSV}")
    print("✅ Server running on http://127.0.0.1:5000")
    print("📚 API Documentation: http://127.0.0.1:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)