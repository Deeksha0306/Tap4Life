from flask import Flask, jsonify, request, session
from flask_cors import CORS
import bcrypt
from flask_mysqldb import MySQL

app = Flask(__name__)

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'devdatabase'
app.secret_key = 'your_secret_key_change_this_in_production'

# Fix CORS - only initialize once with credentials
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

mysql = MySQL(app)

@app.route('/api/home')
def api_home():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

# ----register api----
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # check if email exists
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    if user:
        cursor.close()
        return jsonify({"success": False, "message": "Email already taken"}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"success": True, "message": "Registered successfully"})

# -----login api-----
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')    

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
        # SET SESSION HERE
        session['user_id'] = user[0]
        return jsonify({"success": True, "message": "Login successful", "user_id": user[0]})
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

# ADD THIS NEW ENDPOINT - Get user by ID
@app.route('/api/user/<int:user_id>', methods=['GET'])
def api_get_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({"success": True, "user": {"id": user[0], "name": user[1], "email": user[2]}})
    
    return jsonify({"success": False, "message": "User not found"}), 404
    
# -----dashboard api------ 
@app.route('/api/dashboard', methods=['GET'])
def api_dashboard():
    if 'user_id' in session:
        user_id = session['user_id']
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()
        cursor.close()

        if user:
            return jsonify({"success": True, "user": {"id": user[0], "name": user[1], "email": user[2]}})
        
    return jsonify({"success": False, "message": "Unauthorized"}), 401

# -----logout api-----
@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out successfully"})


# Get user medical info
@app.route('/api/medical-info/<int:user_id>', methods=['GET'])
def get_medical_info(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT blood_group, allergies, medical_conditions, age FROM users WHERE id=%s", (user_id,))
    medical = cursor.fetchone()
    cursor.close()
    
    if medical:
        return jsonify({
            "success": True,
            "medical_info": {
                "blood_group": medical[0],
                "allergies": medical[1],
                "medical_conditions": medical[2],
                "age": medical[3]
            }
        })
    return jsonify({"success": False}), 404

# Update medical info
@app.route('/api/medical-info/<int:user_id>', methods=['PUT'])
def update_medical_info(user_id):
    data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute(
        "UPDATE users SET blood_group=%s, allergies=%s, medical_conditions=%s, age=%s WHERE id=%s",
        (data.get('bloodGroup'), data.get('allergies'), data.get('medicalConditions'), data.get('age'), user_id)
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({"success": True})



# Get emergency contacts
@app.route('/api/emergency-contacts/<int:user_id>', methods=['GET'])
def get_emergency_contacts(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, name, relation, phone FROM emergency_contacts WHERE user_id=%s", (user_id,))
    contacts = cursor.fetchall()
    cursor.close()
    
    return jsonify({
        "success": True,
        "contacts": [{"id": c[0], "name": c[1], "relation": c[2], "phone": c[3]} for c in contacts]
    })

# Add emergency contact
@app.route('/api/emergency-contacts', methods=['POST'])
def add_emergency_contact():
    data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO emergency_contacts (user_id, name, relation, phone) VALUES (%s, %s, %s, %s)",
        (data['user_id'], data['name'], data['relation'], data['phone'])
    )
    mysql.connection.commit()
    cursor.close() 
    return jsonify({"success": True})


if __name__ == '__main__':
    app.run(debug=True)