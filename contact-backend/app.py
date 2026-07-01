from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
CORS(app)

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)


@app.route("/")
def home():
    return "Portfolio Contact API is running!"

@app.route("/test")
def test():
    try:
        msg = Message(
            subject="Portfolio Test Email",
            sender=app.config["MAIL_USERNAME"],
            recipients=[app.config["MAIL_USERNAME"]]
        )

        msg.body = "Congratulations! Your Flask email backend is working."

        mail.send(msg)

        return "✅ Email sent successfully!"

    except Exception as e:
        return f"❌ Error: {str(e)}"

@app.route("/contact", methods=["POST"])
def contact():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    if not all([name, email, subject, message]):
        return jsonify({"success": False, "message": "All fields are required."}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact: {subject}",
            sender=app.config["MAIL_USERNAME"],
            recipients=[app.config["MAIL_USERNAME"]],
        )

        msg.body = f"""
Name: {name}

Email: {email}

Subject: {subject}

Message:
{message}
"""

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "Message sent successfully!"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)